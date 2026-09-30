import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Award, Clock, Heart, MapPin, Settings, Trash2, Wallet } from 'lucide-react'
import { getProfileData, deleteSavedPlace } from '../services/accountService'
import { useAuth } from '../context/AuthContext'
import BiyaHeroSelect from '../components/BiyaHeroSelect'

const Profile = () => {
    const navigate = useNavigate()
    const { savePreferences } = useAuth()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [savingPreferences, setSavingPreferences] = useState(false)
    const [preferenceMessage, setPreferenceMessage] = useState('')

    const loadProfile = async () => {
        setLoading(true)
        setError('')
        try {
            setProfile(await getProfileData())
        } catch (requestError) {
            setError(requestError.friendlyMessage || 'Your profile is temporarily unavailable.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadProfile() }, [])

    const savePreference = async (preference, value) => {
        setSavingPreferences(true)
        setPreferenceMessage('')
        try {
            const preferences = await savePreferences({ [preference]: value })
            setProfile(previous => ({
                ...previous,
                preferences,
                user: { ...previous.user, ...preferences }
            }))
            setPreferenceMessage('Preference saved.')
        } catch (requestError) {
            setPreferenceMessage(requestError.friendlyMessage || 'Unable to save this preference.')
        } finally {
            setSavingPreferences(false)
        }
    }

    const removeSavedPlace = async (id) => {
        try {
            await deleteSavedPlace(id)
            setProfile(previous => ({
                ...previous,
                savedPlaces: previous.savedPlaces.filter(place => place.id !== id)
            }))
        } catch (requestError) {
            setError(requestError.friendlyMessage || 'Unable to remove the saved place.')
        }
    }

    const repeatTrip = trip => {
        if (trip.originLat == null || trip.originLng == null || trip.destinationLat == null || trip.destinationLng == null) return
        navigate('/route', {
            state: {
                origin: trip.originName,
                destination: trip.destinationName,
                originPlace: {
                    name: trip.originName,
                    lat: Number(trip.originLat),
                    lng: Number(trip.originLng),
                    municipality: trip.originMunicipality,
                    province: 'Batangas'
                },
                destinationPlace: {
                    name: trip.destinationName,
                    lat: Number(trip.destinationLat),
                    lng: Number(trip.destinationLng),
                    municipality: trip.destinationMunicipality,
                    province: 'Batangas'
                }
            }
        })
    }

    if (loading) return <main className="container mx-auto px-4 py-10 text-center">Loading your profile…</main>
    if (error && !profile) {
        return <main className="container mx-auto px-4 py-10"><div className="card" role="alert">{error}<button onClick={loadProfile} className="btn-primary ml-4">Retry</button></div></main>
    }

    const stats = profile.statistics
    return (
        <main className="container mx-auto max-w-5xl px-4 py-8 pb-24 md:pb-8 space-y-6">
            {error && <div role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">{error}</div>}
            <section className="card flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-600 to-cyan-500 text-white flex items-center justify-center text-2xl font-bold">
                    {profile.user.firstName?.[0]}{profile.user.lastName?.[0]}
                </div>
                <h1 className="mt-3 text-2xl font-bold">{profile.user.firstName} {profile.user.lastName}</h1>
                <p className="text-gray-600 dark:text-gray-400">{profile.user.email}</p>
                {profile.user.phoneNumber && <p className="text-sm text-gray-500">{profile.user.phoneNumber}</p>}
            </section>

            <section className="grid grid-cols-2 lg:grid-cols-4 gap-3" aria-label="Commuting statistics">
                {[
                    ['Total trips', stats.totalTrips, Clock],
                    ['Actual spending', `₱${stats.totalSpent.toFixed(2)}`, Wallet],
                    ['Recorded savings', `₱${stats.totalSavings.toFixed(2)}`, Award],
                    ['Average fare', `₱${stats.averageFare.toFixed(2)}`, MapPin]
                ].map(([label, value, Icon]) => (
                    <div key={label} className="card !p-4">
                        <Icon size={20} className="text-primary-600 dark:text-cyan-400 mb-2" />
                        <p className="text-xl font-bold">{value}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{label}</p>
                    </div>
                ))}
            </section>
            <p className="text-xs text-gray-500">Savings are shown only for records with a user-provided comparison fare.</p>

            <section className="card">
                <h2 className="text-xl font-bold flex items-center gap-2 mb-4"><Settings size={21} /> Commuting preferences</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                    <label className="text-sm font-medium">
                        Passenger type
                        <BiyaHeroSelect
                            id="profile-passenger-type"
                            ariaLabel="Passenger type"
                            disabled={savingPreferences}
                            value={profile.preferences.passengerType}
                            onChange={value => savePreference('passengerType', value)}
                            options={[
                                { value: 'regular', label: 'Regular' },
                                { value: 'student', label: 'Student' },
                                { value: 'senior', label: 'Senior' },
                                { value: 'pwd', label: 'PWD' }
                            ]}
                        />
                    </label>
                    <label className="text-sm font-medium">
                        Route preference
                        <BiyaHeroSelect
                            id="profile-route-preference"
                            ariaLabel="Route preference"
                            disabled={savingPreferences}
                            value={profile.preferences.routePreference}
                            onChange={value => savePreference('routePreference', value)}
                            options={[
                                { value: 'recommended', label: 'Recommended' },
                                { value: 'cheapest', label: 'Cheapest' },
                                { value: 'fastest', label: 'Fastest' },
                                { value: 'least_transfers', label: 'Least transfers' }
                            ]}
                        />
                    </label>
                </div>
                {preferenceMessage && <p className="mt-2 text-sm text-gray-600 dark:text-gray-400" role="status">{preferenceMessage}</p>}
            </section>

            <section className="card">
                <h2 className="text-xl font-bold flex items-center gap-2 mb-4"><Heart size={21} /> Saved places</h2>
                {profile.savedPlaces.length === 0 ? (
                    <p className="text-sm text-gray-600 dark:text-gray-400">No saved places yet. Select a verified location in route search and save it as Home, Work, School, or Favorite.</p>
                ) : (
                    <div className="space-y-2">
                        {profile.savedPlaces.map(place => (
                            <div key={place.id} className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
                                <div className="min-w-0">
                                    <p className="font-semibold truncate">{place.name} <span className="text-xs font-normal capitalize text-gray-500">· {place.label}</span></p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{place.formattedAddress || `${place.municipality}, ${place.province}`}</p>
                                </div>
                                <button type="button" aria-label={`Delete ${place.name}`} onClick={() => removeSavedPlace(place.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg dark:hover:bg-red-900/30">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="card">
                <h2 className="text-xl font-bold flex items-center gap-2 mb-4"><Clock size={21} /> Recent trip and fare history</h2>
                {profile.trips.length === 0 ? (
                    <p className="text-sm text-gray-600 dark:text-gray-400">Your trip history will appear here after you record a completed route or fare.</p>
                ) : (
                    <div className="space-y-3">
                        {profile.trips.map(trip => (
                            <div key={trip.id} className="rounded-xl border border-gray-200 p-3 dark:border-gray-700">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div>
                                        <p className="font-semibold">{trip.originName} → {trip.destinationName}</p>
                                        <p className="text-xs text-gray-500">{new Date(trip.tripDate).toLocaleString()} · {trip.source === 'route' ? 'Used route' : 'Fare record'}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold">₱{Number(trip.fare).toFixed(2)}</span>
                                        {trip.originLat != null && <button type="button" onClick={() => repeatTrip(trip)} className="text-sm font-semibold text-primary-600 dark:text-cyan-400">Repeat</button>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <button type="button" onClick={() => navigate('/fare-calculator')} className="btn-primary mt-4">Open fare calculator</button>
            </section>

            <section className="card">
                <h2 className="text-xl font-bold flex items-center gap-2 mb-4"><Award size={21} /> Achievements</h2>
                {profile.achievements.length === 0 ? (
                    <p className="text-sm text-gray-600 dark:text-gray-400">Record your first trip to unlock an achievement.</p>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {profile.achievements.map(achievement => (
                            <div key={achievement.id} className="rounded-xl bg-gray-50 p-4 text-center dark:bg-gray-800">
                                <span className="text-3xl">{achievement.icon}</span>
                                <p className="font-semibold mt-2">{achievement.title}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">{achievement.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    )
}

export default Profile
