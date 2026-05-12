// Enhanced Geocoding Service for BiyaHero
// Provides structured place selection with validated coordinates
// Prioritizes Batangas landmarks and prevents destination ambiguity

import { getLocationByName } from './searchService'

/**
 * Place object structure
 * @typedef {Object} Place
 * @property {string} name - Place name
 * @property {number} lat - Latitude
 * @property {number} lng - Longitude
 * @property {string} displayName - Full display name
 * @property {string} category - Place category (landmark, road, building, etc.)
 * @property {string} municipality - Municipality name
 * @property {string} province - Province name
 * @property {number} confidence - Confidence score (0-1)
 * @property {string} placeType - OSM place type
 * @property {boolean} isKnownLocation - From local database
 */

/**
 * Get structured place suggestions from Nominatim
 * Returns multiple options for user confirmation
 * @param {string} query - Search query
 * @param {number} limit - Maximum results (default: 5)
 * @returns {Promise<Array<Place>>} Array of place objects
 */
export const getPlaceSuggestions = async (query, limit = 5) => {
    try {
        // Check if location exists in local database first
        const localLocation = getLocationByName(query)
        const searchQuery = localLocation ? localLocation.name : query

        // Search with Batangas bias
        const url = `https://nominatim.openstreetmap.org/search?` +
            `format=json` +
            `&q=${encodeURIComponent(searchQuery)}, Batangas, Philippines` +
            `&limit=${limit}` +
            `&addressdetails=1` +
            `&extratags=1` +
            `&namedetails=1` +
            `&accept-language=en`

        const response = await fetch(url)
        const data = await response.json()

        if (!data || data.length === 0) {
            return []
        }

        // Convert to structured place objects
        const places = data.map(result => createPlaceObject(result, !!localLocation))

        // Sort by confidence and Batangas priority
        return places.sort((a, b) => {
            // Prioritize known locations
            if (a.isKnownLocation && !b.isKnownLocation) return -1
            if (!a.isKnownLocation && b.isKnownLocation) return 1

            // Prioritize Batangas locations
            const aBatangas = a.province?.toLowerCase().includes('batangas')
            const bBatangas = b.province?.toLowerCase().includes('batangas')
            if (aBatangas && !bBatangas) return -1
            if (!aBatangas && bBatangas) return 1

            // Sort by confidence
            return b.confidence - a.confidence
        })
    } catch (error) {
        console.error('Place suggestions error:', error)
        return []
    }
}

/**
 * Create structured place object from Nominatim result
 * @param {object} result - Nominatim result
 * @param {boolean} isKnownLocation - From local database
 * @returns {Place} Structured place object
 */
const createPlaceObject = (result, isKnownLocation = false) => {
    const address = result.address || {}

    // Extract place category from OSM type
    const category = categorizePlaceType(result.type, result.class, address)

    // Calculate confidence score
    const confidence = calculateConfidence(result, address, isKnownLocation)

    // Extract municipality
    const municipality = address.city || address.town || address.village ||
        address.municipality || address.county || ''

    // Extract province
    const province = address.state || address.province || ''

    return {
        name: result.name || result.display_name.split(',')[0],
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        displayName: result.display_name,
        category,
        municipality,
        province,
        confidence,
        placeType: result.type,
        osmClass: result.class,
        isKnownLocation
    }
}

/**
 * Categorize place type from OSM data
 * @param {string} type - OSM type
 * @param {string} osmClass - OSM class
 * @param {object} address - Address components
 * @returns {string} Category
 */
const categorizePlaceType = (type, osmClass, address) => {
    // Landmarks and buildings
    if (type === 'place_of_worship' || osmClass === 'amenity' && type === 'place_of_worship') {
        return 'church'
    }
    if (type === 'university' || type === 'college' || type === 'school') {
        return 'school'
    }
    if (type === 'hospital' || type === 'clinic') {
        return 'hospital'
    }
    if (type === 'mall' || type === 'shopping_centre') {
        return 'mall'
    }
    if (type === 'bus_station' || type === 'terminal') {
        return 'terminal'
    }
    if (type === 'city_hall' || type === 'townhall') {
        return 'public_office'
    }

    // Transportation
    if (osmClass === 'highway') {
        return 'road'
    }
    if (type === 'bus_stop' || type === 'station') {
        return 'transport'
    }

    // Areas
    if (type === 'city' || type === 'town') {
        return 'municipality'
    }
    if (type === 'village' || type === 'hamlet' || type === 'suburb') {
        return 'barangay'
    }

    // Buildings
    if (osmClass === 'building') {
        return 'building'
    }

    // Default
    return 'landmark'
}

/**
 * Calculate confidence score for place
 * Higher score = more likely to be correct destination
 * @param {object} result - Nominatim result
 * @param {object} address - Address components
 * @param {boolean} isKnownLocation - From local database
 * @returns {number} Confidence score (0-1)
 */
