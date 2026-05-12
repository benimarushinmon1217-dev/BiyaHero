/**
 * BATANGAS TRANSPORTATION KNOWLEDGE NETWORK
 * 
 * This is NOT a generic routing system.
 * This is a CURATED KNOWLEDGE BASE of actual commuter behavior in Batangas.
 * 
 * Philosophy:
 * - Routes are PREDEFINED, not calculated
 * - Transfers happen at KNOWN hubs, not arbitrary points
 * - Transport types follow ACTUAL usage patterns
 * - Combinations reflect REAL commuter decisions
 * 
 * A route exists here ONLY if:
 * - Commuters actually use it
 * - The jeepney/bus route is real
 * - The transfer point is legitimate
 * - The pattern is culturally accurate
 */

/**
 * LEGITIMATE TRANSFER HUBS
 * These are the ONLY places where transfers should happen
 * Based on actual commuter behavior and terminal locations
 */
export const LEGITIMATE_TRANSFER_HUBS = {
    // LIPA CITY HUBS
    'lipa-cathedral': {
        id: 'lipa-cathedral',
        name: 'Lipa Cathedral',
        aliases: ['Lipa Bayan', 'San Sebastian Cathedral', 'Lipa City Center'],
        displayName: 'Lipa Cathedral (Main Terminal)',
        lat: 13.9405,
        lng: 121.1655,
        type: 'major_terminal',
        importance: 10,
        description: 'Main jeepney terminal in Lipa City. ALL major routes converge here.',
        facilities: ['terminal', 'waiting_area', 'stores', 'restrooms'],
        operatingHours: '4:00 AM - 10:00 PM',
        transferTime: 5, // minutes
        isAlwaysOpen: true
    },
    'lipa-sabang': {
        id: 'lipa-sabang',
        name: 'Lipa Sabang',
        aliases: ['Sabang Junction', 'Sabang'],
        displayName: 'Lipa Sabang Junction',
        lat: 13.9420,
        lng: 121.1670,
        type: 'major_junction',
        importance: 9,
        description: 'Major junction for northern Lipa routes. Common transfer point.',
        facilities: ['waiting_area', 'stores'],
        operatingHours: '5:00 AM - 9:00 PM',
        transferTime: 3,
        isAlwaysOpen: false
    },
    'sm-lipa': {
        id: 'sm-lipa',
        name: 'SM City Lipa',
        aliases: ['SM Lipa', 'SM'],
        displayName: 'SM City Lipa Terminal',
        lat: 13.9380,
        lng: 121.1625,
        type: 'mall_terminal',
        importance: 9,
        description: 'Major shopping mall with dedicated jeepney terminal.',
        facilities: ['terminal', 'mall', 'food_court', 'restrooms', 'waiting_area'],
        operatingHours: '6:00 AM - 10:00 PM',
        transferTime: 5,
        isAlwaysOpen: false
    },
    'robinsons-lipa': {
        id: 'robinsons-lipa',
        name: 'Robinsons Place Lipa',
        aliases: ['Robinsons Lipa', 'Robinsons'],
        displayName: 'Robinsons Place Lipa',
        lat: 13.9370,
        lng: 121.1640,
        type: 'mall_terminal',
        importance: 8,
        description: 'Shopping mall with jeepney stop. Less common as transfer point.',
        facilities: ['mall', 'food_court', 'restrooms'],
        operatingHours: '7:00 AM - 9:00 PM',
        transferTime: 5,
        isAlwaysOpen: false
    },
    'big-ben-terminal': {
        id: 'big-ben-terminal',
        name: 'Big Ben Terminal',
        aliases: ['Big Ben', 'Big Ben Lipa'],
        displayName: 'Big Ben Terminal',
        lat: 13.9420,
        lng: 121.1670,
        type: 'bus_terminal',
        importance: 8,
        description: 'Bus and UV Express terminal for provincial routes.',
        facilities: ['terminal', 'stores', 'restrooms', 'waiting_area'],
        operatingHours: '4:00 AM - 10:00 PM',
        transferTime: 7,
        isAlwaysOpen: true
    },

    // BATANGAS CITY HUBS
    'batangas-grand-terminal': {
        id: 'batangas-grand-terminal',
        name: 'Batangas Grand Terminal',
        aliases: ['Grand Terminal', 'Batangas Terminal'],
        displayName: 'Batangas City Grand Terminal',
        lat: 13.7565,
        lng: 121.0583,
        type: 'major_terminal',
        importance: 10,
        description: 'Main terminal for Batangas City. Hub for all provincial routes.',
        facilities: ['terminal', 'stores', 'restrooms', 'waiting_area', 'ticket_booths'],
        operatingHours: '24/7',
        transferTime: 10,
        isAlwaysOpen: true
    }
};

