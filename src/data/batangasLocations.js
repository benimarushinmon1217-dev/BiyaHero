// Comprehensive Batangas Location Database
// Supports municipalities, landmarks, roads, establishments, and more

export const LOCATION_CATEGORIES = {
    MUNICIPALITY: 'municipality',
    LANDMARK: 'landmark',
    MALL: 'mall',
    SCHOOL: 'school',
    HOSPITAL: 'hospital',
    TERMINAL: 'terminal',
    CHURCH: 'church',
    ROAD: 'road',
    BARANGAY: 'barangay',
    ESTABLISHMENT: 'establishment',
    TOURIST_SPOT: 'tourist_spot',
    PUBLIC_OFFICE: 'public_office'
}

// Comprehensive location database for Batangas
export const BATANGAS_LOCATIONS = [
    // Major Cities/Municipalities
    { name: 'Lipa City', category: 'municipality', aliases: ['lipa', 'lipa city'], icon: '🏙️', priority: 10 },
    { name: 'Batangas City', category: 'municipality', aliases: ['batangas', 'batangas city'], icon: '🏙️', priority: 10 },
    { name: 'Tanauan City', category: 'municipality', aliases: ['tanauan'], icon: '🏙️', priority: 9 },
    { name: 'Santo Tomas', category: 'municipality', aliases: ['sto tomas', 'sto. tomas', 'santo tomas'], icon: '🏙️', priority: 8 },
    { name: 'Rosario', category: 'municipality', aliases: ['rosario batangas'], icon: '🏘️', priority: 8 },
    { name: 'San Juan', category: 'municipality', aliases: ['san juan batangas'], icon: '🏘️', priority: 8 },
    { name: 'Lemery', category: 'municipality', aliases: ['lemery batangas'], icon: '🏘️', priority: 7 },
    { name: 'Nasugbu', category: 'municipality', aliases: ['nasugbu batangas'], icon: '🏘️', priority: 7 },
    { name: 'Bauan', category: 'municipality', aliases: ['bauan batangas'], icon: '🏘️', priority: 7 },
    { name: 'Balayan', category: 'municipality', aliases: ['balayan batangas'], icon: '🏘️', priority: 7 },
    { name: 'Malvar', category: 'municipality', aliases: ['malvar batangas'], icon: '🏘️', priority: 7 },
    { name: 'Padre Garcia', category: 'municipality', aliases: ['padre garcia batangas'], icon: '🏘️', priority: 6 },
    { name: 'Taal', category: 'municipality', aliases: ['taal batangas'], icon: '🏘️', priority: 6 },
    { name: 'Cuenca', category: 'municipality', aliases: ['cuenca batangas'], icon: '🏘️', priority: 6 },
    { name: 'Ibaan', category: 'municipality', aliases: ['ibaan batangas'], icon: '🏘️', priority: 6 },
    { name: 'Taysan', category: 'municipality', aliases: ['taysan batangas'], icon: '🏘️', priority: 6 },
    { name: 'Lobo', category: 'municipality', aliases: ['lobo batangas'], icon: '🏘️', priority: 5 },
    { name: 'Mabini', category: 'municipality', aliases: ['mabini batangas'], icon: '🏘️', priority: 5 },
    { name: 'Tingloy', category: 'municipality', aliases: ['tingloy batangas'], icon: '🏘️', priority: 5 },

    // Major Malls
    { name: 'SM City Lipa', category: 'mall', aliases: ['sm lipa', 'sm city lipa', 'sm'], icon: '🛍️', priority: 10 },
    { name: 'Robinsons Place Lipa', category: 'mall', aliases: ['robinsons lipa', 'robinsons', 'robinson lipa'], icon: '🛍️', priority: 9 },
    { name: 'SM City Batangas', category: 'mall', aliases: ['sm batangas', 'sm city batangas'], icon: '🛍️', priority: 9 },
    { name: 'SM City Sto. Tomas', category: 'mall', aliases: ['sm sto tomas', 'sm santo tomas'], icon: '🛍️', priority: 8 },
    { name: 'The Outlets at Lipa', category: 'mall', aliases: ['outlets lipa', 'lipa outlets', 'outlets'], icon: '🛍️', priority: 8 },
    { name: 'Robinsons Supermarket Batangas', category: 'mall', aliases: ['robinsons batangas'], icon: '🛍️', priority: 7 },

    // Universities & Schools
    { name: 'De La Salle Lipa', category: 'school', aliases: ['dlsl', 'de la salle lipa', 'dlsu lipa', 'lasalle lipa'], icon: '🎓', priority: 9 },
    { name: 'Batangas State University', category: 'school', aliases: ['batstate', 'batstateu', 'batangas state', 'bsu'], icon: '🎓', priority: 9 },
    { name: 'FAITH Colleges', category: 'school', aliases: ['faith', 'faith colleges lipa'], icon: '🎓', priority: 8 },
    { name: 'University of Batangas', category: 'school', aliases: ['ub', 'university of batangas'], icon: '🎓', priority: 8 },
    { name: 'Lyceum of the Philippines University Batangas', category: 'school', aliases: ['lpu batangas', 'lyceum batangas'], icon: '🎓', priority: 8 },
    { name: 'Kolehiyo ng Lipa', category: 'school', aliases: ['kl', 'kolehiyo lipa'], icon: '🎓', priority: 7 },
    { name: 'Mabini Academy', category: 'school', aliases: ['mabini academy lipa'], icon: '🎓', priority: 6 },

    // Hospitals
    { name: 'Mary Mediatrix Medical Center', category: 'hospital', aliases: ['mmmc', 'mary mediatrix', 'mediatrix'], icon: '🏥', priority: 9 },
    { name: 'Metro Lipa Medical Center', category: 'hospital', aliases: ['mlmc', 'metro lipa'], icon: '🏥', priority: 8 },
    { name: 'Batangas Medical Center', category: 'hospital', aliases: ['bmc', 'batangas medical'], icon: '🏥', priority: 8 },
    { name: 'St. Patrick Hospital', category: 'hospital', aliases: ['st patrick', 'st. patrick'], icon: '🏥', priority: 7 },
    { name: 'Lipa Medix Medical Center', category: 'hospital', aliases: ['lipa medix', 'medix'], icon: '🏥', priority: 7 },

    // Transportation Terminals
    { name: 'Batangas Grand Terminal', category: 'terminal', aliases: ['grand terminal', 'batangas terminal', 'grand'], icon: '🚌', priority: 10 },
    { name: 'Batangas Port', category: 'terminal', aliases: ['batangas pier', 'port', 'pier'], icon: '⛴️', priority: 10 },
    { name: 'Lipa City Terminal', category: 'terminal', aliases: ['lipa terminal'], icon: '🚌', priority: 8 },
    { name: 'DLTB Bus Terminal Lipa', category: 'terminal', aliases: ['dltb lipa', 'dltb terminal'], icon: '🚌', priority: 7 },
    { name: 'JAM Transit Terminal', category: 'terminal', aliases: ['jam terminal', 'jam transit'], icon: '🚌', priority: 7 },

    // Churches & Religious Sites
    { name: 'Lipa Cathedral', category: 'church', aliases: ['cathedral', 'lipa cathedral', 'san sebastian cathedral'], icon: '⛪', priority: 9 },
    { name: 'Minor Basilica of San Martin de Tours', category: 'church', aliases: ['taal basilica', 'basilica taal'], icon: '⛪', priority: 8 },
    { name: 'Our Lady of Caysasay', category: 'church', aliases: ['caysasay church', 'caysasay'], icon: '⛪', priority: 7 },

    // Major Roads & Highways
    { name: 'JP Laurel Highway', category: 'road', aliases: ['jp laurel', 'laurel highway'], icon: '🛣️', priority: 8 },
    { name: 'STAR Tollway', category: 'road', aliases: ['star', 'star expressway'], icon: '🛣️', priority: 9 },
    { name: 'Ayala Highway', category: 'road', aliases: ['ayala', 'ayala road'], icon: '🛣️', priority: 7 },
    { name: 'P. Torres Street', category: 'road', aliases: ['p torres', 'torres street'], icon: '🛣️', priority: 6 },
    { name: 'Tambo Exit', category: 'road', aliases: ['tambo'], icon: '🛣️', priority: 7 },

    // Barangays (Lipa City)
    { name: 'Antipolo Del Sur', category: 'barangay', aliases: ['antipolo sur', 'antipolo del sur lipa'], icon: '📍', priority: 7 },
    { name: 'Antipolo Del Norte', category: 'barangay', aliases: ['antipolo norte', 'antipolo del norte lipa'], icon: '📍', priority: 6 },
    { name: 'Banay-Banay', category: 'barangay', aliases: ['banay banay', 'banaybanay'], icon: '📍', priority: 6 },
    { name: 'Sabang', category: 'barangay', aliases: ['sabang lipa'], icon: '📍', priority: 6 },
    { name: 'Balintawak', category: 'barangay', aliases: ['balintawak lipa'], icon: '📍', priority: 6 },
    { name: 'Marawoy', category: 'barangay', aliases: ['marawoy lipa'], icon: '📍', priority: 6 },
    { name: 'Tambo', category: 'barangay', aliases: ['tambo lipa'], icon: '📍', priority: 7 },
    { name: 'Mataas na Lupa', category: 'barangay', aliases: ['mataas na lupa lipa'], icon: '📍', priority: 6 },

    // Landmarks & Notable Places
    { name: 'Lipa City Hall', category: 'public_office', aliases: ['lipa bayan', 'city hall lipa', 'bayan'], icon: '🏛️', priority: 8 },
    { name: 'Batangas City Hall', category: 'public_office', aliases: ['batangas bayan', 'city hall batangas'], icon: '🏛️', priority: 8 },
    { name: 'Balagtas Rotonda', category: 'landmark', aliases: ['rotonda', 'balagtas'], icon: '🎯', priority: 7 },
    { name: 'Lipa Public Market', category: 'establishment', aliases: ['lipa market', 'public market'], icon: '🏪', priority: 7 },
    { name: 'Batangas City Public Market', category: 'establishment', aliases: ['batangas market'], icon: '🏪', priority: 7 },

    // Tourist Spots
    { name: 'Taal Volcano', category: 'tourist_spot', aliases: ['taal', 'volcano'], icon: '🌋', priority: 8 },
    { name: 'Mabini Dive Sites', category: 'tourist_spot', aliases: ['mabini diving', 'anilao'], icon: '🤿', priority: 7 },
    { name: 'Laiya Beach', category: 'tourist_spot', aliases: ['laiya', 'laiya san juan'], icon: '🏖️', priority: 7 },
    { name: 'Fortune Island', category: 'tourist_spot', aliases: ['fortune island nasugbu'], icon: '🏝️', priority: 6 },
    { name: 'Mt. Maculot', category: 'tourist_spot', aliases: ['maculot', 'mount maculot'], icon: '⛰️', priority: 6 },

    // Gas Stations (Major Chains)
    { name: 'Petron Lipa', category: 'establishment', aliases: ['petron'], icon: '⛽', priority: 5 },
    { name: 'Shell Lipa', category: 'establishment', aliases: ['shell'], icon: '⛽', priority: 5 },
    { name: 'Caltex Lipa', category: 'establishment', aliases: ['caltex'], icon: '⛽', priority: 5 },

    // Convenience Stores
    { name: '7-Eleven Lipa', category: 'establishment', aliases: ['7-eleven', '711', 'seven eleven'], icon: '🏪', priority: 5 },
    { name: 'Ministop Lipa', category: 'establishment', aliases: ['ministop'], icon: '🏪', priority: 5 },

    // Fast Food Chains
    { name: 'Jollibee Lipa', category: 'establishment', aliases: ['jollibee'], icon: '🍔', priority: 6 },
    { name: 'McDonald\'s Lipa', category: 'establishment', aliases: ['mcdonalds', 'mcdo'], icon: '🍔', priority: 6 },
    { name: 'KFC Lipa', category: 'establishment', aliases: ['kfc'], icon: '🍗', priority: 5 },
]

