/**
 * BATANGAS PROVINCE TRANSPORTATION NETWORK
 * 
 * Comprehensive, realistic transportation intelligence for Batangas Province
 * 
 * This is NOT just a route database.
 * This is a COMMUTER BEHAVIOR SIMULATION SYSTEM.
 * 
 * Every route here represents:
 * - Actual commuter behavior
 * - Real jeepney corridors
 * - Legitimate transfer patterns
 * - Local transportation culture
 */

/**
 * MAJOR TRANSPORT HUBS - BATANGAS PROVINCE
 * These are the REAL hubs where commuters actually transfer
 */
export const BATANGAS_TRANSPORT_HUBS = {
    // LIPA CITY HUBS
    'lipa-cathedral': {
        id: 'lipa-cathedral',
        name: 'Lipa Cathedral',
        aliases: ['Lipa Bayan', 'San Sebastian Cathedral', 'Lipa City Center', 'Cathedral'],
        displayName: 'Lipa Cathedral (Main Terminal)',
        municipality: 'Lipa City',
        lat: 13.9411,
        lng: 121.1650,
        type: 'major_terminal',
        importance: 10,
        description: 'Ang pangunahing terminal ng Lipa City. Lahat ng major routes dumadaan dito.',
        commuterNote: 'Main hub ng Lipa. Dito ka mag-transfer kung galing ka sa ibang barangay papuntang mall o ibang bayan.',
        facilities: ['terminal', 'waiting_area', 'stores', 'restrooms', 'palengke'],
        operatingHours: '4:00 AM - 10:00 PM',
        transferTime: 5,
        rushHourTraffic: 'high',
        studentFriendly: true,
        crowdingLevel: {
            morning: 'very_high',
            afternoon: 'high',
            evening: 'moderate',
            lateNight: 'low'
        }
    },

    'lipa-sabang': {
        id: 'lipa-sabang',
        name: 'Lipa Sabang',
        aliases: ['Sabang Junction', 'Sabang', 'Lipa Sabang Junction'],
        displayName: 'Lipa Sabang Junction',
        municipality: 'Lipa City',
        lat: 13.9420,
        lng: 121.1670,
        type: 'major_junction',
        importance: 9,
        description: 'Major junction para sa northern Lipa routes. Common transfer point.',
        commuterNote: 'Dadaan dito yung mga jeep papuntang SM at Robinsons.',
        facilities: ['waiting_area', 'stores', 'sari-sari'],
        operatingHours: '5:00 AM - 9:00 PM',
        transferTime: 3,
        rushHourTraffic: 'moderate',
        studentFriendly: true,
        crowdingLevel: {
            morning: 'high',
            afternoon: 'moderate',
            evening: 'low'
        }
    },

    'sm-lipa': {
        id: 'sm-lipa',
        name: 'SM City Lipa',
        aliases: ['SM Lipa', 'SM', 'SM City'],
        displayName: 'SM City Lipa Terminal',
        municipality: 'Lipa City',
        lat: 13.9380,
        lng: 121.1625,
        type: 'mall_terminal',
        importance: 9,
        description: 'Major shopping mall with dedicated jeepney terminal.',
        commuterNote: 'Maraming jeep dito. Pwede ka mag-transfer papuntang iba\'t ibang lugar.',
        facilities: ['terminal', 'mall', 'food_court', 'restrooms', 'waiting_area', 'atm'],
        operatingHours: '6:00 AM - 10:00 PM',
        transferTime: 5,
        rushHourTraffic: 'high',
        studentFriendly: true,
        crowdingLevel: {
            morning: 'moderate',
            afternoon: 'very_high',
            evening: 'high',
            weekend: 'very_high'
        }
    },

    'robinsons-lipa': {
        id: 'robinsons-lipa',
        name: 'Robinsons Place Lipa',
        aliases: ['Robinsons Lipa', 'Robinsons', 'Rob Lipa'],
        displayName: 'Robinsons Place Lipa',
        municipality: 'Lipa City',
        lat: 13.9370,
        lng: 121.1640,
        type: 'mall_terminal',
        importance: 8,
        description: 'Shopping mall with jeepney stop.',
        commuterNote: 'May jeep terminal din dito pero mas maliit compared sa SM.',
        facilities: ['mall', 'food_court', 'restrooms', 'atm'],
        operatingHours: '7:00 AM - 9:00 PM',
        transferTime: 5,
        rushHourTraffic: 'moderate',
        studentFriendly: true
    },

    'bsu-lipa': {
        id: 'bsu-lipa',
        name: 'Batangas State University - Lipa',
        aliases: ['BSU Lipa', 'BatStateU Lipa', 'BSU', 'BatState'],
        displayName: 'Batangas State University (Lipa Campus)',
        municipality: 'Lipa City',
        lat: 13.9450,
        lng: 121.1680,
        type: 'school_terminal',
        importance: 8,
        description: 'University campus with high student traffic.',
        commuterNote: 'Sobrang daming estudyante dito lalo na pag pasok at uwian.',
        facilities: ['campus', 'stores', 'waiting_area'],
        operatingHours: '5:00 AM - 9:00 PM',
        transferTime: 3,
        rushHourTraffic: 'very_high',
        studentFriendly: true,
        crowdingLevel: {
            morning: 'extreme', // 7-8 AM
            afternoon: 'extreme', // 4-6 PM
            midday: 'moderate'
        }
    },

    'big-ben-lipa': {
        id: 'big-ben-lipa',
        name: 'Big Ben Terminal',
        aliases: ['Big Ben', 'Big Ben Lipa'],
        displayName: 'Big Ben Terminal',
        municipality: 'Lipa City',
        lat: 13.9420,
        lng: 121.1670,
        type: 'bus_terminal',
        importance: 8,
        description: 'Bus and UV Express terminal for provincial routes.',
        commuterNote: 'Dito yung mga bus papuntang Manila at ibang probinsya.',
        facilities: ['terminal', 'stores', 'restrooms', 'waiting_area', 'ticket_booth'],
        operatingHours: '4:00 AM - 10:00 PM',
        transferTime: 7,
        rushHourTraffic: 'high',
        studentFriendly: false
    },

    // BATANGAS CITY HUBS
    'batangas-grand-terminal': {
        id: 'batangas-grand-terminal',
        name: 'Batangas Grand Terminal',
        aliases: ['Grand Terminal', 'Batangas Terminal', 'Grand', 'Main Terminal'],
        displayName: 'Batangas City Grand Terminal',
        municipality: 'Batangas City',
        lat: 13.7565,
        lng: 121.0583,
        type: 'major_terminal',
        importance: 10,
        description: 'Main terminal ng Batangas City. Hub para sa lahat ng provincial routes.',
        commuterNote: 'Dito lahat ng bus at jeep papuntang iba\'t ibang bayan. Main hub ng Batangas.',
        facilities: ['terminal', 'stores', 'restrooms', 'waiting_area', 'ticket_booths', 'food_stalls'],
        operatingHours: '24/7',
        transferTime: 10,
        rushHourTraffic: 'very_high',
        studentFriendly: true,
        crowdingLevel: {
            morning: 'extreme',
            afternoon: 'very_high',
            evening: 'high',
            always: 'busy'
        }
    },

    'batangas-city-hall': {
        id: 'batangas-city-hall',
        name: 'Batangas City Hall',
        aliases: ['City Hall', 'Batangas Bayan'],
        displayName: 'Batangas City Hall',
        municipality: 'Batangas City',
        lat: 13.7567,
        lng: 121.0584,
        type: 'government_hub',
        importance: 7,
        description: 'Government center ng Batangas City.',
        commuterNote: 'Malapit lang sa Grand Terminal.',
        facilities: ['government_offices', 'waiting_area'],
        operatingHours: '8:00 AM - 5:00 PM',
        transferTime: 5,
        rushHourTraffic: 'moderate'
    },

    // TANAUAN CITY HUBS
    'tanauan-city-hall': {
        id: 'tanauan-city-hall',
        name: 'Tanauan City Hall',
        aliases: ['Tanauan Bayan', 'Tanauan City Center'],
        displayName: 'Tanauan City Hall',
        municipality: 'Tanauan City',
        lat: 14.0858,
        lng: 121.1500,
        type: 'major_terminal',
        importance: 8,
        description: 'Main terminal ng Tanauan City.',
        commuterNote: 'Dito yung mga jeep papuntang Lipa at Batangas City.',
        facilities: ['terminal', 'stores', 'waiting_area', 'palengke'],
        operatingHours: '5:00 AM - 9:00 PM',
        transferTime: 5,
        rushHourTraffic: 'high',
        studentFriendly: true
    },

    // ROSARIO HUBS
    'rosario-bayan': {
        id: 'rosario-bayan',
        name: 'Rosario Town Center',
        aliases: ['Rosario Bayan', 'Rosario Public Market'],
        displayName: 'Rosario Town Center',
        municipality: 'Rosario',
        lat: 13.8458,
        lng: 121.2042,
        type: 'town_terminal',
        importance: 7,
        description: 'Main terminal ng Rosario.',
        commuterNote: 'Dito yung mga jeep papuntang Lipa at San Juan.',
        facilities: ['terminal', 'palengke', 'stores', 'waiting_area'],
        operatingHours: '5:00 AM - 8:00 PM',
        transferTime: 5,
        rushHourTraffic: 'moderate',
        studentFriendly: true
    },

    // SAN JOSE HUBS
    'san-jose-bayan': {
        id: 'san-jose-bayan',
        name: 'San Jose Town Center',
        aliases: ['San Jose Bayan', 'San Jose Public Market'],
        displayName: 'San Jose Town Center',
        municipality: 'San Jose',
        lat: 13.8833,
        lng: 121.0833,
        type: 'town_terminal',
        importance: 7,
        description: 'Main terminal ng San Jose.',
        commuterNote: 'Dito yung mga jeep papuntang Batangas City at Lipa.',
        facilities: ['terminal', 'palengke', 'stores'],
        operatingHours: '5:00 AM - 8:00 PM',
        transferTime: 5,
        rushHourTraffic: 'moderate'
    },

    // PADRE GARCIA HUBS
    'padre-garcia-bayan': {
        id: 'padre-garcia-bayan',
        name: 'Padre Garcia Town Center',
        aliases: ['Padre Garcia Bayan', 'PG Bayan'],
        displayName: 'Padre Garcia Town Center',
        municipality: 'Padre Garcia',
        lat: 13.8833,
        lng: 121.2167,
        type: 'town_terminal',
        importance: 6,
        description: 'Main terminal ng Padre Garcia.',
        commuterNote: 'Dito yung mga jeep papuntang Lipa at Rosario.',
        facilities: ['terminal', 'palengke', 'stores'],
        operatingHours: '5:00 AM - 8:00 PM',
        transferTime: 5,
        rushHourTraffic: 'low'
    },

    // IBAAN HUBS
    'ibaan-bayan': {
        id: 'ibaan-bayan',
        name: 'Ibaan Town Center',
        aliases: ['Ibaan Bayan', 'Ibaan Public Market'],
        displayName: 'Ibaan Town Center',
        municipality: 'Ibaan',
        lat: 13.8167,
        lng: 121.1333,
        type: 'town_terminal',
        importance: 6,
        description: 'Main terminal ng Ibaan.',
        commuterNote: 'Dito yung mga jeep papuntang Batangas City.',
        facilities: ['terminal', 'palengke', 'stores'],
        operatingHours: '5:00 AM - 8:00 PM',
        transferTime: 5,
        rushHourTraffic: 'low'
    }
};

