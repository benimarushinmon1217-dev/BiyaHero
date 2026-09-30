/**
 * Route Results Page - Multi-Modal Version
 * Displays multiple route options with transfers and segments
 */

import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Navigation2, Filter, TrendingDown, Zap, Users, AlertCircle } from 'lucide-react';
import RouteMap from '../components/RouteMap';
import MultiRouteCard from '../components/MultiRouteCard';
import RouteSegmentDetail from '../components/RouteSegmentDetail';
import { getRoutePlan } from '../services/multiModalRouteService';
import { createTrip } from '../services/accountService';
import { useAuth } from '../context/AuthContext';
import { getAllFareTypes } from '../utils/distanceBasedFare';
import { reverseGeocode } from '../services/geocodingService';
import { reconcileKnownPlaceLocation } from '../../shared/knownPlaceLocations';

const SelectedPlaceDetails = ({ label, place, fallbackName, nearbyPlace, nearbyStatus }) => {
    const name = place.name || fallbackName
    const address = place.formattedAddress || place.displayName
    const locality = [...new Set([place.barangay, place.municipality, place.province].filter(Boolean))].join(', ')
    const latitude = Number(place.lat ?? place.latitude)
    const longitude = Number(place.lng ?? place.longitude)
    const hasCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude)
    const mapFeatureUrl = place.osmUrl ||
        (place.osmType && place.osmId
            ? `https://www.openstreetmap.org/${place.osmType}/${place.osmId}`
            : null)

    return (
        <div className="mt-3">
            <p><strong>{label}:</strong> {name}</p>
            {address && address !== name && (
                <p className="text-sm text-gray-600 dark:text-gray-300">{address}</p>
            )}
            {locality && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Area: {locality}</p>}
            {hasCoordinates && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    {latitude.toFixed(6)}, {longitude.toFixed(6)}
                </p>
            )}
            {(place.provider || place.accuracy != null || place.locationPrecision) && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    Source: {place.provider || 'Selected place'}
                    {Number.isFinite(Number(place.accuracy)) ? ` · ±${Math.round(Number(place.accuracy))} m` : ''}
                    {place.locationPrecision ? ` · ${place.locationPrecision}` : ''}
                </p>
            )}
            {place.osmType && place.osmId && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    Map feature:{' '}
                    {mapFeatureUrl ? (
                        <a href={mapFeatureUrl} target="_blank" rel="noreferrer" className="underline hover:text-primary-600">
                            OpenStreetMap {place.osmType} {place.osmId}
                        </a>
                    ) : `OpenStreetMap ${place.osmType} ${place.osmId}`}
                    {place.geocodingProvider ? ` · Position from ${place.geocodingProvider}` : ''}
                </p>
            )}
            {label === 'Origin' && nearbyStatus && (
                <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                    {nearbyStatus === 'loading' && 'Finding nearby mapped location details…'}
                    {nearbyStatus === 'unavailable' && 'No more specific nearby mapped location was found.'}
                    {nearbyStatus === 'available' && nearbyPlace && (
                        <>
                            <span className="font-medium">Nearby mapped detail:</span>{' '}
                            {nearbyPlace.displayName || nearbyPlace.name}
                            {nearbyPlace.osmUrl && (
                                <>
                                    {' · '}
                                    <a href={nearbyPlace.osmUrl} target="_blank" rel="noreferrer" className="underline hover:text-primary-600">
                                        OpenStreetMap
                                    </a>
                                </>
                            )}
                        </>
                    )}
                </p>
            )}
        </div>
    )
}

