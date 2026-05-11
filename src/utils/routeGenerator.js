// Generate realistic route options for Batangas commuting
// Now uses distance-based fare calculation with actual route geometry

import { getRouteByNames, getRouteFromCoords, getRouteFromOSRM } from '../services/routeService'
import {
    calculateFareFromDistance,
    applyDiscount,
    getAllFareTypes,
    estimateTravelTime
} from './distanceBasedFare'
import { getRouteContextForAI } from '../data/routeIntelligence'

/**
 * Generate routes with distance-based fares
 * @param {string} origin - Origin location name
 * @param {string} destination - Destination location name
 * @param {string} commuterType - REGULAR, STUDENT, SENIOR, PWD
 * @param {object} userCoords - Optional user coordinates {lat, lng}
 * @param {object} originPlace - Optional validated origin place object
 * @param {object} destinationPlace - Optional validated destination place object
 * @returns {Promise<array>} Array of route options
 */
export const generateRoutes = async (origin, destination, commuterType = 'REGULAR', userCoords = null, originPlace = null, destinationPlace = null) => {
    try {
        // Get route with actual distance using validated coordinates
        let routeData

        // Use validated place objects if available (CRITICAL for accuracy)
        if (originPlace && destinationPlace) {
            // Both places validated - use direct coordinates
            routeData = await getRouteFromOSRM(
                { lat: originPlace.lat, lng: originPlace.lng },
                { lat: destinationPlace.lat, lng: destinationPlace.lng }
            )

            if (routeData.success) {
                routeData.origin = {
                    name: origin,
                    lat: originPlace.lat,
                    lng: originPlace.lng,
                    displayName: originPlace.displayName
                }
                routeData.destination = {
                    name: destination,
                    lat: destinationPlace.lat,
                    lng: destinationPlace.lng,
                    displayName: destinationPlace.displayName
                }
            }
        } else if (userCoords && destinationPlace) {
            // User location + validated destination
            routeData = await getRouteFromOSRM(
                userCoords,
                { lat: destinationPlace.lat, lng: destinationPlace.lng }
            )

            if (routeData.success) {
                routeData.origin = {
                    name: origin,
                    lat: userCoords.lat,
                    lng: userCoords.lng
                }
                routeData.destination = {
                    name: destination,
                    lat: destinationPlace.lat,
                    lng: destinationPlace.lng,
                    displayName: destinationPlace.displayName
                }
            }
        } else {
            // Fallback to old geocoding method (less accurate)
            if (userCoords) {
                routeData = await getRouteFromCoords(userCoords, destination)
            } else {
                routeData = await getRouteByNames(origin, destination)
            }
        }

        if (!routeData.success) {
            // Return fallback generic route
            return generateFallbackRoutes(origin, destination, commuterType)
        }

        // Calculate fares based on actual distance
        const distance = routeData.distance
        const regularFare = calculateFareFromDistance(distance)
        const discountedFare = applyDiscount(regularFare, commuterType)
        const allFares = getAllFareTypes(distance)

        // Get route intelligence context
        const routeContext = getRouteContextForAI(origin, destination)
        const vehicleType = routeContext ? routeContext.transportType : getVehicleType(distance)
        const difficulty = routeContext ? routeContext.difficulty : 'easy'
        const commuterTips = routeContext ? routeContext.tips : getCommuteTips(distance, origin, destination)
        const routeNotes = routeContext ? routeContext.notes : `Route distance: ${distance.toFixed(1)} km.`

        // Generate main direct route
        const routes = [
            {
                id: 1,
                type: 'direct',
                name: 'Direct Route',
                duration: `${routeData.duration} min`,
                distance: distance,
                distanceFormatted: `${distance.toFixed(1)} km`,
                baseFare: regularFare,
                currentFare: discountedFare,
                allFares: allFares,
                transfers: routeContext ? routeContext.transfers : 0,
                difficulty: difficulty,
                recommended: true,
                rushHourRisk: routeContext ? routeContext.rushHourRisk : 'Moderate',
                steps: [
                    {
                        vehicle: vehicleType,
                        from: origin,
                        to: destination,
                        duration: `${routeData.duration} min`,
                        distance: distance,
                        fare: discountedFare,
                        regularFare: regularFare,
                        tips: commuterTips
                    }
                ],
                notes: `${routeNotes} ${getFareExplanation(distance, regularFare)}`,
                geometry: routeData.geometry,
                isFallback: routeData.isFallback || false
            }
        ]

        return routes
    } catch (error) {
        console.error('Route generation error:', error)
        return generateFallbackRoutes(origin, destination, commuterType)
    }
}

