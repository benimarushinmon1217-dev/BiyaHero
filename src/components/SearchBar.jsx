import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Navigation, Search, Locate, X, CheckCircle, MapPinned, Info } from 'lucide-react'
import { getAutocompleteSuggestions } from '../services/searchService'
import { getPlaceSuggestions, getPlaceIcon, formatPlaceDisplay } from '../services/geocodingService'

// Quick location presets for easy access
const QUICK_LOCATIONS = [
    { name: 'SM City Lipa', lat: 13.9380, lng: 121.1625, icon: '🏬' },
    { name: 'Lipa Cathedral', lat: 13.9411, lng: 121.1650, icon: '⛪' },
    { name: 'BSU Lipa', lat: 13.9450, lng: 121.1680, icon: '🎓' },
    { name: 'Batangas Grand Terminal', lat: 13.7565, lng: 121.0583, icon: '🚌' },
    { name: 'Tanauan City Hall', lat: 14.0858, lng: 121.1500, icon: '🏛️' },
    { name: 'Rosario Town Center', lat: 13.8458, lng: 121.2042, icon: '🏘️' }
]

const SearchBar = () => {
    const navigate = useNavigate()
    const [origin, setOrigin] = useState('')
    const [destination, setDestination] = useState('')
    const [loadingLocation, setLoadingLocation] = useState(false)
    const [locationError, setLocationError] = useState('')
    const [locationWarning, setLocationWarning] = useState('')
    const [userCoords, setUserCoords] = useState(null)
    const [showQuickLocations, setShowQuickLocations] = useState(false)
    const [locationConfidence, setLocationConfidence] = useState(null) // 'high', 'medium', 'low'
    const [showDebugPanel, setShowDebugPanel] = useState(false)
    const [debugInfo, setDebugInfo] = useState(null)

    // Selected place objects (validated coordinates)
    const [selectedOriginPlace, setSelectedOriginPlace] = useState(null)
    const [selectedDestinationPlace, setSelectedDestinationPlace] = useState(null)

    // Autocomplete states (local database)
    const [originSuggestions, setOriginSuggestions] = useState([])
    const [destinationSuggestions, setDestinationSuggestions] = useState([])
    const [showOriginSuggestions, setShowOriginSuggestions] = useState(false)
    const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false)

    // Geocoded place suggestions (Nominatim)
    const [originPlaceSuggestions, setOriginPlaceSuggestions] = useState([])
    const [destinationPlaceSuggestions, setDestinationPlaceSuggestions] = useState([])
    const [showOriginPlaces, setShowOriginPlaces] = useState(false)
    const [showDestinationPlaces, setShowDestinationPlaces] = useState(false)
    const [loadingOriginPlaces, setLoadingOriginPlaces] = useState(false)
    const [loadingDestinationPlaces, setLoadingDestinationPlaces] = useState(false)

    const [selectedOriginIndex, setSelectedOriginIndex] = useState(-1)
    const [selectedDestinationIndex, setSelectedDestinationIndex] = useState(-1)

    // Refs for click outside detection
    const originRef = useRef(null)
    const destinationRef = useRef(null)

    // Handle click outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (originRef.current && !originRef.current.contains(event.target)) {
                setShowOriginSuggestions(false)
                setShowOriginPlaces(false)
            }
            if (destinationRef.current && !destinationRef.current.contains(event.target)) {
                setShowDestinationSuggestions(false)
                setShowDestinationPlaces(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Origin autocomplete (local database)
    useEffect(() => {
        if (origin.trim().length >= 2 && !selectedOriginPlace) {
            const suggestions = getAutocompleteSuggestions(origin, 8)
            setOriginSuggestions(suggestions)
            setShowOriginSuggestions(suggestions.length > 0)
        } else {
            setOriginSuggestions([])
            setShowOriginSuggestions(false)
        }
        setSelectedOriginIndex(-1)
    }, [origin, selectedOriginPlace])

    // Destination autocomplete (local database)
    useEffect(() => {
        if (destination.trim().length >= 2 && !selectedDestinationPlace) {
            const suggestions = getAutocompleteSuggestions(destination, 8)
            setDestinationSuggestions(suggestions)
            setShowDestinationSuggestions(suggestions.length > 0)
        } else {
            setDestinationSuggestions([])
            setShowDestinationSuggestions(false)
        }
        setSelectedDestinationIndex(-1)
    }, [destination, selectedDestinationPlace])

    const handleSearch = (e) => {
        e.preventDefault()

        // Require place selection for accurate routing
        if (!selectedOriginPlace && !userCoords) {
            // Trigger geocoding for origin
            handleOriginGeocode()
            return
        }

        if (!selectedDestinationPlace) {
            // Trigger geocoding for destination
            handleDestinationGeocode()
            return
        }

        // Navigate with validated place objects
        navigate('/route', {
            state: {
                origin: selectedOriginPlace ? selectedOriginPlace.name : origin,
                destination: selectedDestinationPlace.name,
                originPlace: selectedOriginPlace,
                destinationPlace: selectedDestinationPlace,
                userCoords
            }
        })
    }

    // Geocode origin to get place suggestions
    const handleOriginGeocode = async () => {
        if (!origin.trim() || selectedOriginPlace) return

        setLoadingOriginPlaces(true)
        setShowOriginSuggestions(false)

        try {
            const places = await getPlaceSuggestions(origin, 5)
            setOriginPlaceSuggestions(places)
            setShowOriginPlaces(places.length > 0)
        } catch (error) {
            console.error('Origin geocoding error:', error)
        } finally {
            setLoadingOriginPlaces(false)
        }
    }

    // Geocode destination to get place suggestions
    const handleDestinationGeocode = async () => {
        if (!destination.trim() || selectedDestinationPlace) return

        setLoadingDestinationPlaces(true)
        setShowDestinationSuggestions(false)

        try {
            const places = await getPlaceSuggestions(destination, 5)
            setDestinationPlaceSuggestions(places)
            setShowDestinationPlaces(places.length > 0)
        } catch (error) {
            console.error('Destination geocoding error:', error)
        } finally {
            setLoadingDestinationPlaces(false)
        }
    }

    const handleOriginSelect = (location) => {
        setOrigin(location.name)
        setShowOriginSuggestions(false)
        setUserCoords(null) // Clear user coords when selecting from suggestions
        // Trigger geocoding to get exact coordinates
        setTimeout(() => handleOriginGeocode(), 100)
    }

    const handleDestinationSelect = (location) => {
        setDestination(location.name)
        setShowDestinationSuggestions(false)
        // Trigger geocoding to get exact coordinates
        setTimeout(() => handleDestinationGeocode(), 100)
    }

    const handleOriginPlaceSelect = (place) => {
        setSelectedOriginPlace(place)
        setOrigin(place.name)
        setShowOriginPlaces(false)
        setUserCoords(null)
    }

    const handleDestinationPlaceSelect = (place) => {
        setSelectedDestinationPlace(place)
        setDestination(place.name)
        setShowDestinationPlaces(false)
    }

    const clearOriginSelection = () => {
        setSelectedOriginPlace(null)
        setOrigin('')
        setUserCoords(null)
    }

    const clearDestinationSelection = () => {
        setSelectedDestinationPlace(null)
        setDestination('')
    }

    const handleQuickLocationSelect = (location) => {
        setSelectedOriginPlace({
            name: location.name,
            lat: location.lat,
            lng: location.lng,
            displayName: location.name,
            category: 'preset_location',
            confidence: 1.0,
            isKnownLocation: true
        })
        setOrigin(location.name)
        setUserCoords({ lat: location.lat, lng: location.lng })
        setLocationError('')
        setLocationWarning('')
        setShowQuickLocations(false)
        setLocationConfidence('high')
    }

    const handleOriginKeyDown = (e) => {
        if (!showOriginSuggestions || originSuggestions.length === 0) return

        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setSelectedOriginIndex(prev =>
                prev < originSuggestions.length - 1 ? prev + 1 : prev
            )
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setSelectedOriginIndex(prev => prev > 0 ? prev - 1 : -1)
        } else if (e.key === 'Enter' && selectedOriginIndex >= 0) {
            e.preventDefault()
            handleOriginSelect(originSuggestions[selectedOriginIndex])
        } else if (e.key === 'Escape') {
            setShowOriginSuggestions(false)
        }
    }

    const handleDestinationKeyDown = (e) => {
        if (!showDestinationSuggestions || destinationSuggestions.length === 0) return

        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setSelectedDestinationIndex(prev =>
                prev < destinationSuggestions.length - 1 ? prev + 1 : prev
            )
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setSelectedDestinationIndex(prev => prev > 0 ? prev - 1 : -1)
        } else if (e.key === 'Enter' && selectedDestinationIndex >= 0) {
            e.preventDefault()
            handleDestinationSelect(destinationSuggestions[selectedDestinationIndex])
        } else if (e.key === 'Escape') {
            setShowDestinationSuggestions(false)
        }
    }

    const handleUseCurrentLocation = () => {
        setLoadingLocation(true)
        setLocationError('')
        setLocationWarning('')
        setShowQuickLocations(false)

        // Check if running on localhost
        const isLocalhost = window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1'

        if (isLocalhost) {
            setLocationWarning(
                '💡 Running on localhost: Location detection may be less accurate on desktop. ' +
                'For best results, test on mobile device or enable Windows location services.'
            )
        }

        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser. Please select a location below.')
            setShowQuickLocations(true)
            setLoadingLocation(false)
            return
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude, accuracy } = position.coords
                const coords = { lat: latitude, lng: longitude }

                console.log('📍 GPS Coordinates:', { latitude, longitude, accuracy: `${accuracy.toFixed(0)}m` })

                // Determine initial confidence based on GPS accuracy
                let confidence = 'low'
                if (accuracy <= 50) confidence = 'high'
                else if (accuracy <= 200) confidence = 'medium'

                // Reverse geocode to get address FIRST
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`
                    )
                    const data = await response.json()

                    console.log('🗺️ Reverse Geocoding Response:', data)

                    // EXPANDED Batangas bounds with tolerance
                    const BATANGAS_BOUNDS = {
                        minLat: 13.50,   // Expanded south (includes all southern Batangas)
                        maxLat: 14.20,   // Expanded north (includes all northern areas)
                        minLng: 120.70,  // Expanded west
                        maxLng: 121.40   // Expanded east (includes all Lipa and eastern areas)
                    }

                    // Known Batangas municipalities (whitelist)
                    const BATANGAS_MUNICIPALITIES = [
                        'lipa', 'lipa city', 'batangas city', 'batangas', 'tanauan', 'tanauan city',
                        'rosario', 'ibaan', 'padre garcia', 'san jose', 'bauan', 'cuenca',
                        'malvar', 'sto tomas', 'santo tomas', 'mataasnakahoy', 'mataas na kahoy',
                        'balete', 'talisay', 'nasugbu', 'calaca', 'lemery', 'san juan',
                        'taal', 'laurel', 'agoncillo', 'alitagtag', 'balayan', 'calatagan',
                        'san luis', 'san nicolas', 'san pascual', 'santa teresita', 'tuy',
                        'lobo', 'mabini', 'san antonio', 'tingloy', 'taysan'
                    ]

                    // MULTI-LAYER VALIDATION
                    const address = data.address || {}

                    // Extract location info from all possible fields
                    const province = (address.state || address.province || '').toLowerCase()
                    const city = (address.city || '').toLowerCase()
                    const town = (address.town || '').toLowerCase()
                    const municipality = (address.municipality || '').toLowerCase()
                    const county = (address.county || '').toLowerCase()
                    const displayName = (data.display_name || '').toLowerCase()

                    console.log('📋 Parsed Location Data:', {
                        province,
                        city,
                        town,
                        municipality,
                        county,
                        displayName
                    })

                    // VALIDATION LAYER 1: Check province name (highest priority)
                    const provinceMatch = (
                        province.includes('batangas') ||
                        displayName.includes('batangas province') ||
                        displayName.includes('province of batangas')
                    )

                    // VALIDATION LAYER 2: Check municipality/city name
                    const municipalityMatch = BATANGAS_MUNICIPALITIES.some(muni =>
                        city.includes(muni) ||
                        town.includes(muni) ||
                        municipality.includes(muni) ||
                        county.includes(muni) ||
                        displayName.includes(muni)
                    )

                    // VALIDATION LAYER 3: Check coordinate bounds (with tolerance)
                    const coordinateMatch = (
                        latitude >= BATANGAS_BOUNDS.minLat &&
                        latitude <= BATANGAS_BOUNDS.maxLat &&
                        longitude >= BATANGAS_BOUNDS.minLng &&
                        longitude <= BATANGAS_BOUNDS.maxLng
                    )

                    console.log('✅ Validation Results:', {
                        provinceMatch,
                        municipalityMatch,
                        coordinateMatch
                    })

                    // Accept if ANY validation layer passes
                    const isInBatangas = provinceMatch || municipalityMatch || coordinateMatch

                    // Update confidence based on validation layers
                    if (provinceMatch && municipalityMatch && coordinateMatch) {
                        confidence = 'high'
                    } else if (provinceMatch || municipalityMatch) {
                        confidence = 'medium'
                    } else if (coordinateMatch) {
                        confidence = 'low'
                    }

                    // Collect debug info
                    const debugData = {
                        coordinates: { latitude, longitude },
                        accuracy: `${accuracy.toFixed(0)}m`,
                        confidence,
                        timestamp: new Date().toLocaleTimeString(),
                        parsedLocation: {
                            province,
                            city: city || town || municipality,
                            displayName
                        },
                        validation: { provinceMatch, municipalityMatch, coordinateMatch },
                        finalConfidence: confidence,
                        isInBatangas
                    }
                    setDebugInfo(debugData)

                    if (!isInBatangas) {
                        // Location is outside Batangas - show friendly message
                        console.warn('❌ Location validation failed')
                        setLocationError(
                            `📍 We detected your location outside Batangas Province. ` +
                            `You can still select a Batangas location below.`
                        )
                        setShowQuickLocations(true)
                        setOrigin('')
                        setSelectedOriginPlace(null)
                        setUserCoords(null)
                        setLoadingLocation(false)
                        return
                    }

                    // SUCCESS - Location validated!
                    console.log('✅ Location validated as Batangas')

                    setUserCoords(coords)
                    setLocationConfidence(confidence)

                    // Show warnings based on confidence
                    if (confidence === 'medium') {
                        setLocationWarning('📍 Approximate location detected. You can adjust if needed.')
                    } else if (confidence === 'low') {
                        setLocationWarning('📍 Location detected with low accuracy. Please verify or select from quick locations.')
                        setShowQuickLocations(true)
                    }

                    // Create a readable address
                    const locationName = address.city || address.town || address.village ||
                        address.municipality || address.county ||
                        `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`

                    // Create a place object for current location
                    setSelectedOriginPlace({
                        name: locationName,
                        lat: latitude,
                        lng: longitude,
                        displayName: `${locationName} (Your Location)`,
                        category: 'current_location',
                        confidence: confidence === 'high' ? 1.0 : confidence === 'medium' ? 0.7 : 0.4,
                        isKnownLocation: false
                    })

                    setOrigin(locationName)
                    setLoadingLocation(false)
                } catch (error) {
                    console.error('❌ Reverse geocoding error:', error)
                    // Fallback - show quick locations
                    setLocationError('📍 Unable to verify your location. Please select a location below.')
                    setShowQuickLocations(true)
                    setLoadingLocation(false)
                }
            },
            (error) => {
                let errorMessage = '📍 Unable to access your location. '

                // Check if running on localhost for better error messages
                const isLocalhost = window.location.hostname === 'localhost' ||
                    window.location.hostname === '127.0.0.1'

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'Location permission denied. '
                        if (isLocalhost) {
                            errorMessage += 'On Windows, enable location services in Settings → Privacy → Location. '
                        }
                        break
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'Location information unavailable. '
                        break
                    case error.TIMEOUT:
                        errorMessage += 'Location request timed out. '
                        if (isLocalhost) {
                            errorMessage += 'This can happen on desktop or with weak signal. '
                        }
                        break
                }

                errorMessage += 'Please select a location below.'

                setLocationError(errorMessage)
                setShowQuickLocations(true)
                setLoadingLocation(false)
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,  // Increased timeout
                maximumAge: 0
            }
        )
    }

    return (
        <motion.form
            onSubmit={handleSearch}
            className="card p-6"
            whileHover={{ scale: 1.01 }}
        >
            <div className="space-y-4">
                {/* Origin Input with Place Confirmation */}
                <div className="relative" ref={originRef}>
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-600 dark:text-cyan-400 z-10" size={20} />
                    <input
                        type="text"
                        placeholder="Saan ka galing? (Origin)"
                        value={origin}
                        onChange={(e) => {
                            setOrigin(e.target.value)
                            setSelectedOriginPlace(null)
                        }}
                        onKeyDown={handleOriginKeyDown}
                        onFocus={() => origin.trim().length >= 2 && setShowOriginSuggestions(true)}
                        className={`input-field pl-12 ${selectedOriginPlace ? 'pr-20' : 'pr-12'}`}
                        autoComplete="off"
                    />

                    {/* Place confirmed indicator */}
                    {selectedOriginPlace && (
                        <div className="absolute right-12 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 z-10">
                            {locationConfidence && (
                                <span className={`text-xs px-2 py-1 rounded-full mr-1 ${locationConfidence === 'high' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                    locationConfidence === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                        'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                                    }`}>
                                    {locationConfidence === 'high' ? '✅' :
                                        locationConfidence === 'medium' ? '⚠️' :
                                            '⚠️'}
                                </span>
                            )}
                            <CheckCircle size={18} className="text-green-600 dark:text-green-400" />
                            <button
                                type="button"
                                onClick={clearOriginSelection}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                title="Clear selection"
                            >
                                <X size={16} className="text-gray-500" />
                            </button>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={handleUseCurrentLocation}
                        disabled={loadingLocation}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors disabled:opacity-50 z-10"
                        title="Use my current location"
                    >
                        <Locate
                            size={20}
                            className={`${loadingLocation ? 'animate-pulse text-primary-600' : 'text-gray-500 hover:text-primary-600 dark:hover:text-cyan-400'}`}
                        />
                    </button>

                    {/* Local Database Autocomplete */}
                    <AnimatePresence>
                        {showOriginSuggestions && originSuggestions.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-80 overflow-y-auto z-50"
                            >
                                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
                                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">KNOWN LOCATIONS</span>
                                </div>
                                {originSuggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => handleOriginSelect(suggestion)}
                                        className={`w-full px-4 py-3 flex items-center space-x-3 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors text-left ${index === selectedOriginIndex ? 'bg-primary-50 dark:bg-primary-900/30' : ''
                                            }`}
                                    >
                                        <span className="text-2xl">{suggestion.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-gray-900 dark:text-white truncate">
                                                {suggestion.name}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {suggestion.categoryLabel}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Geocoded Place Suggestions */}
                    <AnimatePresence>
                        {showOriginPlaces && originPlaceSuggestions.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-primary-500 dark:border-primary-400 max-h-96 overflow-y-auto z-50"
                            >
                                <div className="px-4 py-3 bg-primary-50 dark:bg-primary-900/30 border-b border-primary-200 dark:border-primary-700">
                                    <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">
                                        📍 Select exact location
                                    </span>
                                    <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">
                                        Choose the correct destination to ensure accurate routing
                                    </p>
                                </div>
                                {originPlaceSuggestions.map((place, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => handleOriginPlaceSelect(place)}
                                        className="w-full px-4 py-3 flex items-start space-x-3 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors text-left border-b border-gray-100 dark:border-gray-700 last:border-0"
                                    >
                                        <span className="text-2xl mt-1">{getPlaceIcon(place.category)}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {place.name}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                                                {formatPlaceDisplay(place)}
                                            </div>
                                            <div className="flex items-center space-x-2 mt-1">
                                                {place.isKnownLocation && (
                                                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">
                                                        Known Location
                                                    </span>
                                                )}
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {(place.confidence * 100).toFixed(0)}% match
                                                </span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Loading indicator */}
                    {loadingOriginPlaces && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 z-50">
                            <div className="flex items-center space-x-3">
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-600 border-t-transparent"></div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Finding exact location...</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Location Error Message */}
                {locationError && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg flex items-start space-x-2"
                    >
                        <span>⚠️</span>
                        <span>{locationError}</span>
                    </motion.div>
                )}

                {/* Location Warning Message */}
                {locationWarning && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg flex items-start space-x-2"
                    >
                        <span>💡</span>
                        <span>{locationWarning}</span>
                    </motion.div>
                )}

                {/* Quick Location Buttons */}
                {showQuickLocations && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 px-4 py-3 rounded-lg border border-blue-200 dark:border-blue-800"
                    >
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
                            📍 Quick select a location:
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {QUICK_LOCATIONS.map((location, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleQuickLocationSelect(location)}
                                    className="px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-400 hover:shadow-md transition-all text-left"
                                >
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xl">{location.icon}</span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            {location.name}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Destination Input with Place Confirmation */}
                <div className="relative" ref={destinationRef}>
                    <Navigation className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-600 dark:text-cyan-400 z-10" size={20} />
                    <input
                        type="text"
                        placeholder="Saan ka pupunta? (Destination)"
                        value={destination}
                        onChange={(e) => {
                            setDestination(e.target.value)
                            setSelectedDestinationPlace(null)
                        }}
                        onKeyDown={handleDestinationKeyDown}
                        onFocus={() => destination.trim().length >= 2 && setShowDestinationSuggestions(true)}
                        className={`input-field pl-12 ${selectedDestinationPlace ? 'pr-10' : ''}`}
                        autoComplete="off"
                    />

                    {/* Place confirmed indicator */}
                    {selectedDestinationPlace && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 z-10">
                            <CheckCircle size={18} className="text-green-600 dark:text-green-400" />
                            <button
                                type="button"
                                onClick={clearDestinationSelection}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                title="Clear selection"
                            >
                                <X size={16} className="text-gray-500" />
                            </button>
                        </div>
                    )}

                    {/* Local Database Autocomplete */}
                    <AnimatePresence>
                        {showDestinationSuggestions && destinationSuggestions.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-80 overflow-y-auto z-50"
                            >
                                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
                                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">KNOWN LOCATIONS</span>
                                </div>
                                {destinationSuggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => handleDestinationSelect(suggestion)}
                                        className={`w-full px-4 py-3 flex items-center space-x-3 hover:bg-cyan-50 dark:hover:bg-cyan-900/30 transition-colors text-left ${index === selectedDestinationIndex ? 'bg-cyan-50 dark:bg-cyan-900/30' : ''
                                            }`}
                                    >
                                        <span className="text-2xl">{suggestion.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-gray-900 dark:text-white truncate">
                                                {suggestion.name}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {suggestion.categoryLabel}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Geocoded Place Suggestions */}
                    <AnimatePresence>
                        {showDestinationPlaces && destinationPlaceSuggestions.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-cyan-500 dark:border-cyan-400 max-h-96 overflow-y-auto z-50"
                            >
                                <div className="px-4 py-3 bg-cyan-50 dark:bg-cyan-900/30 border-b border-cyan-200 dark:border-cyan-700">
                                    <span className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">
                                        📍 Select exact destination
                                    </span>
                                    <p className="text-xs text-cyan-600 dark:text-cyan-400 mt-1">
                                        Choose the correct destination to ensure accurate routing
                                    </p>
                                </div>
                                {destinationPlaceSuggestions.map((place, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => handleDestinationPlaceSelect(place)}
                                        className="w-full px-4 py-3 flex items-start space-x-3 hover:bg-cyan-50 dark:hover:bg-cyan-900/30 transition-colors text-left border-b border-gray-100 dark:border-gray-700 last:border-0"
                                    >
                                        <span className="text-2xl mt-1">{getPlaceIcon(place.category)}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {place.name}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                                                {formatPlaceDisplay(place)}
                                            </div>
                                            <div className="flex items-center space-x-2 mt-1">
                                                {place.isKnownLocation && (
                                                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">
                                                        Known Location
                                                    </span>
                                                )}
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {(place.confidence * 100).toFixed(0)}% match
                                                </span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Loading indicator */}
                    {loadingDestinationPlaces && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 z-50">
                            <div className="flex items-center space-x-3">
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-cyan-600 border-t-transparent"></div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Finding exact location...</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Search Button */}
                <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!origin || !destination}
                    className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Search size={20} />
                    <span>Find Routes</span>
                </motion.button>

                {/* Help text */}
                {(origin || destination) && (!selectedOriginPlace && !userCoords || !selectedDestinationPlace) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-gray-500 dark:text-gray-400 text-center"
                    >
                        💡 Select a location from the suggestions for accurate routing
                    </motion.div>
                )}

                {/* Debug Panel (Development Only) */}
                {import.meta.env.DEV && debugInfo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                                🔍 Debug Info
                            </h4>
                            <button
                                type="button"
                                onClick={() => setDebugInfo(null)}
                                className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                Close
                            </button>
                        </div>
                        <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-auto max-h-64">
                            {JSON.stringify(debugInfo, null, 2)}
                        </pre>
                    </motion.div>
                )}
            </div>
        </motion.form>
    )
}

export default SearchBar
