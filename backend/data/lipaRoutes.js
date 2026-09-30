/**
 * Lipa City Jeepney Routes Database
 * Based on actual jeepney routes in Lipa City, Batangas
 * 
 * Route Structure:
 * - Each route has specific stops in order
 * - Transfer points are major hubs where multiple routes intersect
 * - Routes are bidirectional (can go both ways)
 */
import { KNOWN_PLACE_LOCATIONS } from '../../shared/knownPlaceLocations.js';

export const LIPA_JEEPNEY_ROUTES = [
    {
        routeId: 'lipa-01',
        routeName: 'Lipa Bayan - Antipolo',
        transportType: 'jeepney',
        stops: [
            { name: 'Lipa Cathedral', lat: 13.9405, lng: 121.1655, isHub: true },
            { name: 'Lipa City Hall', lat: 13.9411, lng: 121.1650, isHub: false },
            { name: 'Lipa Sabang', lat: 13.9420, lng: 121.1670, isHub: true },
            { name: 'Antipolo Del Norte', lat: 13.9480, lng: 121.1690, isHub: false },
            { name: 'Antipolo Del Sur', lat: 13.9500, lng: 121.1700, isHub: false }
        ],
        frequency: 'high', // Every 5-10 minutes
        operatingHours: '5:00 AM - 9:00 PM',
        baseFare: 12
    },
    {
        routeId: 'lipa-02',
        routeName: 'Lipa Bayan - SM Lipa',
        transportType: 'jeepney',
        stops: [
            { name: 'Lipa Cathedral', lat: 13.9405, lng: 121.1655, isHub: true },
            { name: 'Lipa Sabang', lat: 13.9420, lng: 121.1670, isHub: true },
            { name: 'Robinsons Place Lipa', lat: 13.9370, lng: 121.1640, isHub: true },
            { name: 'SM City Lipa', lat: KNOWN_PLACE_LOCATIONS.smCityLipa.latitude, lng: KNOWN_PLACE_LOCATIONS.smCityLipa.longitude, isHub: true }
        ],
        frequency: 'very_high', // Every 3-5 minutes
        operatingHours: '5:00 AM - 10:00 PM',
        baseFare: 12
    },
    {
        routeId: 'lipa-03',
        routeName: 'Lipa Bayan - BSU',
        transportType: 'jeepney',
        stops: [
            { name: 'Lipa Cathedral', lat: 13.9405, lng: 121.1655, isHub: true },
            { name: 'Lipa City Hall', lat: 13.9411, lng: 121.1650, isHub: false },
            { name: 'Batangas State University', lat: 13.9450, lng: 121.1680, isHub: true },
            { name: 'Big Ben Terminal', lat: 13.9420, lng: 121.1670, isHub: true }
        ],
        frequency: 'high',
        operatingHours: '5:00 AM - 9:00 PM',
        baseFare: 12
    },
    {
        routeId: 'lipa-04',
        routeName: 'Lipa Bayan - Mataas na Lupa',
        transportType: 'jeepney',
        stops: [
            { name: 'Lipa Cathedral', lat: 13.9405, lng: 121.1655, isHub: true },
            { name: 'Lipa Sabang', lat: 13.9420, lng: 121.1670, isHub: true },
            { name: 'Mataas na Lupa', lat: 13.9550, lng: 121.1750, isHub: false }
        ],
        frequency: 'medium',
        operatingHours: '5:30 AM - 8:00 PM',
        baseFare: 12
    },
    {
        routeId: 'lipa-05',
        routeName: 'SM Lipa - Robinsons',
        transportType: 'jeepney',
        stops: [
            { name: 'SM City Lipa', lat: KNOWN_PLACE_LOCATIONS.smCityLipa.latitude, lng: KNOWN_PLACE_LOCATIONS.smCityLipa.longitude, isHub: true },
            { name: 'Robinsons Place Lipa', lat: 13.9370, lng: 121.1640, isHub: true },
            { name: 'Lipa Sabang', lat: 13.9420, lng: 121.1670, isHub: true },
            { name: 'Lipa Cathedral', lat: 13.9405, lng: 121.1655, isHub: true }
        ],
        frequency: 'very_high',
        operatingHours: '6:00 AM - 10:00 PM',
        baseFare: 12
    }
];

/**
 * Major transfer hubs in Lipa City
 * These are points where multiple jeepney routes intersect
 */