/**
 * ROUTE TAGS - For route classification and user guidance
 */
export const ROUTE_TAGS = {
    STUDENT_FRIENDLY: {
        id: 'student_friendly',
        label: 'Student Friendly',
        icon: '🎓',
        description: 'May student discount, malapit sa schools',
        color: 'blue'
    },
    ONE_RIDE_ONLY: {
        id: 'one_ride_only',
        label: 'One Ride Only',
        icon: '🚌',
        description: 'Walang transfer, diretso lang',
        color: 'green'
    },
    CHEAPEST: {
        id: 'cheapest',
        label: 'Cheapest Option',
        icon: '💰',
        description: 'Pinakamura sa lahat ng options',
        color: 'green'
    },
    FASTEST: {
        id: 'fastest',
        label: 'Fastest Option',
        icon: '⚡',
        description: 'Pinakamabilis na route',
        color: 'yellow'
    },
    RUSH_HOUR_PRONE: {
        id: 'rush_hour_prone',
        label: 'Rush Hour Prone',
        icon: '⏰',
        description: 'Mabagal pag rush hour',
        color: 'red'
    },
    HEAVY_WAITING: {
        id: 'heavy_waiting',
        label: 'Heavy Waiting Time',
        icon: '⏳',
        description: 'Matagal ang waiting time',
        color: 'orange'
    },
    MOST_COMFORTABLE: {
        id: 'most_comfortable',
        label: 'Most Comfortable',
        icon: '✨',
        description: 'Mas komportable, may aircon',
        color: 'purple'
    },
    RECOMMENDED_FIRST_TIME: {
        id: 'recommended_first_time',
        label: 'Recommended for First-Timers',
        icon: '👋',
        description: 'Madaling sundin, hindi ka maliligaw',
        color: 'blue'
    },
    LOCALS_FAVORITE: {
        id: 'locals_favorite',
        label: 'Locals\' Favorite',
        icon: '⭐',
        description: 'Ginagamit ng mga taga-dito',
        color: 'gold'
    },
    SCENIC_ROUTE: {
        id: 'scenic_route',
        label: 'Scenic Route',
        icon: '🌄',
        description: 'Maganda ang view',
        color: 'green'
    }
};

