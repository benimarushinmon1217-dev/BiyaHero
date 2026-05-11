// BiyaHero Route Intelligence Dataset
// Commuter-focused transportation knowledge base for Batangas
// Provides contextual route metadata for AI assistance and autocomplete

/**
 * Route Intelligence Dataset
 * 
 * Purpose: Provide commuter context, route metadata, and transportation intelligence
 * NOT for fare calculation (fares are computed dynamically based on distance)
 * 
 * This dataset powers:
 * - AI Assistant contextual understanding
 * - Autocomplete route prioritization
 * - Commuter tips and guidance
 * - Route difficulty assessment
 * - Transfer expectations
 * - Rush hour awareness
 */

export const ROUTE_INTELLIGENCE = [
    {
        origin: 'SM Lipa',
        destination: 'San Juan',
        transportType: 'Bus/Jeep',
        routeType: 'Intercity',
        difficulty: 'Easy',
        popular: true,
        supportsDynamicFare: true,
        estimatedTravelMode: 'Highway Route',
        routeNotes: 'Common commuter route from Lipa to eastern Batangas.',
        commonTransfers: 0,
        rushHourRisk: 'Moderate',
        studentFriendly: true,
        commuterTips: 'Expect heavier passenger traffic during weekends.',
        suggestedDropoff: 'San Juan Public Market',
        supportsAISuggestions: true
    },
    {
        origin: 'SM Lipa',
        destination: 'Rosario',
        transportType: 'Jeep/Bus',
        routeType: 'Intercity',
        difficulty: 'Easy',
        popular: true,
        supportsDynamicFare: true,
        estimatedTravelMode: 'Highway Route',
        routeNotes: 'Frequently traveled commuter corridor.',
        commonTransfers: 0,
        rushHourRisk: 'Moderate',
        studentFriendly: true,
        commuterTips: 'Morning rush hours may affect travel time.',
        suggestedDropoff: 'Rosario Town Proper',
        supportsAISuggestions: true
    },
    {
        origin: 'SM Lipa',
        destination: 'Antipolo Del Sur',
        transportType: 'Jeep',
        routeType: 'Barangay Route',
        difficulty: 'Moderate',
        popular: true,
        supportsDynamicFare: true,
        estimatedTravelMode: 'Local Jeep Route',
        routeNotes: 'Some jeepneys may only stop at Lipa Cathedral.',
        commonTransfers: 1,
        rushHourRisk: 'Low',
        studentFriendly: true,
        commuterTips: 'You may need to transfer at Lipa Cathedral depending on jeep route availability.',
        suggestedDropoff: 'Antipolo Del Sur Junction',
        supportsAISuggestions: true
    },
    {
        origin: 'SM Lipa',
        destination: 'Padre Garcia',
        transportType: 'Bus/Jeep',
        routeType: 'Intercity',
        difficulty: 'Easy',
        popular: true,
        supportsDynamicFare: true,
        estimatedTravelMode: 'Provincial Route',
        routeNotes: 'Accessible through major Batangas highway routes.',
        commonTransfers: 0,
        rushHourRisk: 'Moderate',
        studentFriendly: true,
        commuterTips: 'Travel time may increase during market days.',
        suggestedDropoff: 'Padre Garcia Bayan',
        supportsAISuggestions: true
    },
    {
        origin: 'SM Lipa',
        destination: 'Batangas City',
        transportType: 'Bus',
        routeType: 'Provincial',
        difficulty: 'Easy',
        popular: true,
        supportsDynamicFare: true,
        estimatedTravelMode: 'STAR Tollway',
        routeNotes: 'One of the busiest commuter corridors in Batangas.',
        commonTransfers: 0,
        rushHourRisk: 'High',
        studentFriendly: true,
        commuterTips: 'Expect traffic congestion during evening rush hour.',
        suggestedDropoff: 'Batangas Grand Terminal',
        supportsAISuggestions: true
    },
    {
        origin: 'Lipa City',
        destination: 'San Pablo City',
        transportType: 'Bus/Jeep',
        routeType: 'Inter-Province',
        difficulty: 'Moderate',
        popular: true,
        supportsDynamicFare: true,
        estimatedTravelMode: 'Boundary Route',
        routeNotes: 'Crosses Batangas-Laguna commuter corridor.',
        commonTransfers: 0,
        rushHourRisk: 'Moderate',
        studentFriendly: true,
        commuterTips: 'Boundary routes may have varying jeep availability.',
        suggestedDropoff: 'San Pablo Terminal',
        supportsAISuggestions: true
    },
    {
        origin: 'Lipa City',
        destination: 'Tanauan City',
        transportType: 'Jeep/UV Express',
        routeType: 'Intercity',
        difficulty: 'Easy',
        popular: true,
        supportsDynamicFare: true,
        estimatedTravelMode: 'JP Laurel Highway',
        routeNotes: 'Major highway route connecting two cities.',
        commonTransfers: 0,
        rushHourRisk: 'Moderate',
        studentFriendly: true,
        commuterTips: 'UV Express available for faster travel.',
        suggestedDropoff: 'Tanauan City Hall',
        supportsAISuggestions: true
    },
    {
        origin: 'Batangas City',
        destination: 'Batangas Port',
        transportType: 'Jeep/Tricycle',
        routeType: 'City Route',
        difficulty: 'Easy',
        popular: true,
        supportsDynamicFare: true,
        estimatedTravelMode: 'City Route',
        routeNotes: 'Short distance route to ferry terminal.',
        commonTransfers: 0,
        rushHourRisk: 'Low',
        studentFriendly: true,
        commuterTips: 'Arrive 1 hour before ferry departure. Tricycles available for faster travel.',
        suggestedDropoff: 'Batangas Port Terminal',
        supportsAISuggestions: true
    },
    {
        origin: 'Lipa City',
        destination: 'De La Salle Lipa',
        transportType: 'Jeep/Tricycle',
        routeType: 'School Route',
        difficulty: 'Easy',
        popular: true,
        supportsDynamicFare: true,
        estimatedTravelMode: 'City Route',
        routeNotes: 'Heavy student traffic during school days.',
        commonTransfers: 0,
        rushHourRisk: 'High',
        studentFriendly: true,
        commuterTips: 'Jeeps fill up quickly during class hours (7-8 AM, 4-6 PM).',
        suggestedDropoff: 'DLSL Main Gate',
        supportsAISuggestions: true
    },
    {
        origin: 'Batangas City',
        destination: 'Batangas State University',
        transportType: 'Jeep',
        routeType: 'School Route',
        difficulty: 'Easy',
        popular: true,
        supportsDynamicFare: true,
        estimatedTravelMode: 'City Route',
        routeNotes: 'Main university route with frequent jeepney service.',
        commonTransfers: 0,
        rushHourRisk: 'High',
        studentFriendly: true,
        commuterTips: 'Very crowded during enrollment period and exam weeks.',
        suggestedDropoff: 'BatStateU Main Campus',
        supportsAISuggestions: true
    },
    {
        origin: 'Lipa City',
        destination: 'Robinsons Place Lipa',
        transportType: 'Jeep/Tricycle',
        routeType: 'City Route',
        difficulty: 'Easy',
        popular: true,
        supportsDynamicFare: true,
        estimatedTravelMode: 'City Route',
        routeNotes: 'Short distance within Lipa City.',
        commonTransfers: 0,
        rushHourRisk: 'Low',
        studentFriendly: true,
        commuterTips: 'Tricycles available for direct route. Jeeps pass by frequently.',
        suggestedDropoff: 'Robinsons Lipa Main Entrance',
        supportsAISuggestions: true
    },
    {
        origin: 'Lipa City',
        destination: 'Lipa Cathedral',
        transportType: 'Jeep/Tricycle',
        routeType: 'City Route',
        difficulty: 'Easy',
        popular: true,
        supportsDynamicFare: true,
        estimatedTravelMode: 'City Center',
        routeNotes: 'Main transfer point for many jeepney routes.',
        commonTransfers: 0,
        rushHourRisk: 'Moderate',
        studentFriendly: true,
        commuterTips: 'Cathedral is a major jeepney terminal. Good transfer point.',
        suggestedDropoff: 'Lipa Cathedral',
        supportsAISuggestions: true
    },
    {
        origin: 'Lemery',
        destination: 'Batangas City',
        transportType: 'Bus/Jeep',
        routeType: 'Intercity',
        difficulty: 'Moderate',
        popular: true,
        supportsDynamicFare: true,
        estimatedTravelMode: 'Coastal Route',
        routeNotes: 'Scenic coastal route with moderate travel time.',
        commonTransfers: 0,
        rushHourRisk: 'Moderate',
        studentFriendly: true,
        commuterTips: 'Bus recommended for longer comfort. Bring water for the trip.',
        suggestedDropoff: 'Batangas Grand Terminal',
        supportsAISuggestions: true
    },
    {
        origin: 'Balayan',
        destination: 'Nasugbu',
        transportType: 'Jeep',
        routeType: 'Intercity',
        difficulty: 'Moderate',
        popular: true,
        supportsDynamicFare: true,
        estimatedTravelMode: 'Coastal Route',
        routeNotes: 'Coastal route with scenic views.',
        commonTransfers: 0,
        rushHourRisk: 'Low',
        studentFriendly: true,
        commuterTips: 'Popular weekend route. Expect more passengers on Saturdays/Sundays.',
        suggestedDropoff: 'Nasugbu Town Proper',
        supportsAISuggestions: true
    },
    {
        origin: 'Tanauan City',
        destination: 'Batangas City',
        transportType: 'Jeep/UV Express',
        routeType: 'Intercity',
        difficulty: 'Easy',
        popular: true,
        supportsDynamicFare: true,
        estimatedTravelMode: 'Highway Route',
        routeNotes: 'Major highway corridor with frequent service.',
        commonTransfers: 0,
        rushHourRisk: 'Moderate',
        studentFriendly: true,
        commuterTips: 'UV Express available for faster, more comfortable travel.',
        suggestedDropoff: 'Batangas Grand Terminal',
        supportsAISuggestions: true
    },
    {
        origin: 'Lipa City',
        destination: 'Manila',
        transportType: 'Bus',
        routeType: 'Inter-Province',
        difficulty: 'Moderate',
        popular: true,
        supportsDynamicFare: true,
        estimatedTravelMode: 'STAR Tollway',
        routeNotes: 'Long-distance route via expressway.',
        commonTransfers: 0,
        rushHourRisk: 'High',
        studentFriendly: true,
        commuterTips: 'Book early on weekends. DLTB and JAM buses available. Travel time 2-3 hours.',
        suggestedDropoff: 'Buendia/Cubao Terminal',
        supportsAISuggestions: true
    },
    {
        origin: 'Batangas City',
        destination: 'Manila',
        transportType: 'Bus',
        routeType: 'Inter-Province',
        difficulty: 'Moderate',
        popular: true,
        supportsDynamicFare: true,
        estimatedTravelMode: 'STAR Tollway',
        routeNotes: 'Major inter-province route with frequent bus service.',
        commonTransfers: 0,
        rushHourRisk: 'High',
        studentFriendly: true,
        commuterTips: 'Air-conditioned buses available. Book ahead during holidays.',
        suggestedDropoff: 'Buendia/Cubao Terminal',
        supportsAISuggestions: true
    },
    {
        origin: 'SM Lipa',
        destination: 'Lipa City Hall',
        transportType: 'Jeep/Tricycle',
        routeType: 'City Route',
        difficulty: 'Easy',
        popular: true,
        supportsDynamicFare: true,
        estimatedTravelMode: 'City Center',
        routeNotes: 'Short city route to government center.',
        commonTransfers: 0,
        rushHourRisk: 'Moderate',
        studentFriendly: true,
        commuterTips: 'Expect more passengers during office hours (8 AM - 5 PM).',
        suggestedDropoff: 'Lipa City Hall',
        supportsAISuggestions: true
    },
    {
        origin: 'Lipa City',
        destination: 'FAITH Colleges',
        transportType: 'Jeep/Tricycle',
        routeType: 'School Route',
        difficulty: 'Easy',
        popular: true,
        supportsDynamicFare: true,
        estimatedTravelMode: 'City Route',
        routeNotes: 'Student-heavy route during school days.',
        commonTransfers: 0,
        rushHourRisk: 'High',
        studentFriendly: true,
        commuterTips: 'Peak hours: 7-8 AM and 4-6 PM. Jeeps fill up quickly.',
        suggestedDropoff: 'FAITH Colleges Main Gate',
        supportsAISuggestions: true
    },
    {
        origin: 'Batangas City',
        destination: 'SM City Batangas',
        transportType: 'Jeep/Tricycle',
        routeType: 'City Route',
        difficulty: 'Easy',
        popular: true,
        supportsDynamicFare: true,
        estimatedTravelMode: 'City Route',
        routeNotes: 'Popular shopping destination route.',
        commonTransfers: 0,
        rushHourRisk: 'Moderate',
        studentFriendly: true,
        commuterTips: 'Crowded on weekends. Tricycles available for direct route.',
        suggestedDropoff: 'SM City Batangas Main Entrance',
        supportsAISuggestions: true
    }
]