/**
 * PREDEFINED JEEPNEY ROUTES
 * These are ACTUAL jeepney routes that exist in Lipa City
 * NOT calculated - these are REAL routes that commuters use
 */
export const JEEPNEY_ROUTES = {
    // LIPA CITY ROUTES
    'lipa-bayan-antipolo': {
        routeId: 'lipa-bayan-antipolo',
        routeName: 'Lipa Bayan - Antipolo',
        routeCode: 'LB-ANT',
        transportType: 'jeepney',
        operator: 'Lipa Jeepney Operators',

        // Ordered stops (route goes both ways)
        stops: [
            { name: 'Lipa Cathedral', lat: 13.9405, lng: 121.1655, isTerminal: true, isTransferHub: true },
            { name: 'Lipa City Hall', lat: 13.9411, lng: 121.1650, isTerminal: false, isTransferHub: false },
            { name: 'Lipa Sabang', lat: 13.9420, lng: 121.1670, isTerminal: false, isTransferHub: true },
            { name: 'Banay-Banay', lat: 13.9460, lng: 121.1685, isTerminal: false, isTransferHub: false },
            { name: 'Antipolo Del Norte', lat: 13.9480, lng: 121.1690, isTerminal: false, isTransferHub: false },
            { name: 'Antipolo Del Sur', lat: 13.9500, lng: 121.1700, isTerminal: true, isTransferHub: false }
        ],

        frequency: 'high', // Every 5-10 minutes
        operatingHours: '5:00 AM - 9:00 PM',
        baseFare: 12,
        farePerKm: 1,
        averageSpeed: 25, // km/h
        reliability: 9,
        crowdingLevel: 'moderate',

        // Transfer connections at hubs
        transferConnections: ['lipa-cathedral', 'lipa-sabang'],

        // Common destinations from this route
        commonDestinations: ['SM Lipa', 'Robinsons Lipa', 'BSU Lipa', 'Batangas City']
    },

    'lipa-bayan-sm': {
        routeId: 'lipa-bayan-sm',
        routeName: 'Lipa Bayan - SM Lipa',
        routeCode: 'LB-SM',
        transportType: 'jeepney',
        operator: 'Lipa Jeepney Operators',

        stops: [
            { name: 'Lipa Cathedral', lat: 13.9405, lng: 121.1655, isTerminal: true, isTransferHub: true },
            { name: 'Lipa Sabang', lat: 13.9420, lng: 121.1670, isTerminal: false, isTransferHub: true },
            { name: 'Robinsons Place Lipa', lat: 13.9370, lng: 121.1640, isTerminal: false, isTransferHub: true },
            { name: 'SM City Lipa', lat: 13.9380, lng: 121.1625, isTerminal: true, isTransferHub: true }
        ],

        frequency: 'very_high', // Every 3-5 minutes
        operatingHours: '5:00 AM - 10:00 PM',
        baseFare: 12,
        farePerKm: 1,
        averageSpeed: 25,
        reliability: 10,
        crowdingLevel: 'high',

        transferConnections: ['lipa-cathedral', 'lipa-sabang', 'sm-lipa', 'robinsons-lipa'],
        commonDestinations: ['Antipolo', 'BSU Lipa', 'Mataas na Lupa', 'Batangas City']
    },

    'lipa-bayan-bsu': {
        routeId: 'lipa-bayan-bsu',
        routeName: 'Lipa Bayan - BSU',
        routeCode: 'LB-BSU',
        transportType: 'jeepney',
        operator: 'Lipa Jeepney Operators',

        stops: [
            { name: 'Lipa Cathedral', lat: 13.9405, lng: 121.1655, isTerminal: true, isTransferHub: true },
            { name: 'Lipa City Hall', lat: 13.9411, lng: 121.1650, isTerminal: false, isTransferHub: false },
            { name: 'Batangas State University', lat: 13.9450, lng: 121.1680, isTerminal: true, isTransferHub: false },
            { name: 'Big Ben Terminal', lat: 13.9420, lng: 121.1670, isTerminal: false, isTransferHub: true }
        ],

        frequency: 'high',
        operatingHours: '5:00 AM - 9:00 PM',
        baseFare: 12,
        farePerKm: 1,
        averageSpeed: 25,
        reliability: 9,
        crowdingLevel: 'high', // Very crowded during school hours

        transferConnections: ['lipa-cathedral', 'big-ben-terminal'],
        commonDestinations: ['SM Lipa', 'Antipolo', 'Batangas City']
    },

    'lipa-bayan-mataas-na-lupa': {
        routeId: 'lipa-bayan-mataas-na-lupa',
        routeName: 'Lipa Bayan - Mataas na Lupa',
        routeCode: 'LB-MNL',
        transportType: 'jeepney',
        operator: 'Lipa Jeepney Operators',

        stops: [
            { name: 'Lipa Cathedral', lat: 13.9405, lng: 121.1655, isTerminal: true, isTransferHub: true },
            { name: 'Lipa Sabang', lat: 13.9420, lng: 121.1670, isTerminal: false, isTransferHub: true },
            { name: 'Mataas na Lupa', lat: 13.9550, lng: 121.1750, isTerminal: true, isTransferHub: false }
        ],

        frequency: 'medium',
        operatingHours: '5:30 AM - 8:00 PM',
        baseFare: 12,
        farePerKm: 1,
        averageSpeed: 25,
        reliability: 8,
        crowdingLevel: 'low',

        transferConnections: ['lipa-cathedral', 'lipa-sabang'],
        commonDestinations: ['SM Lipa', 'Batangas City']
    }
};

