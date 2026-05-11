// Route Service for BiyaHero
// Integrates with OpenRouteService (OSRM) to get actual route distances
// Provides real road-following geometry for accurate fare calculation

import { getLocationByName } from './searchService'

/**
 * Get route from OSRM (Open Source Routing Machine)
 * Returns actual road distance and geometry
 * @param {object} start - {lat, lng}
 * @param {object} end - {lat, lng}
 * @returns {Promise<object>} Route data with distance and geometry
 */
export const getRouteFromOSRM = async (start, end) => {
    try {
        // OSRM public API endpoint
        const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`

        const response = await fetch(url)
        const data = await response.json()

        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
            const route = data.routes[0]

            // Distance in meters, convert to kilometers
            const distanceKm = route.distance / 1000

            // Duration in seconds, convert to minutes
            const durationMinutes = Math.round(route.duration / 60)

            // Geometry coordinates [lng, lat] -> convert to [lat, lng] for Leaflet
            const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]])

            return {
                success: true,
                distance: distanceKm,
                distanceMeters: route.distance,
                duration: durationMinutes,
                durationSeconds: route.duration,
                geometry: coordinates,
                summary: `${distanceKm.toFixed(1)} km, ${durationMinutes} min`
            }
        } else {
            console.warn('OSRM routing failed:', data)
            return {
                success: false,
                error: 'Route not found',
                fallback: true
            }
        }
    } catch (error) {
        console.error('OSRM routing error:', error)
        return {
            success: false,
            error: error.message,
            fallback: true
        }
    }
}

/**
 * Geocode location name to coordinates using Nominatim
 * First checks local database, then falls back to Nominatim
 * @param {string} locationName - Location name
 * @param {string} region - Region (default: Batangas, Philippines)
 * @returns {Promise<object>} Coordinates {lat, lng}
 */
export const geocodeLocation = async (locationName, region = 'Batangas, Philippines') => {
    try {
        // First, check if location exists in our local database
        const localLocation = getLocationByName(locationName)

        // If found in local database, use Nominatim to get accurate coordinates
        // but with the exact name from our database for better results
        const searchQuery = localLocation ? localLocation.name : locationName

        const query = `${searchQuery}, ${region}`
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`

        const response = await fetch(url)
        const data = await response.json()

        if (data && data.length > 0) {
            return {
                success: true,
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
                displayName: data[0].display_name,
                isKnownLocation: !!localLocation
            }
        } else {
            return {
                success: false,
                error: 'Location not found'
            }
        }
    } catch (error) {
        console.error('Geocoding error:', error)
        return {
            success: false,
            error: error.message
        }
    }
}

/**
 * Get route with distance between two location names
 * Handles geocoding and routing
 * @param {string} originName - Origin location name
 * @param {string} destinationName - Destination location name
 * @returns {Promise<object>} Complete route data
 */
export const getRouteByNames = async (originName, destinationName) => {
    try {
        // Geocode origin
        const originGeo = await geocodeLocation(originName)
        if (!originGeo.success) {
            return {
                success: false,
                error: `Could not find origin: ${originName}`
            }
        }

        // Geocode destination
        const destGeo = await geocodeLocation(destinationName)
        if (!destGeo.success) {
            return {
                success: false,
                error: `Could not find destination: ${destinationName}`
            }
        }

        // Get route
        const route = await getRouteFromOSRM(
            { lat: originGeo.lat, lng: originGeo.lng },
            { lat: destGeo.lat, lng: destGeo.lng }
        )

        if (route.success) {
            return {
                success: true,
                origin: {
                    name: originName,
                    lat: originGeo.lat,
                    lng: originGeo.lng,
                    displayName: originGeo.displayName
                },
                destination: {
                    name: destinationName,
                    lat: destGeo.lat,
                    lng: destGeo.lng,
                    displayName: destGeo.displayName
                },
                distance: route.distance,
                duration: route.duration,
                geometry: route.geometry,
                summary: route.summary
            }
        } else {
            return route
        }
    } catch (error) {
        console.error('Route by names error:', error)
        return {
            success: false,
            error: error.message
        }
    }
}

/**
 * Get route with coordinates (for when user location is available)
 * @param {object} originCoords - {lat, lng}
 * @param {string} destinationName - Destination location name
 * @returns {Promise<object>} Complete route data
 */
export const getRouteFromCoords = async (originCoords, destinationName) => {
    try {
        // Geocode destination
        const destGeo = await geocodeLocation(destinationName)
        if (!destGeo.success) {
            return {
                success: false,
                error: `Could not find destination: ${destinationName}`
            }
        }

        // Get route
        const route = await getRouteFromOSRM(
            originCoords,
            { lat: destGeo.lat, lng: destGeo.lng }
        )

        if (route.success) {
            return {
                success: true,
                origin: {
                    name: 'Your Location',
                    lat: originCoords.lat,
                    lng: originCoords.lng
                },
                destination: {
                    name: destinationName,
                    lat: destGeo.lat,
                    lng: destGeo.lng,
                    displayName: destGeo.displayName
                },
                distance: route.distance,
                duration: route.duration,
                geometry: route.geometry,
                summary: route.summary
            }
        } else {
            return route
        }
    } catch (error) {
        console.error('Route from coords error:', error)
        return {
            success: false,
            error: error.message
        }
    }
}

/**
 * Calculate straight-line distance as fallback
 * Uses Haversine formula
 * @param {object} start - {lat, lng}
 * @param {object} end - {lat, lng}
 * @returns {number} Distance in kilometers
 */
export const calculateStraightLineDistance = (start, end) => {
    const R = 6371 // Earth's radius in kilometers
    const dLat = toRad(end.lat - start.lat)
    const dLng = toRad(end.lng - start.lng)

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(start.lat)) * Math.cos(toRad(end.lat)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c

    return distance
}

/**
 * Convert degrees to radians
 * @param {number} degrees - Degrees
 * @returns {number} Radians
 */
const toRad = (degrees) => {
    return degrees * (Math.PI / 180)
}

/**
 * Get fallback route when OSRM fails
 * Uses straight-line distance × 1.3 as road distance estimate
 * @param {object} start - {lat, lng}
 * @param {object} end - {lat, lng}
 * @returns {object} Fallback route data
 */
export const getFallbackRoute = (start, end) => {
    const straightDistance = calculateStraightLineDistance(start, end)
    // Multiply by 1.3 to account for road curves (typical road factor)
    const estimatedRoadDistance = straightDistance * 1.3

    // Estimate duration (30 km/h average speed)
    const estimatedDuration = Math.round((estimatedRoadDistance / 30) * 60)

    return {
        success: true,
        distance: estimatedRoadDistance,
        duration: estimatedDuration,
        geometry: [[start.lat, start.lng], [end.lat, end.lng]],
        summary: `~${estimatedRoadDistance.toFixed(1)} km (estimated)`,
        isFallback: true
    }
}

/**
 * Get route with automatic fallback
 * Tries OSRM first, falls back to estimation if needed
 * @param {object} start - {lat, lng}
 * @param {object} end - {lat, lng}
 * @returns {Promise<object>} Route data
 */
export const getRouteWithFallback = async (start, end) => {
    const route = await getRouteFromOSRM(start, end)

    if (route.success) {
        return route
    } else {
        console.warn('Using fallback distance calculation')
        return getFallbackRoute(start, end)
    }
}

// Export all functions
export default {
    getRouteFromOSRM,
    geocodeLocation,
    getRouteByNames,
    getRouteFromCoords,
    getRouteWithFallback,
    calculateStraightLineDistance,
    getFallbackRoute
}