/**
 * Route difficulty levels
 */
export const ROUTE_DIFFICULTY = {
    EASY: 'Easy',
    MODERATE: 'Moderate',
    HARD: 'Hard'
}

/**
 * Rush hour risk levels
 */
export const RUSH_HOUR_RISK = {
    LOW: 'Low',
    MODERATE: 'Moderate',
    HIGH: 'High'
}

/**
 * Transport types
 */
export const TRANSPORT_TYPES = {
    JEEP: 'Jeep',
    BUS: 'Bus',
    UV_EXPRESS: 'UV Express',
    TRICYCLE: 'Tricycle',
    VAN: 'Van'
}

/**
 * Route types
 */
export const ROUTE_TYPES = {
    CITY: 'City Route',
    INTERCITY: 'Intercity',
    PROVINCIAL: 'Provincial',
    INTER_PROVINCE: 'Inter-Province',
    BARANGAY: 'Barangay Route',
    SCHOOL: 'School Route'
}

/**
 * Find route intelligence by origin and destination
 * @param {string} origin - Origin location
 * @param {string} destination - Destination location
 * @returns {object|null} Route intelligence object or null
 */
export const findRouteIntelligence = (origin, destination) => {
    const normalizedOrigin = origin.toLowerCase().trim()
    const normalizedDestination = destination.toLowerCase().trim()

    // Try direct match
    let route = ROUTE_INTELLIGENCE.find(r =>
        r.origin.toLowerCase() === normalizedOrigin &&
        r.destination.toLowerCase() === normalizedDestination
    )

    // Try reverse match (bidirectional)
    if (!route) {
        route = ROUTE_INTELLIGENCE.find(r =>
            r.origin.toLowerCase() === normalizedDestination &&
            r.destination.toLowerCase() === normalizedOrigin
        )
    }

    // Try partial match
    if (!route) {
        route = ROUTE_INTELLIGENCE.find(r =>
            r.origin.toLowerCase().includes(normalizedOrigin) &&
            r.destination.toLowerCase().includes(normalizedDestination)
        )
    }

    return route
}