/**
 * Get appropriate vehicle type based on distance
 * @param {number} distanceKm - Distance in kilometers
 * @returns {string} Vehicle type
 */
const getVehicleType = (distanceKm) => {
    if (distanceKm < 3) {
        return 'Tricycle/Jeepney'
    } else if (distanceKm < 15) {
        return 'Jeepney'
    } else if (distanceKm < 30) {
        return 'Jeepney/UV Express'
    } else {
        return 'Bus/UV Express'
    }
}

/**
 * Get commute tips based on distance and locations
 * @param {number} distanceKm - Distance in kilometers
 * @param {string} origin - Origin location
 * @param {string} destination - Destination location
 * @returns {string} Commute tips
 */
const getCommuteTips = (distanceKm, origin, destination) => {
    if (distanceKm < 3) {
        return 'Short distance. Tricycle available. Negotiate fare before riding.'
    } else if (distanceKm < 10) {
        return 'Look for jeeps with the correct signage. Prepare exact change.'
    } else if (distanceKm < 20) {
        return 'UV Express recommended for faster travel. Jeepney also available.'
    } else {
        return 'Bus or UV Express recommended for comfort. Check terminal schedules.'
    }
}

/**
 * Get fare explanation based on distance
 * @param {number} distanceKm - Distance in kilometers
 * @param {number} fare - Calculated fare
 * @returns {string} Fare explanation
 */
const getFareExplanation = (distanceKm, fare) => {
    if (distanceKm <= 5) {
        return `Base fare of ₱12 applies for distances up to 5 km.`
    } else {
        const additionalKm = Math.ceil(distanceKm - 5)
        return `Base fare ₱12 + ₱${additionalKm} for ${additionalKm} km beyond 5 km.`
    }
}

/**
 * Generate fallback routes when routing fails
 * @param {string} origin - Origin location
 * @param {string} destination - Destination location
 * @param {string} commuterType - REGULAR, STUDENT, SENIOR, PWD
 * @returns {array} Fallback routes
 */
const generateFallbackRoutes = (origin, destination, commuterType) => {
    // Estimate distance (fallback: 10 km average)
    const estimatedDistance = 10
    const regularFare = calculateFareFromDistance(estimatedDistance)
    const discountedFare = applyDiscount(regularFare, commuterType)
    const allFares = getAllFareTypes(estimatedDistance)
    const estimatedDuration = estimateTravelTime(estimatedDistance)

    return [
        {
            id: 1,
            type: 'direct',
            name: 'Estimated Route',
            duration: estimatedDuration,
            distance: estimatedDistance,
            distanceFormatted: `~${estimatedDistance} km`,
            baseFare: regularFare,
            currentFare: discountedFare,
            allFares: allFares,
            transfers: 0,
            difficulty: 'easy',
            recommended: true,
            steps: [
                {
                    vehicle: 'Jeepney/UV Express',
                    from: origin,
                    to: destination,
                    duration: estimatedDuration,
                    distance: estimatedDistance,
                    fare: discountedFare,
                    regularFare: regularFare,
                    tips: 'Ask locals for the best route. Multiple transport options may be available.'
                }
            ],
            notes: 'Estimated distance and fare. Actual fare may vary based on exact route.',
            isFallback: true
        }
    ]
}

// Export for backward compatibility
export default {
    generateRoutes
}
