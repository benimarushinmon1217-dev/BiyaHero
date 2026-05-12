/**
 * BATANGAS JEEPNEY ROUTES - EXPANDED
 * 
 * Comprehensive jeepney route database for Batangas Province
 * Each route represents ACTUAL jeepney corridors that exist
 * 
 * Route Realism Criteria:
 * - Route actually exists
 * - Commuters actually use it
 * - Stops are in correct order
 * - Operating hours are realistic
 * - Fares match actual rates
 */

export const BATANGAS_JEEPNEY_ROUTES = {
    // ========================================
    // LIPA CITY ROUTES
    // ========================================

    'lipa-bayan-antipolo': {
        routeId: 'lipa-bayan-antipolo',
        routeName: 'Lipa Bayan - Antipolo',
        routeCode: 'LB-ANT',
        transportType: 'jeepney',
        municipality: 'Lipa City',

        stops: [
            { name: 'Lipa Cathedral', lat: 13.9405, lng: 121.1655, isTerminal: true, isTransferHub: true },
            { name: 'Lipa City Hall', lat: 13.9411, lng: 121.1650, isTerminal: false },
            { name: 'Lipa Sabang', lat: 13.9420, lng: 121.1670, isTerminal: false, isTransferHub: true },
            { name: 'Banay-Banay', lat: 13.9460, lng: 121.1685, isTerminal: false },
            { name: 'Antipolo Del Norte', lat: 13.9480, lng: 121.1690, isTerminal: false },
            { name: 'Antipolo Del Sur', lat: 13.9500, lng: 121.1700, isTerminal: true }
        ],

        frequency: 'high',
        frequencyMinutes: 7,
        operatingHours: '5:00 AM - 9:00 PM',
        baseFare: 12,
        farePerKm: 1,
        averageSpeed: 25,
        reliability: 9,
        crowdingLevel: 'moderate',

        commuterNotes: 'Mabilis ang byahe. Madalas may sakay lalo na pag umaga at hapon.',
        driverBehavior: 'Minsan hindi na dumarating hanggang dulo pag konti na lang pasahero.',
        peakHours: ['7:00-9:00 AM', '5:00-7:00 PM'],

        tags: ['student_friendly', 'locals_favorite'],
        studentFriendly: true,
        seniorFriendly: true
    },

    'lipa-bayan-sm': {
        routeId: 'lipa-bayan-sm',
        routeName: 'Lipa Bayan - SM Lipa',
        routeCode: 'LB-SM',
        transportType: 'jeepney',
        municipality: 'Lipa City',

        stops: [
            { name: 'Lipa Cathedral', lat: 13.9405, lng: 121.1655, isTerminal: true, isTransferHub: true },
            { name: 'Lipa Sabang', lat: 13.9420, lng: 121.1670, isTerminal: false, isTransferHub: true },
            { name: 'Robinsons Place Lipa', lat: 13.9370, lng: 121.1640, isTerminal: false, isTransferHub: true },
            { name: 'SM City Lipa', lat: 13.9380, lng: 121.1625, isTerminal: true, isTransferHub: true }
        ],

        frequency: 'very_high',
        frequencyMinutes: 4,
        operatingHours: '5:00 AM - 10:00 PM',
        baseFare: 12,
        farePerKm: 1,
        averageSpeed: 25,
        reliability: 10,
        crowdingLevel: 'high',

        commuterNotes: 'Pinakamadalas na route. Laging may jeep. Pero sobrang daming tao pag weekend.',
        driverBehavior: 'Mabilis mag-drive. Minsan puno na pero sumasakay pa rin.',
        peakHours: ['10:00 AM - 8:00 PM (weekends)', '5:00-7:00 PM (weekdays)'],

        tags: ['one_ride_only', 'locals_favorite', 'recommended_first_time'],
        studentFriendly: true,
        seniorFriendly: true
    },

    'lipa-bayan-bsu': {
        routeId: 'lipa-bayan-bsu',
        routeName: 'Lipa Bayan - BSU',
        routeCode: 'LB-BSU',
        transportType: 'jeepney',
        municipality: 'Lipa City',

        stops: [
            { name: 'Lipa Cathedral', lat: 13.9405, lng: 121.1655, isTerminal: true, isTransferHub: true },
            { name: 'Lipa City Hall', lat: 13.9411, lng: 121.1650, isTerminal: false },
            { name: 'Batangas State University', lat: 13.9450, lng: 121.1680, isTerminal: true, isTransferHub: true },
            { name: 'Big Ben Terminal', lat: 13.9420, lng: 121.1670, isTerminal: false, isTransferHub: true }
        ],

        frequency: 'high',
        frequencyMinutes: 6,
        operatingHours: '5:00 AM - 9:00 PM',
        baseFare: 12,
        farePerKm: 1,
        averageSpeed: 25,
        reliability: 9,
        crowdingLevel: 'extreme',

        commuterNotes: 'Sobrang daming estudyante. Pag 7-8 AM at 4-6 PM, punuan talaga.',
        driverBehavior: 'Mabilis mag-drive pag rush hour para makabalik agad.',
        peakHours: ['7:00-8:00 AM', '4:00-6:00 PM'],

        tags: ['student_friendly', 'rush_hour_prone', 'heavy_waiting'],
        studentFriendly: true,
        seniorFriendly: false // Too crowded
    },

    'lipa-bayan-mataas-na-lupa': {
        routeId: 'lipa-bayan-mataas-na-lupa',
        routeName: 'Lipa Bayan - Mataas na Lupa',
        routeCode: 'LB-MNL',
        transportType: 'jeepney',
        municipality: 'Lipa City',

        stops: [
            { name: 'Lipa Cathedral', lat: 13.9405, lng: 121.1655, isTerminal: true, isTransferHub: true },
            { name: 'Lipa Sabang', lat: 13.9420, lng: 121.1670, isTerminal: false, isTransferHub: true },
            { name: 'Mataas na Lupa', lat: 13.9550, lng: 121.1750, isTerminal: true }
        ],

        frequency: 'medium',
        frequencyMinutes: 12,
        operatingHours: '5:30 AM - 8:00 PM',
        baseFare: 12,
        farePerKm: 1,
        averageSpeed: 25,
        reliability: 8,
        crowdingLevel: 'low',

        commuterNotes: 'Hindi masyadong madalas. Minsan matagal ang hintay.',
        driverBehavior: 'Hinihintay muna na mapuno bago umalis.',
        peakHours: ['7:00-8:00 AM', '5:00-6:00 PM'],

        tags: ['heavy_waiting'],
        studentFriendly: true,
        seniorFriendly: true
    },

    // ========================================
    // LIPA - BATANGAS CITY ROUTES
    // ========================================

    'lipa-batangas-city': {
        routeId: 'lipa-batangas-city',
        routeName: 'Lipa - Batangas City',
        routeCode: 'LP-BC',
        transportType: 'bus',
        municipality: 'Inter-City',

        stops: [
            { name: 'Big Ben Terminal', lat: 13.9420, lng: 121.1670, isTerminal: true, isTransferHub: true },
            { name: 'Batangas Grand Terminal', lat: 13.7565, lng: 121.0583, isTerminal: true, isTransferHub: true }
        ],

        frequency: 'high',
        frequencyMinutes: 15,
        operatingHours: '5:00 AM - 9:00 PM',
        baseFare: 45,
        farePerKm: 2,
        averageSpeed: 50,
        reliability: 9,
        crowdingLevel: 'moderate',

        commuterNotes: 'Mabilis ang byahe via STAR Tollway. Mga 45 minutes lang.',
        driverBehavior: 'Aircon bus. Komportable ang byahe.',
        peakHours: ['6:00-9:00 AM', '4:00-7:00 PM'],

        tags: ['most_comfortable', 'fastest', 'recommended_first_time'],
        studentFriendly: true,
        seniorFriendly: true
    },

    // ========================================
    // TANAUAN ROUTES
    // ========================================

    'tanauan-lipa': {
        routeId: 'tanauan-lipa',
        routeName: 'Tanauan - Lipa',
        routeCode: 'TN-LP',
        transportType: 'jeepney',
        municipality: 'Inter-City',

        stops: [
            { name: 'Tanauan City Hall', lat: 14.0858, lng: 121.1500, isTerminal: true, isTransferHub: true },
            { name: 'Lipa Cathedral', lat: 13.9405, lng: 121.1655, isTerminal: true, isTransferHub: true }
        ],

        frequency: 'high',
        frequencyMinutes: 10,
        operatingHours: '5:00 AM - 8:00 PM',
        baseFare: 25,
        farePerKm: 1.5,
        averageSpeed: 40,
        reliability: 8,
        crowdingLevel: 'moderate',

        commuterNotes: 'Diretso lang via JP Laurel Highway. Mga 30-40 minutes.',
        driverBehavior: 'Mabilis ang takbo. Minsan hindi na dumarating sa loob ng Lipa, sa highway lang.',
        peakHours: ['6:00-8:00 AM', '5:00-7:00 PM'],

        tags: ['one_ride_only', 'locals_favorite'],
        studentFriendly: true,
        seniorFriendly: true
    },

    'tanauan-sm-lipa': {
        routeId: 'tanauan-sm-lipa',
        routeName: 'Tanauan - SM Lipa',
        routeCode: 'TN-SM',
        transportType: 'jeepney',
        municipality: 'Inter-City',

        stops: [
            { name: 'Tanauan City Hall', lat: 14.0858, lng: 121.1500, isTerminal: true, isTransferHub: true },
            { name: 'SM City Lipa', lat: 13.9380, lng: 121.1625, isTerminal: true, isTransferHub: true }
        ],

        frequency: 'medium',
        frequencyMinutes: 15,
        operatingHours: '6:00 AM - 8:00 PM',
        baseFare: 30,
        farePerKm: 1.5,
        averageSpeed: 40,
        reliability: 8,
        crowdingLevel: 'moderate',

        commuterNotes: 'Diretso sa SM. Hindi na dumadaan sa Bayan ng Lipa.',
        driverBehavior: 'Mabilis. Pag punuan na, diretso na.',
        peakHours: ['10:00 AM - 6:00 PM (weekends)'],

        tags: ['one_ride_only', 'fastest'],
        studentFriendly: true,
        seniorFriendly: true
    },

    // ========================================
    // ROSARIO ROUTES
    // ========================================

    'rosario-lipa': {
        routeId: 'rosario-lipa',
        routeName: 'Rosario - Lipa',
        routeCode: 'RS-LP',
        transportType: 'jeepney',
        municipality: 'Inter-City',

        stops: [
            { name: 'Rosario Town Center', lat: 13.8458, lng: 121.2042, isTerminal: true, isTransferHub: true },
            { name: 'Lipa Cathedral', lat: 13.9405, lng: 121.1655, isTerminal: true, isTransferHub: true }
        ],

        frequency: 'high',
        frequencyMinutes: 10,
        operatingHours: '5:00 AM - 8:00 PM',
        baseFare: 20,
        farePerKm: 1.5,
        averageSpeed: 35,
        reliability: 9,
        crowdingLevel: 'moderate',

        commuterNotes: 'Common route. Madalas may jeep. Mga 25-30 minutes ang byahe.',
        driverBehavior: 'Normal speed. Minsan sumasakay pa sa daan.',
        peakHours: ['6:00-8:00 AM', '5:00-7:00 PM'],

        tags: ['one_ride_only', 'locals_favorite', 'recommended_first_time'],
        studentFriendly: true,
        seniorFriendly: true
    },

    'rosario-sm-lipa': {
        routeId: 'rosario-sm-lipa',
        routeName: 'Rosario - SM Lipa',
        routeCode: 'RS-SM',
        transportType: 'jeepney',
        municipality: 'Inter-City',

        stops: [
            { name: 'Rosario Town Center', lat: 13.8458, lng: 121.2042, isTerminal: true, isTransferHub: true },
            { name: 'SM City Lipa', lat: 13.9380, lng: 121.1625, isTerminal: true, isTransferHub: true }
        ],

        frequency: 'medium',
        frequencyMinutes: 15,
        operatingHours: '6:00 AM - 8:00 PM',
        baseFare: 25,
        farePerKm: 1.5,
        averageSpeed: 35,
        reliability: 8,
        crowdingLevel: 'moderate',

        commuterNotes: 'Diretso sa SM. Mas mabilis kesa dumaan pa sa Bayan.',
        driverBehavior: 'Mabilis. Pag weekend, punuan.',
        peakHours: ['10:00 AM - 6:00 PM (weekends)'],

        tags: ['one_ride_only', 'fastest'],
        studentFriendly: true,
        seniorFriendly: true
    },

    // ========================================
    // PADRE GARCIA ROUTES
    // ========================================

    'padre-garcia-lipa': {
        routeId: 'padre-garcia-lipa',
        routeName: 'Padre Garcia - Lipa',
        routeCode: 'PG-LP',
        transportType: 'jeepney',
        municipality: 'Inter-City',

        stops: [
            { name: 'Padre Garcia Town Center', lat: 13.8833, lng: 121.2167, isTerminal: true, isTransferHub: true },
            { name: 'Rosario Town Center', lat: 13.8458, lng: 121.2042, isTerminal: false, isTransferHub: true },
            { name: 'Lipa Cathedral', lat: 13.9405, lng: 121.1655, isTerminal: true, isTransferHub: true }
        ],

        frequency: 'medium',
        frequencyMinutes: 15,
        operatingHours: '5:30 AM - 7:00 PM',
        baseFare: 25,
        farePerKm: 1.5,
        averageSpeed: 35,
        reliability: 7,
        crowdingLevel: 'low',

        commuterNotes: 'Dumadaan sa Rosario. Pwede bumaba doon kung gusto.',
        driverBehavior: 'Mahinahon ang drive. Minsan matagal sa terminal.',
        peakHours: ['6:00-7:00 AM', '5:00-6:00 PM'],

        tags: ['heavy_waiting'],
        studentFriendly: true,
        seniorFriendly: true
    },

    // ========================================
    // IBAAN ROUTES
    // ========================================

    'ibaan-batangas-city': {
        routeId: 'ibaan-batangas-city',
        routeName: 'Ibaan - Batangas City',
        routeCode: 'IB-BC',
        transportType: 'jeepney',
        municipality: 'Inter-City',

        stops: [
            { name: 'Ibaan Town Center', lat: 13.8167, lng: 121.1333, isTerminal: true, isTransferHub: true },
            { name: 'Batangas Grand Terminal', lat: 13.7565, lng: 121.0583, isTerminal: true, isTransferHub: true }
        ],

        frequency: 'medium',
        frequencyMinutes: 15,
        operatingHours: '5:00 AM - 7:00 PM',
        baseFare: 20,
        farePerKm: 1.5,
        averageSpeed: 35,
        reliability: 8,
        crowdingLevel: 'low',

        commuterNotes: 'Diretso sa Grand Terminal. Mga 30 minutes.',
        driverBehavior: 'Normal speed. Minsan matagal sa terminal.',
        peakHours: ['6:00-8:00 AM', '5:00-7:00 PM'],

        tags: ['one_ride_only'],
        studentFriendly: true,
        seniorFriendly: true
    },

    // ========================================
    // BATANGAS CITY INTERNAL ROUTES
    // ========================================

    'batangas-city-circuit': {
        routeId: 'batangas-city-circuit',
        routeName: 'Batangas City Circuit',
        routeCode: 'BC-CIR',
        transportType: 'jeepney',
        municipality: 'Batangas City',

        stops: [
            { name: 'Batangas Grand Terminal', lat: 13.7565, lng: 121.0583, isTerminal: true, isTransferHub: true },
            { name: 'Batangas City Hall', lat: 13.7567, lng: 121.0584, isTerminal: false, isTransferHub: true },
            { name: 'Batangas Grand Terminal', lat: 13.7565, lng: 121.0583, isTerminal: true, isTransferHub: true }
        ],

        frequency: 'very_high',
        frequencyMinutes: 5,
        operatingHours: '5:00 AM - 10:00 PM',
        baseFare: 10,
        farePerKm: 1,
        averageSpeed: 20,
        reliability: 10,
        crowdingLevel: 'high',

        commuterNotes: 'Paikot-ikot lang sa city. Mabilis lang.',
        driverBehavior: 'Mabilis. Laging may jeep.',
        peakHours: ['7:00-9:00 AM', '5:00-7:00 PM'],

        tags: ['one_ride_only', 'locals_favorite', 'cheapest'],
        studentFriendly: true,
        seniorFriendly: true
    }
};

/**
 * Get all routes serving a specific municipality
 */
export const getRoutesByMunicipality = (municipality) => {
    return Object.values(BATANGAS_JEEPNEY_ROUTES).filter(route =>
        route.municipality === municipality ||
        route.municipality === 'Inter-City'
    );
};

/**
 * Get routes by tag
 */
export const getRoutesByTag = (tag) => {
    return Object.values(BATANGAS_JEEPNEY_ROUTES).filter(route =>
        route.tags && route.tags.includes(tag)
    );
};

/**
 * Check if route operates at specific time
 */
export const isRouteOperating = (routeId, time) => {
    const route = BATANGAS_JEEPNEY_ROUTES[routeId];
    if (!route) return false;

    // Parse operating hours and check if time is within range
    // Simplified check - in production, use proper time parsing
    return true; // Placeholder
};

export default {
    BATANGAS_JEEPNEY_ROUTES,
    getRoutesByMunicipality,
    getRoutesByTag,
    isRouteOperating
};