/**
 * PREDEFINED COMMUTER PATTERNS
 * These are ACTUAL multi-segment routes that commuters commonly use
 * NOT calculated - these are KNOWN commuter behaviors
 */
export const COMMUTER_PATTERNS = [
    {
        patternId: 'antipolo-to-sm',
        origin: 'Antipolo Del Sur',
        destination: 'SM City Lipa',
        description: 'Antipolo residents going to SM Lipa',

        // This is THE way commuters actually do this route
        segments: [
            {
                segmentOrder: 1,
                route: 'lipa-bayan-antipolo',
                from: 'Antipolo Del Sur',
                to: 'Lipa Cathedral',
                transportType: 'jeepney',
                instruction: 'Take "Lipa Bayan - Antipolo" jeepney to Lipa Cathedral',
                transferAt: 'Lipa Cathedral'
            },
            {
                segmentOrder: 2,
                route: 'lipa-bayan-sm',
                from: 'Lipa Cathedral',
                to: 'SM City Lipa',
                transportType: 'jeepney',
                instruction: 'At Lipa Cathedral, take "Lipa Bayan - SM" jeepney to SM Lipa',
                viaStops: ['Lipa Sabang'] // Route passes through Sabang
            }
        ],

        totalTransfers: 1,
        transferHubs: ['lipa-cathedral'],
        reliability: 10,
        commonUsage: 'very_high',
        commuterNotes: 'Most common route. Lipa Cathedral is the main transfer point for all Lipa routes.',
        estimatedTotalTime: 25, // minutes
        peakHours: ['7:00-9:00 AM', '5:00-7:00 PM']
    },

    {
        patternId: 'antipolo-to-robinsons',
        origin: 'Antipolo Del Sur',
        destination: 'Robinsons Place Lipa',
        description: 'Antipolo to Robinsons via Cathedral',

        segments: [
            {
                segmentOrder: 1,
                route: 'lipa-bayan-antipolo',
                from: 'Antipolo Del Sur',
                to: 'Lipa Cathedral',
                transportType: 'jeepney',
                instruction: 'Take "Lipa Bayan - Antipolo" jeepney to Lipa Cathedral',
                transferAt: 'Lipa Cathedral'
            },
            {
                segmentOrder: 2,
                route: 'lipa-bayan-sm',
                from: 'Lipa Cathedral',
                to: 'Robinsons Place Lipa',
                transportType: 'jeepney',
                instruction: 'At Lipa Cathedral, take "Lipa Bayan - SM" jeepney, get off at Robinsons'
            }
        ],

        totalTransfers: 1,
        transferHubs: ['lipa-cathedral'],
        reliability: 9,
        commonUsage: 'high',
        commuterNotes: 'Same route as going to SM, just get off earlier at Robinsons.',
        estimatedTotalTime: 20
    },

    {
        patternId: 'sm-to-bsu',
        origin: 'SM City Lipa',
        destination: 'Batangas State University',
        description: 'SM Lipa to BSU via Cathedral',

        segments: [
            {
                segmentOrder: 1,
                route: 'lipa-bayan-sm',
                from: 'SM City Lipa',
                to: 'Lipa Cathedral',
                transportType: 'jeepney',
                instruction: 'Take "Lipa Bayan - SM" jeepney back to Lipa Cathedral',
                transferAt: 'Lipa Cathedral'
            },
            {
                segmentOrder: 2,
                route: 'lipa-bayan-bsu',
                from: 'Lipa Cathedral',
                to: 'Batangas State University',
                transportType: 'jeepney',
                instruction: 'At Lipa Cathedral, take "Lipa Bayan - BSU" jeepney to BSU'
            }
        ],

        totalTransfers: 1,
        transferHubs: ['lipa-cathedral'],
        reliability: 9,
        commonUsage: 'high',
        commuterNotes: 'Very crowded during school hours (7-8 AM, 4-6 PM).',
        estimatedTotalTime: 20,
        peakHours: ['7:00-8:00 AM', '4:00-6:00 PM']
    }
];