const calculateConfidence = (result, address, isKnownLocation) => {
    let confidence = 0.5 // Base confidence

    // Boost for known locations
    if (isKnownLocation) {
        confidence += 0.3
    }

    // Boost for Batangas locations
    const province = address.state || address.province || ''
    if (province.toLowerCase().includes('batangas')) {
        confidence += 0.2
    }

    // Boost for specific place types (not roads or areas)
    const specificTypes = ['place_of_worship', 'university', 'hospital', 'mall', 'terminal', 'school']
    if (specificTypes.includes(result.type)) {
        confidence += 0.15
    }

    // Penalty for roads and parking
    if (result.class === 'highway' || result.type === 'parking') {
        confidence -= 0.2
    }

    // Penalty for administrative boundaries (too broad)
    if (result.class === 'boundary') {
        confidence -= 0.15
    }

    // Boost for having a specific name
    if (result.name && result.name.length > 0) {
        confidence += 0.1
    }

    // Normalize to 0-1 range
    return Math.max(0, Math.min(1, confidence))
}

/**
 * Get single best place match
 * For backward compatibility with existing code
 * @param {string} query - Search query
 * @returns {Promise<Place|null>} Best matching place or null
 */
export const getBestPlaceMatch = async (query) => {
    const suggestions = await getPlaceSuggestions(query, 1)
    return suggestions.length > 0 ? suggestions[0] : null
}

/**
 * Geocode with place confirmation
 * Returns structured place object instead of just coordinates
 * @param {string} locationName - Location name
 * @returns {Promise<object>} Result with place object
 */
export const geocodeWithConfirmation = async (locationName) => {
    try {
        const suggestions = await getPlaceSuggestions(locationName, 5)

        if (suggestions.length === 0) {
            return {
                success: false,
                error: 'Location not found',
                suggestions: []
            }
        }

        // Return top suggestion as default, but include all suggestions
        return {
            success: true,
            place: suggestions[0],
            suggestions: suggestions,
            needsConfirmation: suggestions.length > 1
        }
    } catch (error) {
        console.error('Geocoding with confirmation error:', error)
        return {
            success: false,
            error: error.message,
            suggestions: []
        }
    }
}

/**
 * Reverse geocode coordinates to place
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<Place|null>} Place object or null
 */
export const reverseGeocode = async (lat, lng) => {
    try {
        const url = `https://nominatim.openstreetmap.org/reverse?` +
            `format=json` +
            `&lat=${lat}` +
            `&lon=${lng}` +
            `&addressdetails=1` +
            `&accept-language=en`

        const response = await fetch(url)
        const data = await response.json()

        if (!data || data.error) {
            return null
        }

        return createPlaceObject(data, false)
    } catch (error) {
        console.error('Reverse geocode error:', error)
        return null
    }
}

/**
 * Get place icon based on category
 * @param {string} category - Place category
 * @returns {string} Icon emoji
 */
export const getPlaceIcon = (category) => {
    const icons = {
        church: '⛪',
        school: '🎓',
        hospital: '🏥',
        mall: '🛍️',
        terminal: '🚌',
        public_office: '🏛️',
        road: '🛣️',
        municipality: '🏙️',
        barangay: '📍',
        transport: '🚏',
        building: '🏢',
        landmark: '📍'
    }
    return icons[category] || '📍'
}

/**
 * Format place for display
 * @param {Place} place - Place object
 * @returns {string} Formatted display string
 */
export const formatPlaceDisplay = (place) => {
    const parts = [place.name]

    if (place.category && place.category !== 'landmark') {
        const categoryLabels = {
            church: 'Church',
            school: 'School',
            hospital: 'Hospital',
            mall: 'Mall',
            terminal: 'Terminal',
            public_office: 'Government Office',
            road: 'Road',
            municipality: 'Municipality',
            barangay: 'Barangay',
            transport: 'Transport Hub',
            building: 'Building'
        }
        const label = categoryLabels[place.category]
        if (label) parts.push(label)
    }

    if (place.municipality) {
        parts.push(place.municipality)
    }

    return parts.join(' • ')
}

/**
 * Validate place coordinates
 * Ensures coordinates are within reasonable Batangas bounds
 * @param {Place} place - Place object
 * @returns {boolean} True if valid
 */
export const validatePlaceCoordinates = (place) => {
    // Batangas Province bounds (expanded to cover all areas)
    const BATANGAS_BOUNDS = {
        minLat: 13.4,    // Southern Batangas
        maxLat: 14.4,    // Northern Batangas
        minLng: 120.7,   // Western Batangas
        maxLng: 121.8    // Eastern Batangas (includes Lipa City)
    }

    return (
        place.lat >= BATANGAS_BOUNDS.minLat &&
        place.lat <= BATANGAS_BOUNDS.maxLat &&
        place.lng >= BATANGAS_BOUNDS.minLng &&
        place.lng <= BATANGAS_BOUNDS.maxLng
    )
}

// Export all functions
export default {
    getPlaceSuggestions,
    getBestPlaceMatch,
    geocodeWithConfirmation,
    reverseGeocode,
    getPlaceIcon,
    formatPlaceDisplay,
    validatePlaceCoordinates
}