/**
 * COMMUTER BEHAVIOR PATTERNS
 * These define realistic commuter decision-making
 */
export const COMMUTER_BEHAVIOR = {
    RUSH_HOUR_MORNING: {
        timeRange: '6:00 AM - 9:00 AM',
        characteristics: {
            crowdingMultiplier: 2.0,
            waitTimeMultiplier: 1.5,
            preferredRoutes: ['direct', 'fastest'],
            avoidedHubs: ['sm-lipa'], // Too crowded
            studentTraffic: 'extreme'
        }
    },
    RUSH_HOUR_EVENING: {
        timeRange: '4:00 PM - 7:00 PM',
        characteristics: {
            crowdingMultiplier: 2.5,
            waitTimeMultiplier: 2.0,
            preferredRoutes: ['any_available'],
            avoidedHubs: [],
            studentTraffic: 'extreme'
        }
    },
    MIDDAY: {
        timeRange: '10:00 AM - 3:00 PM',
        characteristics: {
            crowdingMultiplier: 0.7,
            waitTimeMultiplier: 1.0,
            preferredRoutes: ['cheapest', 'comfortable'],
            studentTraffic: 'low'
        }
    },
    LATE_NIGHT: {
        timeRange: '9:00 PM - 4:00 AM',
        characteristics: {
            crowdingMultiplier: 0.3,
            waitTimeMultiplier: 3.0,
            preferredRoutes: ['tricycle_only'],
            limitedService: true,
            safetyNote: 'Limited jeepney service. Tricycle recommended.'
        }
    }
};