/**
 * Get popular routes
 * @param {number} limit - Maximum number of routes
 * @returns {array} Popular routes
 */
export const getPopularRoutes = (limit = 10) => {
    return ROUTE_INTELLIGENCE
        .filter(r => r.popular)
        .slice(0, limit)
}

/**
 * Get student-friendly routes
 * @param {number} limit - Maximum number of routes
 * @returns {array} Student-friendly routes
 */
export const getStudentFriendlyRoutes = (limit = 10) => {
    return ROUTE_INTELLIGENCE
        .filter(r => r.studentFriendly)
        .slice(0, limit)
}

/**
 * Get routes by difficulty
 * @param {string} difficulty - Difficulty level
 * @returns {array} Routes matching difficulty
 */
export const getRoutesByDifficulty = (difficulty) => {
    return ROUTE_INTELLIGENCE.filter(r => r.difficulty === difficulty)
}

/**
 * Get routes by transport type
 * @param {string} transportType - Transport type
 * @returns {array} Routes matching transport type
 */
export const getRoutesByTransportType = (transportType) => {
    return ROUTE_INTELLIGENCE.filter(r =>
        r.transportType.toLowerCase().includes(transportType.toLowerCase())
    )
}

/**
 * Get commuter tips for a route
 * @param {string} origin - Origin location
 * @param {string} destination - Destination location
 * @returns {string|null} Commuter tips or null
 */