// Popular destinations for quick access
export const POPULAR_DESTINATIONS = [
    'SM City Lipa',
    'Batangas Grand Terminal',
    'Lipa Cathedral',
    'Batangas City',
    'Robinsons Place Lipa',
    'De La Salle Lipa',
    'Batangas State University',
    'Batangas Port',
    'Lipa City Hall',
    'SM City Batangas'
]

// Get category icon
export const getCategoryIcon = (category) => {
    const icons = {
        municipality: '🏙️',
        landmark: '🎯',
        mall: '🛍️',
        school: '🎓',
        hospital: '🏥',
        terminal: '🚌',
        church: '⛪',
        road: '🛣️',
        barangay: '📍',
        establishment: '🏪',
        tourist_spot: '🏖️',
        public_office: '🏛️'
    }
    return icons[category] || '📍'
}

// Get category label
export const getCategoryLabel = (category) => {
    const labels = {
        municipality: 'Municipality',
        landmark: 'Landmark',
        mall: 'Mall',
        school: 'School/University',
        hospital: 'Hospital',
        terminal: 'Terminal',
        church: 'Church',
        road: 'Road/Highway',
        barangay: 'Barangay',
        establishment: 'Establishment',
        tourist_spot: 'Tourist Spot',
        public_office: 'Public Office'
    }
    return labels[category] || 'Location'
}

// Export statistics
export const getLocationStats = () => {
    const byCategory = {}
    BATANGAS_LOCATIONS.forEach(loc => {
        byCategory[loc.category] = (byCategory[loc.category] || 0) + 1
    })

    return {
        total: BATANGAS_LOCATIONS.length,
        byCategory,
        municipalities: byCategory.municipality || 0,
        landmarks: byCategory.landmark || 0,
        malls: byCategory.mall || 0,
        schools: byCategory.school || 0
    }
}