/**
 * INVALID ROUTE PATTERNS
 * These are routes that might be geometrically possible but are NOT used by actual commuters
 * The system should NEVER generate these
 */
export const INVALID_PATTERNS = [
    {
        pattern: 'Antipolo -> Robinsons -> SM via tricycle',
        reason: 'Tricycles are not used for this corridor. Jeepneys are the standard.',
        correctPattern: 'Antipolo -> Lipa Cathedral -> SM via jeepney'
    },
    {
        pattern: 'Any route that skips Lipa Cathedral when transferring',
        reason: 'Lipa Cathedral is the main hub. All transfers go through here.',
        correctPattern: 'Always transfer at Lipa Cathedral for cross-route connections'
    },
    {
        pattern: 'Direct tricycle from barangay to mall',
        reason: 'Tricycles are for last-mile only, not main transport.',
        correctPattern: 'Jeepney to hub, then jeepney to destination'
    },
    {
        pattern: 'Walking between malls as a route segment',
        reason: 'Too far to walk. Commuters take jeepney.',
        correctPattern: 'Jeepney between all major points'
    }
];

/**
 * TRANSPORT TYPE USAGE RULES
 * When each transport type is actually used by commuters
 */
export const TRANSPORT_USAGE_RULES = {
    jeepney: {
        primaryUse: 'Main transportation within and between cities',
        typicalDistance: '1-20 km',
        typicalRoutes: 'Terminal to terminal, hub to hub',
        whenUsed: 'Always the first choice for main routes',
        whenNotUsed: 'Very short distances (<500m), very late night'
    },
    tricycle: {
        primaryUse: 'Last-mile transportation, short distances',
        typicalDistance: '0.5-3 km',
        typicalRoutes: 'Home to terminal, terminal to specific address',
        whenUsed: 'When jeepney doesn\'t go to exact destination, late night, heavy luggage',
        whenNotUsed: 'Long distances, when jeepney route exists'
    },
    bus: {
        primaryUse: 'Inter-city and provincial routes',
        typicalDistance: '20-100 km',
        typicalRoutes: 'City to city, province to province',
        whenUsed: 'Lipa to Batangas City, Lipa to Manila',
        whenNotUsed: 'Within city limits'
    },
    uv_express: {
        primaryUse: 'Fast inter-city routes',
        typicalDistance: '20-50 km',
        typicalRoutes: 'City to city express',
        whenUsed: 'When speed is priority, willing to pay more',
        whenNotUsed: 'Short distances, budget travel'
    },
    walking: {
        primaryUse: 'Very short distances',
        typicalDistance: '0-0.5 km',
        typicalRoutes: 'Within terminal, nearby locations',
        whenUsed: 'Terminal to nearby store, between very close points',
        whenNotUsed: 'Anything over 500 meters'
    }
};

