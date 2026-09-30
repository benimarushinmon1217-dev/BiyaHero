import { useCallback, useEffect, useState } from 'react'
import { Pencil, Trash2, Wallet } from 'lucide-react'
import { BATANGAS_MUNICIPALITIES } from '../utils/batangasScope'
import { calculateFare, createTrip, deleteTrip, getSavedPlaces, getTrips, updateTrip } from '../services/accountService'
import { useAuth } from '../context/AuthContext'
import BiyaHeroSelect from '../components/BiyaHeroSelect'

const today = () => {
    const date = new Date()
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
const emptyForm = (passengerType = 'regular') => ({
    originName: '',
    originMunicipality: 'Lipa City',
    destinationName: '',
    destinationMunicipality: 'Lipa City',
    transportType: 'jeepney',
    passengerType,
    distance: '',
    fare: '',
    baselineFare: '',
    tripDate: today()
})

const FareCalculator = () => {
    const { user } = useAuth()
    const profilePassengerType = user?.passengerType || user?.preferences?.passengerType
    const defaultPassengerType = ['regular', 'student', 'senior', 'pwd'].includes(profilePassengerType)
        ? profilePassengerType
        : 'regular'
    const [records, setRecords] = useState([])
    const [savedPlaces, setSavedPlaces] = useState([])
    const [form, setForm] = useState(() => emptyForm(defaultPassengerType))
    const [editingId, setEditingId] = useState(null)
    const [recentTripId, setRecentTripId] = useState('')
    const [originSavedPlaceId, setOriginSavedPlaceId] = useState('')
    const [destinationSavedPlaceId, setDestinationSavedPlaceId] = useState('')
    const [loading, setLoading] = useState(true)
    const [savedPlacesLoading, setSavedPlacesLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [estimating, setEstimating] = useState(false)
    const [error, setError] = useState('')
    const [savedPlacesError, setSavedPlacesError] = useState('')

    const loadRecords = useCallback(async () => {
        setLoading(true)
        try {
            setRecords(await getTrips())
            setError('')
        } catch (requestError) {
            setError(requestError.friendlyMessage || 'Fare records are temporarily unavailable.')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { loadRecords() }, [loadRecords])

    useEffect(() => {
        let active = true
        getSavedPlaces()
            .then(places => { if (active) setSavedPlaces(places) })
            .catch(requestError => {
                if (active) setSavedPlacesError(requestError.friendlyMessage || 'Saved places are temporarily unavailable. You can still enter locations manually.')
            })
            .finally(() => { if (active) setSavedPlacesLoading(false) })
        return () => { active = false }
    }, [])

    useEffect(() => {
        if (defaultPassengerType) {
            setForm(previous => previous.passengerType === 'regular'
                ? { ...previous, passengerType: defaultPassengerType }
                : previous)
        }
    }, [defaultPassengerType])

    const updateField = field => event => {
        const { value } = event.target
        setForm(previous => ({ ...previous, [field]: value }))
        if (field === 'originName') setOriginSavedPlaceId('')
        if (field === 'destinationName') setDestinationSavedPlaceId('')
        if (field === 'originName' || field === 'destinationName') setRecentTripId('')
    }
    const updateSelectField = field => value => {
        setForm(previous => ({ ...previous, [field]: value }))
        if (field === 'originMunicipality' || field === 'destinationMunicipality') setRecentTripId('')
    }
    const totalSpent = records.reduce((sum, record) => sum + Number(record.fare || 0), 0)
    const totalSavings = records.reduce((sum, record) => sum + Number(record.savings || 0), 0)
    const recentTrips = [...records]
        .filter(record => record.originName && record.destinationName)
        .sort((first, second) => new Date(second.tripDate || 0) - new Date(first.tripDate || 0))
        .slice(0, 10)

    const selectRecentTrip = id => {
        const trip = recentTrips.find(record => record.id === id)
        setRecentTripId(trip?.id || '')
        setOriginSavedPlaceId('')
        setDestinationSavedPlaceId('')
        if (!trip) return
        setEditingId(null)
        const supportedTransportTypes = ['jeepney', 'tricycle', 'bus', 'uv_express', 'van', 'walking']
        const recordedTransportTypes = String(trip.transportType || '')
            .split(',')
            .map(type => type.trim().toLowerCase())
        const segmentTransportType = trip.segments?.find(segment =>
            supportedTransportTypes.includes(String(segment.transportType || '').toLowerCase())
        )?.transportType?.toLowerCase()
        const transportType = recordedTransportTypes.find(type => supportedTransportTypes.includes(type))
            || (supportedTransportTypes.includes(segmentTransportType) ? segmentTransportType : '')
        setForm(previous => ({
            ...previous,
            originName: trip.originName || '',
            originMunicipality: trip.originMunicipality || previous.originMunicipality,
            destinationName: trip.destinationName || '',
            destinationMunicipality: trip.destinationMunicipality || previous.destinationMunicipality,
            transportType: transportType || previous.transportType,
            passengerType: trip.passengerType || defaultPassengerType || previous.passengerType,
            distance: trip.distance == null ? '' : String(trip.distance),
            fare: trip.fare == null ? '' : String(trip.fare),
            baselineFare: trip.baselineFare == null ? '' : String(trip.baselineFare),
            tripDate: today()
        }))
    }

    const selectSavedPlace = (side, id) => {
        const place = savedPlaces.find(savedPlace => savedPlace.id === id)
        const isOrigin = side === 'origin'
        if (isOrigin) setOriginSavedPlaceId(id)
        else setDestinationSavedPlaceId(id)
        if (!place) return
        setRecentTripId('')
        setForm(previous => ({
            ...previous,
            [`${side}Name`]: place.name,
            [`${side}Municipality`]: place.municipality || previous[`${side}Municipality`]
        }))
    }

    const handleSubmit = async event => {
        event.preventDefault()
        setSubmitting(true)
        setError('')
        const payload = {
            ...form,
            fare: Number(form.fare),
            baselineFare: form.baselineFare === '' ? null : Number(form.baselineFare),
            tripDate: new Date(`${form.tripDate}T12:00:00`).toISOString(),
            source: 'expense',
            segments: [{ transportType: form.transportType, fare: Number(form.fare) }],
            transfers: 0,
            distance: form.distance === '' ? null : Number(form.distance)
        }
        try {
            if (editingId) await updateTrip(editingId, payload)
            else await createTrip(payload)
            setForm(emptyForm(defaultPassengerType))
            setEditingId(null)
            setRecentTripId('')
            setOriginSavedPlaceId('')
            setDestinationSavedPlaceId('')
            await loadRecords()
        } catch (requestError) {
            setError(requestError.friendlyMessage || requestError.response?.data?.error?.message || 'Unable to save this fare record.')
        } finally {
            setSubmitting(false)
        }
    }

    const estimateSegmentFare = async () => {
        const distance = Number(form.distance)
        if (!Number.isFinite(distance) || distance <= 0) {
            setError('Enter a positive distance in kilometers to estimate the fare.')
            return
        }
        setEstimating(true)
        setError('')
        try {
            const estimate = await calculateFare(
                distance,
                form.passengerType,
                form.transportType,
                form.originMunicipality,
                form.destinationMunicipality
            )
            setForm(previous => ({ ...previous, fare: String(estimate.total) }))
        } catch (requestError) {
            setError(requestError.friendlyMessage || 'Automatic fare estimate is temporarily unavailable.')
        } finally {
            setEstimating(false)
        }
    }

    const startEdit = record => {
        setEditingId(record.id)
        setRecentTripId('')
        setOriginSavedPlaceId('')
        setDestinationSavedPlaceId('')
        setForm({
            originName: record.originName || '',
            originMunicipality: record.originMunicipality || 'Lipa City',
            destinationName: record.destinationName || '',
            destinationMunicipality: record.destinationMunicipality || 'Lipa City',
            transportType: record.transportType || 'jeepney',
            passengerType: record.passengerType || defaultPassengerType,
            distance: record.distance == null ? '' : String(record.distance),
            fare: String(record.fare),
            baselineFare: record.baselineFare == null ? '' : String(record.baselineFare),
            tripDate: record.tripDate ? new Date(record.tripDate).toISOString().slice(0, 10) : today()
        })
    }

    const removeRecord = async id => {
        try {
            await deleteTrip(id)
            setRecords(previous => previous.filter(record => record.id !== id))
            if (editingId === id) {
                setEditingId(null)
                setForm(emptyForm(defaultPassengerType))
                setRecentTripId('')
                setOriginSavedPlaceId('')
                setDestinationSavedPlaceId('')
            }
        } catch (requestError) {
            setError(requestError.friendlyMessage || 'Unable to delete this fare record.')
        }
    }

    const getPeriodValue = period => records.reduce((total, record) => {
        const date = new Date(record.tripDate)
        const now = new Date()
        if (period === 'day' && date.toDateString() === now.toDateString()) return total + Number(record.fare)
        if (period === 'week') {
            const start = new Date(now)
            start.setHours(0, 0, 0, 0)
            start.setDate(now.getDate() - ((now.getDay() + 6) % 7))
            if (date >= start && date <= now) return total + Number(record.fare)
        }
        if (period === 'month' && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) return total + Number(record.fare)
        return total
    }, 0)

    if (loading) return <main className="container mx-auto px-4 py-10 text-center">Loading fare history…</main>

    return (
        <main className="container mx-auto max-w-5xl px-4 py-8 pb-24 md:pb-8 space-y-6">
            <header>
                <h1 className="text-3xl font-bold flex items-center gap-2"><Wallet /> Fare calculator & expense tracker</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Record actual trips and fares. Savings are counted only when you provide a comparison fare.</p>
            </header>
            {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-red-700 dark:bg-red-900/20 dark:text-red-300">{error}</p>}

            <section className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                {[
                    ['Today', getPeriodValue('day')],
                    ['This week', getPeriodValue('week')],
                    ['This month', getPeriodValue('month')],
                    ['Total spent', totalSpent],
                    ['Recorded savings', totalSavings]
                ].map(([label, amount]) => (
                    <div key={label} className="card !p-4">
                        <p className="text-xl font-bold">₱{Number(amount).toFixed(2)}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{label}</p>
                    </div>
                ))}
            </section>

            <section className="card" aria-labelledby="recent-trips-heading">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h2 id="recent-trips-heading" className="text-xl font-bold">Recent trips</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Choose a trip to prefill its details, then update the fare you paid.</p>
                    </div>
                </div>
                {recentTrips.length ? (
                    <div className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-2 md:grid md:grid-cols-2 md:overflow-visible lg:grid-cols-3">
                        {recentTrips.map(trip => (
                            <button
                                key={trip.id}
                                type="button"
                                aria-pressed={recentTripId === trip.id}
                                onClick={() => selectRecentTrip(trip.id)}
                                className={`min-w-[17rem] max-w-[22rem] snap-start rounded-xl border p-4 text-left transition-colors md:min-w-0 md:max-w-none ${
                                    recentTripId === trip.id
                                        ? 'border-primary-500 bg-primary-50 dark:border-cyan-500 dark:bg-primary-900/20'
                                        : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
                                }`}
                            >
                                <p className="font-semibold">{trip.originName} → {trip.destinationName}</p>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    {trip.transportType || 'Transport not specified'} · {trip.passengerType || defaultPassengerType} · ₱{Number(trip.fare || 0).toFixed(2)}
                                </p>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    {trip.tripDate ? new Date(trip.tripDate).toLocaleDateString() : 'Date unavailable'}
                                </p>
                                <span className="mt-3 inline-block text-sm font-semibold text-primary-700 dark:text-cyan-300">
                                    {recentTripId === trip.id ? 'Selected trip' : 'Use trip →'}
                                </span>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed border-gray-300 p-5 text-center dark:border-gray-700">
                        <p className="font-semibold">No recent trips yet.</p>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Once you record or complete a BiyaHero trip, it will appear here for quick reuse.</p>
                    </div>
                )}
            </section>

            <form onSubmit={handleSubmit} className="card space-y-4">
                <h2 className="text-xl font-bold">{editingId ? 'Edit fare record' : 'Add a trip'}</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="origin-saved-place" className="text-sm font-medium">Saved origin (optional)</label>
                        <BiyaHeroSelect
                            id="origin-saved-place"
                            ariaLabel="Saved origin"
                            value={originSavedPlaceId}
                            onChange={value => selectSavedPlace('origin', value)}
                            options={[
                                { value: '', label: savedPlacesLoading ? 'Loading saved places…' : 'Choose a saved place' },
                                ...savedPlaces.map(place => ({ value: place.id, label: `${place.name} · ${place.label}` }))
                            ]}
                        />
                        {!savedPlacesLoading && savedPlaces.length === 0 && <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">No saved places; enter an origin manually below.</p>}
                        <label htmlFor="origin-name" className="mt-2 block text-sm font-medium">Origin</label>
                        <input id="origin-name" required maxLength={120} value={form.originName} onChange={updateField('originName')} className="input-field mt-1" placeholder="Home, school, or landmark" />
                    </div>
                    <label className="text-sm font-medium">
                        Origin municipality
                        <BiyaHeroSelect
                            id="origin-municipality"
                            ariaLabel="Origin municipality"
                            value={form.originMunicipality}
                            onChange={updateSelectField('originMunicipality')}
                            options={[...new Set([...BATANGAS_MUNICIPALITIES, form.originMunicipality])].map(name => ({ value: name, label: name }))}
                        />
                    </label>
                    <div>
                        <label htmlFor="destination-saved-place" className="text-sm font-medium">Saved destination (optional)</label>
                        <BiyaHeroSelect
                            id="destination-saved-place"
                            ariaLabel="Saved destination"
                            value={destinationSavedPlaceId}
                            onChange={value => selectSavedPlace('destination', value)}
                            options={[
                                { value: '', label: savedPlacesLoading ? 'Loading saved places…' : 'Choose a saved place' },
                                ...savedPlaces.map(place => ({ value: place.id, label: `${place.name} · ${place.label}` }))
                            ]}
                        />
                        {!savedPlacesLoading && savedPlaces.length === 0 && <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">No saved places; enter a destination manually below.</p>}
                        <label htmlFor="destination-name" className="mt-2 block text-sm font-medium">Destination</label>
                        <input id="destination-name" required maxLength={120} value={form.destinationName} onChange={updateField('destinationName')} className="input-field mt-1" placeholder="School, work, or landmark" />
                    </div>
                    <label className="text-sm font-medium">
                        Destination municipality
                        <BiyaHeroSelect
                            id="destination-municipality"
                            ariaLabel="Destination municipality"
                            value={form.destinationMunicipality}
                            onChange={updateSelectField('destinationMunicipality')}
                            options={[...new Set([...BATANGAS_MUNICIPALITIES, form.destinationMunicipality])].map(name => ({ value: name, label: name }))}
                        />
                    </label>
                    <label className="text-sm font-medium">
                        Transport type
                        <BiyaHeroSelect
                            id="transport-type"
                            ariaLabel="Transport type"
                            value={form.transportType}
                            onChange={updateSelectField('transportType')}
                            options={['jeepney', 'tricycle', 'bus', 'uv_express', 'van', 'walking'].map(mode => ({ value: mode, label: mode.replace('_', ' ') }))}
                        />
                    </label>
                    <label className="text-sm font-medium">
                        Passenger type
                        <BiyaHeroSelect
                            id="fare-passenger-type"
                            ariaLabel="Passenger type"
                            value={form.passengerType}
                            onChange={updateSelectField('passengerType')}
                            options={[
                                { value: 'regular', label: 'Regular' },
                                { value: 'student', label: 'Student' },
                                { value: 'senior', label: 'Senior' },
                                { value: 'pwd', label: 'PWD' }
                            ]}
                        />
                    </label>
                    <label className="text-sm font-medium">Segment distance (km, optional)<input type="number" min="0.1" step="0.1" value={form.distance} onChange={updateField('distance')} className="input-field mt-1" /></label>
                    <label className="text-sm font-medium">Actual fare paid (₱)<input required type="number" min="0" step="0.01" value={form.fare} onChange={updateField('fare')} className="input-field mt-1" placeholder="Enter the fare you actually paid" /><span className="mt-1 block text-xs font-normal text-gray-600 dark:text-gray-400">Editable at all times. Automatic estimates are optional; manual entry is supported.</span></label>
                    <label className="text-sm font-medium">Comparison fare (optional)<input type="number" min={form.fare || 0} step="0.01" value={form.baselineFare} onChange={updateField('baselineFare')} className="input-field mt-1" placeholder="Leave blank if unknown" /></label>
                    <label className="text-sm font-medium">Date<input required type="date" value={form.tripDate} onChange={updateField('tripDate')} className="input-field mt-1" /></label>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button disabled={submitting} type="submit" className="btn-primary disabled:opacity-60">{submitting ? 'Saving…' : editingId ? 'Update record' : 'Add trip'}</button>
                    <button disabled={estimating} type="button" onClick={estimateSegmentFare} className="rounded-xl border px-4 py-2 disabled:opacity-60">{estimating ? 'Estimating…' : 'Estimate segment fare'}</button>
                    {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm(defaultPassengerType)); setRecentTripId(''); setOriginSavedPlaceId(''); setDestinationSavedPlaceId('') }} className="rounded-xl border px-4 py-2">Cancel edit</button>}
                </div>
            </form>

            {savedPlacesError && <p role="status" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">{savedPlacesError}</p>}

            <section className="card" aria-labelledby="fare-history-heading">
                <h2 id="fare-history-heading" className="text-xl font-bold mb-4">Fare history</h2>
                {records.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center dark:border-gray-700">
                        <Wallet size={28} className="mx-auto mb-2 text-gray-400" aria-hidden="true" />
                        <p className="font-semibold">No trips recorded yet</p>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Add your first trip above. You can type locations and the actual fare manually or prefill details from saved places.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {records.map(record => (
                            <article key={record.id} className="flex flex-wrap justify-between gap-3 rounded-xl border border-gray-200 p-3 dark:border-gray-700">
                                <div>
                                    <p className="font-semibold">{record.originName} → {record.destinationName}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(record.tripDate).toLocaleDateString()} · {record.transportType || 'Transport not specified'} · {record.source}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <p className="font-bold">₱{Number(record.fare).toFixed(2)}</p>
                                    {record.source === 'expense' && <button type="button" onClick={() => startEdit(record)} aria-label="Edit fare record" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><Pencil size={17} /></button>}
                                    <button type="button" onClick={() => removeRecord(record.id)} aria-label="Delete trip record" className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 size={17} /></button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    )
}

export default FareCalculator