const RouteResultsMultiModal = () => {
    const { user, setActiveLocation, savePreferences } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [routes, setRoutes] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [fareType, setFareType] = useState(user.passengerType || 'regular');
    const [sortBy, setSortBy] = useState(user.routePreference || 'recommended');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [noRouteMessage, setNoRouteMessage] = useState('');
    const [fallbackRoadRoute, setFallbackRoadRoute] = useState(null);
    const [motorcycleTaxiMessage, setMotorcycleTaxiMessage] = useState('');
    const [savingTrip, setSavingTrip] = useState(false);
    const [tripSaved, setTripSaved] = useState(false);
    const [tripError, setTripError] = useState('');
    const [showTripForm, setShowTripForm] = useState(false);
    const [actualFare, setActualFare] = useState('');
    const [nearbyOriginPlace, setNearbyOriginPlace] = useState(null);
    const [nearbyOriginStatus, setNearbyOriginStatus] = useState('');
    const [savingPreferences, setSavingPreferences] = useState(false);
    const [preferenceError, setPreferenceError] = useState('');

    const {
        origin,
        destination,
        originPlace: rawOriginPlace,
        destinationPlace: rawDestinationPlace
    } = location.state || {};
    const {
        place: originPlace,
        corrected: originPlaceCorrected
    } = useMemo(() => reconcileKnownPlaceLocation(rawOriginPlace), [rawOriginPlace]);
    const {
        place: destinationPlace,
        corrected: destinationPlaceCorrected
    } = useMemo(() => reconcileKnownPlaceLocation(rawDestinationPlace), [rawDestinationPlace]);
    const selectedPlaceCorrected = originPlaceCorrected || destinationPlaceCorrected;
    const routePreview = location.state?.routePreview;

    const changePreference = async (preference, value) => {
        setSavingPreferences(true);
        setPreferenceError('');
        try {
            await savePreferences({ [preference]: value });
            if (preference === 'passengerType') setFareType(value);
            if (preference === 'routePreference') setSortBy(value);
        } catch (preferenceSaveError) {
            console.error('Unable to save route preference:', preferenceSaveError);
            setPreferenceError(preferenceSaveError.friendlyMessage || 'Unable to save this preference.');
        } finally {
            setSavingPreferences(false);
        }
    };

    useEffect(() => {
        if (originPlace) setActiveLocation(originPlace)
    }, [originPlace, setActiveLocation])

    useEffect(() => {
        if (!originPlace || originPlace.street || originPlace.barangay) {
            setNearbyOriginPlace(null)
            setNearbyOriginStatus('')
            return undefined
        }

        const latitude = Number(originPlace.lat ?? originPlace.latitude)
        const longitude = Number(originPlace.lng ?? originPlace.longitude)
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
            setNearbyOriginPlace(null)
            setNearbyOriginStatus('unavailable')
            return undefined
        }

        let cancelled = false
        setNearbyOriginPlace(null)
        setNearbyOriginStatus('loading')

        reverseGeocode(latitude, longitude)
            .then(place => {
                if (cancelled) return
                const hasMoreDetail = place && (
                    place.street ||
                    place.barangay ||
                    (place.name && place.name.toLowerCase() !== String(originPlace.name || '').toLowerCase()) ||
                    (place.displayName && place.displayName !== (originPlace.formattedAddress || originPlace.displayName))
                )
                setNearbyOriginPlace(hasMoreDetail ? place : null)
                setNearbyOriginStatus(hasMoreDetail ? 'available' : 'unavailable')
            })
            .catch(error => {
                if (cancelled) return
                console.error('Nearby origin detail lookup failed:', error)
                setNearbyOriginPlace(null)
                setNearbyOriginStatus('unavailable')
            })

        return () => { cancelled = true }
    }, [originPlace])

    useEffect(() => {
        if (!origin || !destination || !originPlace || !destinationPlace) {
            navigate('/');
            return;
        }

        if (!selectedPlaceCorrected && routePreview?.routes?.length &&
            routePreview.passengerType === fareType &&
            routePreview.preference === sortBy) {
            setRoutes(routePreview.routes)
            setSelectedRoute(routePreview.routes[0])
            setLoading(false)
            setError(null)
        } else {
            loadRoutes();
        }
    }, [origin, destination, originPlace, destinationPlace, fareType, sortBy, routePreview, selectedPlaceCorrected]);

    useEffect(() => {
        setTripSaved(false)
        setTripError('')
        setShowTripForm(false)
        setActualFare('')
    }, [selectedRoute?.routeId, fareType, originPlace, destinationPlace])

    const loadRoutes = async () => {
        setLoading(true);
        setError(null);
        setNoRouteMessage('');
        setFallbackRoadRoute(null);
        setMotorcycleTaxiMessage('');

        try {
            const result = await getRoutePlan(
                originPlace,
                destinationPlace,
                fareType,
                sortBy
            );

            if (!result.success) {
                setNoRouteMessage(`BiyaHero routing API is unavailable: ${result.error}`);
                setRoutes([]);
                setSelectedRoute(null);
                return;
            }

            const plan = result.data;
            setMotorcycleTaxiMessage(plan.motorcycleTaxi?.message || 'Motorcycle taxi options are not configured in BiyaHero yet.');
            const road = plan.road;
            if (road.status === 'available') {
                setFallbackRoadRoute({
                    success: true,
                    distance: road.distanceKm,
                    duration: road.durationMinutes,
                    geometry: road.geometry,
                    profile: road.profile
                });
            }
            if (plan.publicTransit.status === 'available' && plan.publicTransit.routes.length > 0) {
                setRoutes(plan.publicTransit.routes);
                setSelectedRoute(plan.publicTransit.routes[0]);
            } else {
                setNoRouteMessage(plan.publicTransit.reason || 'No verified BiyaHero public-transit route is currently available for this trip.');
                setRoutes([]);
                setSelectedRoute(null);
            }
        } catch (err) {
            console.error('Route loading error:', err);
            setRoutes([]);
            setSelectedRoute(null);
            setNoRouteMessage('BiyaHero could not load a route plan. Please retry; no transit route or fare has been assumed.');
        } finally {
            setLoading(false);
        }
    };

    const recordSelectedTrip = async (event) => {
        event.preventDefault()
        if (!selectedRoute || !originPlace || !destinationPlace || tripSaved) return
        setSavingTrip(true)
        setTripError('')
        try {
            await createTrip({
                originName: originPlace.name,
                originLat: Number(originPlace.lat),
                originLng: Number(originPlace.lng),
                originMunicipality: originPlace.municipality,
                destinationName: destinationPlace.name,
                destinationLat: Number(destinationPlace.lat),
                destinationLng: Number(destinationPlace.lng),
                destinationMunicipality: destinationPlace.municipality,
                distance: selectedRoute.totalDistance,
                fare: Number(actualFare),
                passengerType: fareType,
                transportType: [...new Set((selectedRoute.segments || []).map(segment => segment.transportType))].join(', '),
                duration: selectedRoute.totalDuration,
                tripDate: new Date().toISOString(),
                routeId: selectedRoute.routeId,
                segments: selectedRoute.segments || [],
                transfers: selectedRoute.totalTransfers || 0,
                source: 'route'
            })
            setTripSaved(true)
            setShowTripForm(false)
        } catch (requestError) {
            setTripError(requestError.friendlyMessage || requestError.response?.data?.error?.message || 'Unable to record this route.')
        } finally {
            setSavingTrip(false)
        }
    }

    const fareTypes = [
        { id: 'regular', label: 'Regular', icon: '👤' },
        { id: 'student', label: 'Student', icon: '🎓' },
        { id: 'senior', label: 'Senior', icon: '👴' },
        { id: 'pwd', label: 'PWD', icon: '♿' },
    ];

    const sortOptions = [
        { id: 'recommended', label: 'Recommended', icon: <TrendingDown size={16} /> },
        { id: 'cheapest', label: 'Cheapest', icon: <TrendingDown size={16} /> },
        { id: 'fastest', label: 'Fastest', icon: <Zap size={16} /> },
        { id: 'least_transfers', label: 'Least Transfers', icon: <Users size={16} /> },
    ];

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full mb-4"
                />
                <p className="text-gray-600 dark:text-gray-400">Finding best routes for you...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                    <div className="flex items-start space-x-3">
                        <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0" size={24} />
                        <div>
                            <h3 className="text-lg font-bold text-red-900 dark:text-red-300 mb-2">
                                Error Loading Routes
                            </h3>
                            <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
                            <button
                                onClick={() => navigate('/')}
                                className="btn-primary"
                            >
                                Back to Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (noRouteMessage) {
        const fareEstimate = fallbackRoadRoute ? getAllFareTypes(fallbackRoadRoute.distance) : null
        const roadReference = fallbackRoadRoute ? {
            routeId: 'road-reference',
            segments: [{
                transportType: 'road_reference',
                routeName: 'Road-route reference (not public transit)',
                geometryProvider: fallbackRoadRoute.profile || 'road-routing provider',
                geometry: fallbackRoadRoute.geometry
            }]
        } : { segments: [] }
        return (
            <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Route reference</h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                            {origin} <ArrowRight className="mx-1 inline" size={15} /> {destination}
                        </p>
                    </div>
                    <button type="button" onClick={() => navigate('/')} className="btn-primary">Back to Search</button>
                </div>
                <div role="status" className="mb-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-950 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-100">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="mt-0.5 shrink-0" size={21} />
                        <div>
                            <h2 className="font-bold">No verified public-transit itinerary</h2>
                            <p className="mt-1 text-sm">{noRouteMessage}</p>
                            <p className="mt-1 text-sm">BiyaHero will not guess a jeepney or bus path. The blue line below, if available, is a road-driving reference only.</p>
                        </div>
                    </div>
                </div>
                {selectedPlaceCorrected && (
                    <div role="status" className="mb-5 rounded-xl border border-sky-300 bg-sky-50 p-4 text-sm text-sky-950 dark:border-sky-700 dark:bg-sky-900/20 dark:text-sky-100">
                        The stored SM City Lipa destination was misplaced. This map and route request now use the mapped mall location on Ayala Highway.
                    </div>
                )}
                <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,1fr)]">
                    <section className="card p-4">
                        <h2 className="mb-3 font-bold text-gray-900 dark:text-white">Selected locations on the map</h2>
                        <RouteMap
                            route={roadReference}
                            origin={origin}
                            destination={destination}
                            userCoords={location.state?.userCoords}
                            originPlace={originPlace}
                            destinationPlace={destinationPlace}
                        />
                        {fallbackRoadRoute && (
                            <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                                Road reference ({fallbackRoadRoute.profile || 'road profile'}): {fallbackRoadRoute.distance.toFixed(1)} km · about {fallbackRoadRoute.duration} min by car
                            </p>
                        )}
                    </section>
                    <aside className="space-y-4">
                        <section className="card p-5">
                            <h2 className="font-bold text-gray-900 dark:text-white">Approximate fare reference</h2>
                            {fareEstimate ? (
                                <>
                                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">Calculated from road distance, not a verified transit fare.</p>
                                    <dl className="mt-4 space-y-3">
                                        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                                            <dt>Regular</dt><dd className="font-bold">₱{fareEstimate.regular}</dd>
                                        </div>
                                        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                                            <dt>Student</dt><dd className="font-bold">₱{fareEstimate.student}</dd>
                                        </div>
                                    </dl>
                                    <p className="mt-3 text-xs text-gray-600 dark:text-gray-400">
                                        Estimate uses ₱15 regular / ₱12 discounted minimum for the first 5 km, plus the app’s distance rule beyond that. Actual fares can differ by route and operator.
                                    </p>
                                </>
                            ) : (
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">A road route could not be calculated, so no distance-based fare estimate is available. The selected locations remain shown on the map.</p>
                            )}
                        </section>
                        <section className="card border border-gray-200 p-5 dark:border-gray-700">
                            <h2 className="font-bold text-gray-900 dark:text-white">BiyaHero motorcycle rides</h2>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                Not available yet. {motorcycleTaxiMessage}
                            </p>
                        </section>
                        <section className="card p-5 text-sm">
                            <h2 className="font-bold text-gray-900 dark:text-white">Your selected places</h2>
                            <SelectedPlaceDetails
                                label="Origin"
                                place={originPlace}
                                fallbackName={origin}
                                nearbyPlace={nearbyOriginPlace}
                                nearbyStatus={nearbyOriginStatus}
                            />
                            <SelectedPlaceDetails label="Destination" place={destinationPlace} fallbackName={destination} />
                            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                                OpenStreetMap is a community-maintained map. Search results expose the matched map object and its mapped point; unmapped or outdated features may not appear.
                            </p>
                        </section>
                    </aside>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <h1 className="text-3xl font-bold mb-2">🚌 Route Options</h1>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <MapPin size={18} />
                    <span className="font-medium">{origin}</span>
                    <ArrowRight size={18} />
                    <Navigation2 size={18} />
                    <span className="font-medium">{destination}</span>
                </div>
                {routes.length > 0 && (
                    <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-500">
                            Found {routes.length} route option{routes.length !== 1 ? 's' : ''} for you
                        </p>
                        {selectedRoute?.originAccess && selectedRoute?.destinationAccess && (
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                Verified boarding: {selectedRoute.originAccess.stopName} ({selectedRoute.originAccess.distanceKm} km from your selected origin)
                                {' · '}Alight: {selectedRoute.destinationAccess.stopName} ({selectedRoute.destinationAccess.distanceKm} km from destination)
                            </p>
                        )}
                    </div>
                )}
            </motion.div>

            {selectedPlaceCorrected && (
                <div role="status" className="mb-5 rounded-xl border border-sky-300 bg-sky-50 p-4 text-sm text-sky-950 dark:border-sky-700 dark:bg-sky-900/20 dark:text-sky-100">
                    The stored SM City Lipa destination was misplaced. This map and route request now use the mapped mall location on Ayala Highway.
                </div>
            )}

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Fare Type Selector */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <label className="block text-sm font-medium mb-2">Passenger Type</label>
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                        {fareTypes.map((type) => (
                            <button
                                key={type.id}
                                type="button"
                                disabled={savingPreferences}
                                onClick={() => changePreference('passengerType', type.id)}
                                aria-pressed={fareType === type.id}
                                className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all flex items-center space-x-2 ${fareType === type.id
                                    ? 'bg-gradient-to-r from-primary-600 to-cyan-500 text-white shadow-lg'
                                    : 'glass hover:shadow-md'
                                    } disabled:cursor-not-allowed disabled:opacity-60`}
                            >
                                <span>{type.icon}</span>
                                <span>{type.label}</span>
                                {fareType === type.id && type.id !== 'regular' && (
                                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">20% off</span>
                                )}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Sort Options */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <label className="block text-sm font-medium mb-2">Sort By</label>
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                        {sortOptions.map((option) => (
                            <button
                                key={option.id}
                                type="button"
                                disabled={savingPreferences}
                                onClick={() => changePreference('routePreference', option.id)}
                                aria-pressed={sortBy === option.id}
                                className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all flex items-center space-x-2 ${sortBy === option.id
                                    ? 'bg-gradient-to-r from-primary-600 to-cyan-500 text-white shadow-lg'
                                    : 'glass hover:shadow-md'
                                    } disabled:cursor-not-allowed disabled:opacity-60`}
                            >
                                {option.icon}
                                <span>{option.label}</span>
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>
            {preferenceError && <p role="alert" className="mb-5 text-sm text-red-600 dark:text-red-400">{preferenceError}</p>}

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Route Options List */}
                <div className="lg:col-span-1 space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                    {routes.length === 0 ? (
                        <div className="card text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400">No routes available</p>
                        </div>
                    ) : (
                        routes.map((route, index) => (
                            <MultiRouteCard
                                key={route.routeId || index}
                                route={route}
                                isSelected={selectedRoute?.routeId === route.routeId}
                                onClick={() => setSelectedRoute(route)}
                                fareType={fareType}
                            />
                        ))
                    )}
                </div>

                {/* Map and Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Map */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card p-0 overflow-hidden"
                    >
                        <div className="h-[400px] lg:h-[500px]">
                            <RouteMap
                                route={selectedRoute}
                                origin={origin}
                                destination={destination}
                                userCoords={originPlace?.accuracy ? originPlace : undefined}
                                originPlace={originPlace}
                                destinationPlace={destinationPlace}
                            />
                        </div>
                    </motion.div>

                    {/* Route Summary */}
                    {selectedRoute && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card"
                        >
                            <h2 className="text-2xl font-bold mb-4">📋 Route Summary</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div className="text-center p-4 glass rounded-xl">
                                    <p className="text-sm text-gray-500 mb-1">Total Fare</p>
                                    <p className="text-2xl font-bold text-primary-600 dark:text-cyan-400">
                                        ₱{selectedRoute.totalFare}
                                    </p>
                                </div>
                                <div className="text-center p-4 glass rounded-xl">
                                    <p className="text-sm text-gray-500 mb-1">Duration</p>
                                    <p className="text-2xl font-bold">
                                        {selectedRoute.totalDuration} min
                                    </p>
                                </div>
                                <div className="text-center p-4 glass rounded-xl">
                                    <p className="text-sm text-gray-500 mb-1">Distance</p>
                                    <p className="text-2xl font-bold">
                                        {selectedRoute.totalDistance?.toFixed(1)} km
                                    </p>
                                </div>
                                <div className="text-center p-4 glass rounded-xl">
                                    <p className="text-sm text-gray-500 mb-1">Transfers</p>
                                    <p className="text-2xl font-bold">
                                        {selectedRoute.totalTransfers}
                                    </p>
                                </div>
                            </div>

                            {/* Route Type Info */}
                            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                                <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-2 flex items-center space-x-2">
                                    <span>🎯</span>
                                    <span>{selectedRoute.routeName}</span>
                                </h3>
                                <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                                    {selectedRoute.recommendationReason || 'This route option provides a good balance of cost and convenience.'}
                                </p>

                                {/* Route Tags */}
                                {selectedRoute.tags && selectedRoute.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
                                        {selectedRoute.tags.map((tag, idx) => (
                                            <div
                                                key={idx}
                                                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-gray-800 shadow-sm flex items-center space-x-1.5"
                                                title={tag.description}
                                            >
                                                <span className="text-base">{tag.icon}</span>
                                                <span>{tag.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Commuter Notes */}
                                {selectedRoute.commuterNotes && (
                                    <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
                                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
                                            💬 Commuter Notes:
                                        </p>
                                        <p className="text-sm text-blue-700 dark:text-blue-300 italic">
                                            "{selectedRoute.commuterNotes}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Detailed Segments */}
                    {selectedRoute && selectedRoute.segments && (
                        <RouteSegmentDetail
                            segments={selectedRoute.segments}
                            fareType={fareType}
                        />
                    )}
                    {selectedRoute && (
                        <div className="card">
                            <h2 className="text-lg font-bold mb-2">Used this route?</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Record the selected route in your account only after you have used it.</p>
                            <button type="button" disabled={savingTrip || tripSaved} onClick={() => setShowTripForm(true)} className="btn-primary disabled:opacity-60">
                                {tripSaved ? 'Trip recorded' : savingTrip ? 'Recording…' : 'I used this route'}
                            </button>
                            {!tripSaved && showTripForm && (
                                <form onSubmit={recordSelectedTrip} className="mt-4 flex flex-wrap items-end gap-3">
                                    <label className="text-sm font-medium">
                                        Fare actually paid (₱)
                                        <input required type="number" min="0" step="0.01" value={actualFare} onChange={event => setActualFare(event.target.value)} className="input-field mt-1" />
                                    </label>
                                    <button type="submit" disabled={savingTrip} className="btn-primary disabled:opacity-60">{savingTrip ? 'Recording…' : 'Record completed trip'}</button>
                                    <button type="button" onClick={() => setShowTripForm(false)} className="rounded-xl border px-4 py-2">Cancel</button>
                                </form>
                            )}
                            {tripError && <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">{tripError}</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RouteResultsMultiModal;