/**
 * Find a predefined commuter pattern
 */
export const findCommuterPattern = (originName, destinationName) => {
    const normalizeLocation = (name) => name.toLowerCase().trim();
    const origin = normalizeLocation(originName);
    const destination = normalizeLocation(destinationName);

    return COMMUTER_PATTERNS.find(pattern => {
        const patternOrigin = normalizeLocation(pattern.origin);
        const patternDest = normalizeLocation(pattern.destination);

        return (
            (patternOrigin.includes(origin) || origin.includes(patternOrigin)) &&
            (patternDest.includes(destination) || destination.includes(patternDest))
        );
    });
};

/**
 * Find which jeepney routes serve a location
 */
export const findRoutesServingLocation = (locationName) => {
    const normalized = locationName.toLowerCase().trim();
    const routes = [];

    for (const [routeId, route] of Object.entries(JEEPNEY_ROUTES)) {
        const servesLocation = route.stops.some(stop =>
            stop.name.toLowerCase().includes(normalized) ||
            normalized.includes(stop.name.toLowerCase())
        );

        if (servesLocation) {
            routes.push(route);
        }
    }

    return routes;
};

/**
 * Find legitimate transfer hubs between two routes
 */
export const findLegitimateTransferHub = (route1Id, route2Id) => {
    const route1 = JEEPNEY_ROUTES[route1Id];
    const route2 = JEEPNEY_ROUTES[route2Id];

    if (!route1 || !route2) return null;

    // Find common stops that are transfer hubs
    const commonHubs = route1.stops.filter(stop1 =>
        stop1.isTransferHub &&
        route2.stops.some(stop2 =>
            stop2.isTransferHub &&
            stop1.name === stop2.name
        )
    );

    // Return the most important hub
    if (commonHubs.length > 0) {
        const hubName = commonHubs[0].name;
        return Object.values(LEGITIMATE_TRANSFER_HUBS).find(hub =>
            hub.name === hubName ||
            hub.aliases.includes(hubName)
        );
    }

    return null;
};

/**
 * Validate if a route combination is realistic
 */
export const isRealisticRouteCombination = (segments) => {
    // Check if all transfers happen at legitimate hubs
    for (let i = 0; i < segments.length - 1; i++) {
        const transferPoint = segments[i].to;
        const isLegitimateHub = Object.values(LEGITIMATE_TRANSFER_HUBS).some(hub =>
            hub.name === transferPoint ||
            hub.aliases.includes(transferPoint)
        );

        if (!isLegitimateHub) {
            return {
                valid: false,
                reason: `Transfer at ${transferPoint} is not a legitimate transfer hub`
            };
        }
    }

    // Check if transport types are realistic
    for (const segment of segments) {
        if (segment.transportType === 'tricycle' && segment.distance > 3) {
            return {
                valid: false,
                reason: 'Tricycle used for long distance (>3km) - unrealistic'
            };
        }
    }

    return { valid: true };
};

export default {
    LEGITIMATE_TRANSFER_HUBS,
    JEEPNEY_ROUTES,
    COMMUTER_PATTERNS,
    INVALID_PATTERNS,
    TRANSPORT_USAGE_RULES,
    findCommuterPattern,
    findRoutesServingLocation,
    findLegitimateTransferHub,
    isRealisticRouteCombination
};