/**
 * ROUTE LEGITIMACY RULES
 * Rules that determine if a route is realistic
 */
export const ROUTE_LEGITIMACY_RULES = {
    // Jeepneys don't operate late night
    JEEPNEY_OPERATING_HOURS: {
        start: '5:00 AM',
        end: '9:00 PM',
        rule: 'Jeepneys rarely operate after 9 PM'
    },

    // Maximum realistic transfers
    MAX_TRANSFERS: {
        value: 2,
        rule: 'Commuters avoid routes with more than 2 transfers'
    },

    // Transfer hub legitimacy
    TRANSFER_HUB_REQUIREMENT: {
        rule: 'Transfers must happen at recognized terminals, not random points'
    },

    // Distance-based transport type
    TRANSPORT_TYPE_BY_DISTANCE: {
        tricycle: { max: 3, rule: 'Tricycles only for short distances (<3km)' },
        jeepney: { min: 1, max: 30, rule: 'Jeepneys for 1-30km' },
        bus: { min: 20, rule: 'Buses for long distance (>20km)' }
    },

    // Route corridor legitimacy
    CORRIDOR_LEGITIMACY: {
        rule: 'Route must follow known jeepney corridors, not arbitrary paths'
    }
};

export default {
    BATANGAS_TRANSPORT_HUBS,
    ROUTE_TAGS,
    COMMUTER_BEHAVIOR,
    ROUTE_LEGITIMACY_RULES
};