export const LIPA_TRANSFER_HUBS = [
    {
        id: 'hub-lipa-cathedral',
        name: 'Lipa Cathedral',
        displayName: 'San Sebastian Cathedral (Lipa Bayan)',
        lat: 13.9405,
        lng: 121.1655,
        importance: 10, // Highest - main terminal
        description: 'Main jeepney terminal in Lipa City. All routes pass through here.',
        availableRoutes: ['lipa-01', 'lipa-02', 'lipa-03', 'lipa-04', 'lipa-05'],
        facilities: ['waiting area', 'stores', 'restrooms']
    },
    {
        id: 'hub-lipa-sabang',
        name: 'Lipa Sabang',
        displayName: 'Lipa Sabang Junction',
        lat: 13.9420,
        lng: 121.1670,
        importance: 9,
        description: 'Major junction connecting northern and central Lipa routes.',
        availableRoutes: ['lipa-01', 'lipa-02', 'lipa-04', 'lipa-05'],
        facilities: ['stores', 'waiting area']
    },
    {
        id: 'hub-sm-lipa',
        name: 'SM City Lipa',
        displayName: 'SM City Lipa',
        lat: KNOWN_PLACE_LOCATIONS.smCityLipa.latitude,
        lng: KNOWN_PLACE_LOCATIONS.smCityLipa.longitude,
        importance: 9,
        description: 'Major shopping mall and transport hub.',
        availableRoutes: ['lipa-02', 'lipa-05'],
        facilities: ['mall', 'food court', 'restrooms', 'waiting area']
    },
    {
        id: 'hub-robinsons-lipa',
        name: 'Robinsons Place Lipa',
        displayName: 'Robinsons Place Lipa',
        lat: 13.9370,
        lng: 121.1640,
        importance: 8,
        description: 'Shopping mall with jeepney terminal.',
        availableRoutes: ['lipa-02', 'lipa-05'],
        facilities: ['mall', 'food court', 'restrooms']
    },
    {
        id: 'hub-bsu',
        name: 'Batangas State University',
        displayName: 'Batangas State University - Lipa',
        lat: 13.9450,
        lng: 121.1680,
        importance: 8,
        description: 'University campus with high student traffic.',
        availableRoutes: ['lipa-03'],
        facilities: ['campus', 'stores']
    },
    {
        id: 'hub-big-ben',
        name: 'Big Ben Terminal',
        displayName: 'Big Ben Terminal',
        lat: 13.9420,
        lng: 121.1670,
        importance: 7,
        description: 'Bus and jeepney terminal for provincial routes.',
        availableRoutes: ['lipa-03'],
        facilities: ['terminal', 'stores', 'restrooms']
    }
];

/**
 * Find which routes serve a specific location
 * @param {string} locationName - Name of the location
 * @returns {Array} Array of routes that serve this location
 */
export const findRoutesServingLocation = (locationName) => {
    const normalizedName = locationName.toLowerCase().trim();

    return LIPA_JEEPNEY_ROUTES.filter(route =>
        route.stops.some(stop =>
            stop.name.toLowerCase().includes(normalizedName) ||
            normalizedName.includes(stop.name.toLowerCase())
        )
    );
};

/**
 * Find common routes between two locations
 * @param {string} origin - Origin location name
 * @param {string} destination - Destination location name
 * @returns {Array} Array of routes that serve both locations
 */
export const findDirectRoutes = (origin, destination) => {
    const originRoutes = findRoutesServingLocation(origin);
    const destRoutes = findRoutesServingLocation(destination);

    // Find routes that serve both locations
    return originRoutes.filter(route =>
        destRoutes.some(dr => dr.routeId === route.routeId)
    );
};

/**
 * Find transfer points between two locations
 * @param {string} origin - Origin location name
 * @param {string} destination - Destination location name
 * @returns {Array} Array of possible transfer hubs
 */
export const findTransferPoints = (origin, destination) => {
    const originRoutes = findRoutesServingLocation(origin);
    const destRoutes = findRoutesServingLocation(destination);

    const transferPoints = [];

    // Find common hubs between origin and destination routes
    originRoutes.forEach(originRoute => {
        destRoutes.forEach(destRoute => {
            if (originRoute.routeId !== destRoute.routeId) {
                // Find common stops that are hubs
                originRoute.stops.forEach(originStop => {
                    destRoute.stops.forEach(destStop => {
                        if (originStop.name === destStop.name && originStop.isHub) {
                            const hub = LIPA_TRANSFER_HUBS.find(h =>
                                h.name === originStop.name
                            );
                            if (hub && !transferPoints.find(tp => tp.id === hub.id)) {
                                transferPoints.push({
                                    ...hub,
                                    originRoute: originRoute.routeName,
                                    destinationRoute: destRoute.routeName
                                });
                            }
                        }
                    });
                });
            }
        });
    });

    // Sort by importance
    return transferPoints.sort((a, b) => b.importance - a.importance);
};

/**
 * Get stop order in a route
 * @param {string} routeId - Route ID
 * @param {string} stopName - Stop name
 * @returns {number} Order index, or -1 if not found
 */
export const getStopOrder = (routeId, stopName) => {
    const route = LIPA_JEEPNEY_ROUTES.find(r => r.routeId === routeId);
    if (!route) return -1;

    return route.stops.findIndex(stop =>
        stop.name.toLowerCase().includes(stopName.toLowerCase()) ||
        stopName.toLowerCase().includes(stop.name.toLowerCase())
    );
};

/**
 * Check if route goes from origin to destination (in correct order)
 * @param {string} routeId - Route ID
 * @param {string} origin - Origin stop name
 * @param {string} destination - Destination stop name
 * @returns {boolean} True if route goes in correct direction
 */
export const isCorrectDirection = (routeId, origin, destination) => {
    const originOrder = getStopOrder(routeId, origin);
    const destOrder = getStopOrder(routeId, destination);

    if (originOrder === -1 || destOrder === -1) return false;

    // Route can go both ways, so check if destination comes after origin
    // or if origin comes after destination (reverse direction)
    return Math.abs(destOrder - originOrder) > 0;
};

export default {
    LIPA_JEEPNEY_ROUTES,
    LIPA_TRANSFER_HUBS,
    findRoutesServingLocation,
    findDirectRoutes,
    findTransferPoints,
    getStopOrder,
    isCorrectDirection
};