export const getCommuterTips = (origin, destination) => {
    const route = findRouteIntelligence(origin, destination)
    return route ? route.commuterTips : null
}

/**
 * Get route notes for AI assistant
 * @param {string} origin - Origin location
 * @param {string} destination - Destination location
 * @returns {object|null} Route context for AI or null
 */
export const getRouteContextForAI = (origin, destination) => {
    const route = findRouteIntelligence(origin, destination)

    if (!route) {
        return null
    }

    return {
        transportType: route.transportType,
        difficulty: route.difficulty,
        transfers: route.commonTransfers,
        rushHourRisk: route.rushHourRisk,
        tips: route.commuterTips,
        notes: route.routeNotes,
        suggestedDropoff: route.suggestedDropoff,
        studentFriendly: route.studentFriendly
    }
}

/**
 * Check if route is high-traffic during rush hour
 * @param {string} origin - Origin location
 * @param {string} destination - Destination location
 * @returns {boolean} True if high rush hour risk
 */
export const isRushHourRoute = (origin, destination) => {
    const route = findRouteIntelligence(origin, destination)
    return route ? route.rushHourRisk === 'High' : false
}

/**
 * Get all unique origins
 * @returns {array} Array of unique origins
 */
export const getAllOrigins = () => {
    const origins = new Set()
    ROUTE_INTELLIGENCE.forEach(r => origins.add(r.origin))
    return Array.from(origins).sort()
}

/**
 * Get all unique destinations
 * @returns {array} Array of unique destinations
 */
export const getAllDestinations = () => {
    const destinations = new Set()
    ROUTE_INTELLIGENCE.forEach(r => destinations.add(r.destination))
    return Array.from(destinations).sort()
}

/**
 * Get route intelligence statistics
 * @returns {object} Statistics about route intelligence dataset
 */
export const getRouteIntelligenceStats = () => {
    return {
        totalRoutes: ROUTE_INTELLIGENCE.length,
        popularRoutes: ROUTE_INTELLIGENCE.filter(r => r.popular).length,
        studentFriendlyRoutes: ROUTE_INTELLIGENCE.filter(r => r.studentFriendly).length,
        easyRoutes: ROUTE_INTELLIGENCE.filter(r => r.difficulty === 'Easy').length,
        moderateRoutes: ROUTE_INTELLIGENCE.filter(r => r.difficulty === 'Moderate').length,
        hardRoutes: ROUTE_INTELLIGENCE.filter(r => r.difficulty === 'Hard').length,
        highRushHourRoutes: ROUTE_INTELLIGENCE.filter(r => r.rushHourRisk === 'High').length
    }
}

// Export all
export default {
    ROUTE_INTELLIGENCE,
    ROUTE_DIFFICULTY,
    RUSH_HOUR_RISK,
    TRANSPORT_TYPES,
    ROUTE_TYPES,
    findRouteIntelligence,
    getPopularRoutes,
    getStudentFriendlyRoutes,
    getRoutesByDifficulty,
    getRoutesByTransportType,
    getCommuterTips,
    getRouteContextForAI,
    isRushHourRoute,
    getAllOrigins,
    getAllDestinations,
    getRouteIntelligenceStats
}
