// Distance-Based Fare Calculator for BiyaHero
// Uses actual route distance from OpenRouteService
// Implements Philippine public transportation fare logic

// Official Fare Rules
export const FARE_RULES = {
    BASE_FARE: 12,           // ₱12 minimum fare
    BASE_DISTANCE: 5,        // First 5 kilometers
    ADDITIONAL_PER_KM: 1,    // ₱1 per kilometer after 5 KM
}

// Discount Rules (Philippine Transportation Law)
export const DISCOUNT_RATES = {
    REGULAR: 0,              // No discount
    STUDENT: 0.20,           // 20% discount
    SENIOR: 0.20,            // 20% discount (Senior Citizen)
    PWD: 0.20,               // 20% discount (Person with Disability)
}

/**
 * Calculate fare based on distance
 * @param {number} distanceKm - Distance in kilometers
 * @returns {number} Regular fare in pesos
 */
export const calculateFareFromDistance = (distanceKm) => {
    if (distanceKm <= 0) return FARE_RULES.BASE_FARE

    // Base fare for first 5 KM
    if (distanceKm <= FARE_RULES.BASE_DISTANCE) {
        return FARE_RULES.BASE_FARE
    }

    // Formula: Total Fare = Minimum Fare + (Total KM of Travel - 5KM)
    // Round the distance difference to nearest whole number
    const additionalDistance = distanceKm - FARE_RULES.BASE_DISTANCE
    const additionalFare = Math.round(additionalDistance) * FARE_RULES.ADDITIONAL_PER_KM

    return FARE_RULES.BASE_FARE + additionalFare
}

/**
 * Apply discount to fare
 * @param {number} regularFare - Regular fare amount
 * @param {string} commuterType - REGULAR, STUDENT, SENIOR, PWD
 * @returns {number} Discounted fare (rounded to nearest peso)
 */
export const applyDiscount = (regularFare, commuterType = 'REGULAR') => {
    const discountRate = DISCOUNT_RATES[commuterType] || 0

    if (discountRate === 0) {
        return regularFare
    }

    // Apply discount: fare × (1 - discount rate)
    const discountedFare = regularFare * (1 - discountRate)

    // Round to nearest peso for realistic commuting behavior
    return Math.round(discountedFare)
}

/**
 * Get all fare types for a given distance
 * @param {number} distanceKm - Distance in kilometers
 * @returns {object} All fare types
 */
export const getAllFareTypes = (distanceKm) => {
    const regularFare = calculateFareFromDistance(distanceKm)

    return {
        regular: regularFare,
        student: applyDiscount(regularFare, 'STUDENT'),
        senior: applyDiscount(regularFare, 'SENIOR'),
        pwd: applyDiscount(regularFare, 'PWD'),
        distance: distanceKm
    }
}

/**
 * Get fare breakdown with savings information
 * @param {number} distanceKm - Distance in kilometers
 * @param {string} commuterType - REGULAR, STUDENT, SENIOR, PWD
 * @returns {object} Detailed fare breakdown
 */
export const getFareBreakdown = (distanceKm, commuterType = 'REGULAR') => {
    const regularFare = calculateFareFromDistance(distanceKm)
    const discountedFare = applyDiscount(regularFare, commuterType)
    const savings = regularFare - discountedFare
    const discountRate = DISCOUNT_RATES[commuterType] || 0

    return {
        distance: distanceKm,
        distanceFormatted: `${distanceKm.toFixed(1)} km`,
        regularFare,
        discountedFare,
        savings,
        discountRate: discountRate * 100, // Convert to percentage
        commuterType,
        breakdown: {
            baseFare: FARE_RULES.BASE_FARE,
            baseDistance: FARE_RULES.BASE_DISTANCE,
            additionalDistance: Math.max(0, distanceKm - FARE_RULES.BASE_DISTANCE),
            additionalFare: Math.max(0, regularFare - FARE_RULES.BASE_FARE)
        }
    }
}

/**
 * Format fare for display
 * @param {number} fare - Fare amount
 * @returns {string} Formatted fare
 */
export const formatFare = (fare) => {
    return `₱${fare}`
}

/**
 * Get commuter type icon
 * @param {string} commuterType - REGULAR, STUDENT, SENIOR, PWD
 * @returns {string} Icon emoji
 */
export const getCommuterTypeIcon = (commuterType) => {
    const icons = {
        REGULAR: '👤',
        STUDENT: '🎓',
        SENIOR: '👴',
        PWD: '♿'
    }
    return icons[commuterType] || '👤'
}

/**
 * Get commuter type label
 * @param {string} commuterType - REGULAR, STUDENT, SENIOR, PWD
 * @returns {string} Display label
 */
export const getCommuterTypeLabel = (commuterType) => {
    const labels = {
        REGULAR: 'Regular',
        STUDENT: 'Student',
        SENIOR: 'Senior Citizen',
        PWD: 'PWD'
    }
    return labels[commuterType] || 'Regular'
}

/**
 * Calculate estimated travel time based on distance
 * Assumes average speed of 30 km/h for Batangas roads
 * @param {number} distanceKm - Distance in kilometers
 * @returns {string} Estimated time
 */
export const estimateTravelTime = (distanceKm) => {
    const averageSpeedKmh = 30 // Average speed in Batangas
    const timeHours = distanceKm / averageSpeedKmh
    const timeMinutes = Math.round(timeHours * 60)

    if (timeMinutes < 60) {
        return `${timeMinutes} min`
    } else {
        const hours = Math.floor(timeMinutes / 60)
        const minutes = timeMinutes % 60
        return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`
    }
}

/**
 * Get fare examples for documentation
 * @returns {array} Example fare calculations
 */
export const getFareExamples = () => {
    const examples = [1, 3, 5, 6, 7, 10, 14, 20]

    return examples.map(km => ({
        distance: km,
        distanceFormatted: `${km} km`,
        regularFare: calculateFareFromDistance(km),
        studentFare: applyDiscount(calculateFareFromDistance(km), 'STUDENT'),
        travelTime: estimateTravelTime(km)
    }))
}

/**
 * Validate commuter type
 * @param {string} commuterType - Type to validate
 * @returns {boolean} Is valid
 */
export const isValidCommuterType = (commuterType) => {
    return ['REGULAR', 'STUDENT', 'SENIOR', 'PWD'].includes(commuterType)
}

/**
 * Get discount description
 * @param {string} commuterType - REGULAR, STUDENT, SENIOR, PWD
 * @returns {string} Discount description
 */
export const getDiscountDescription = (commuterType) => {
    const rate = DISCOUNT_RATES[commuterType] || 0

    if (rate === 0) {
        return 'No discount'
    }

    return `${rate * 100}% discount with valid ID`
}

/**
 * Calculate fare for AI assistant responses
 * @param {number} distanceKm - Distance in kilometers
 * @returns {object} Fare information for AI
 */
export const getFareForAI = (distanceKm) => {
    const fares = getAllFareTypes(distanceKm)
    const travelTime = estimateTravelTime(distanceKm)

    return {
        distance: distanceKm,
        distanceFormatted: `${distanceKm.toFixed(1)} km`,
        regularFare: fares.regular,
        studentFare: fares.student,
        seniorFare: fares.senior,
        pwdFare: fares.pwd,
        travelTime,
        fareRule: `₱${FARE_RULES.BASE_FARE} base + ₱${FARE_RULES.ADDITIONAL_PER_KM}/km after ${FARE_RULES.BASE_DISTANCE}km`
    }
}

// Export all functions
export default {
    calculateFareFromDistance,
    applyDiscount,
    getAllFareTypes,
    getFareBreakdown,
    formatFare,
    getCommuterTypeIcon,
    getCommuterTypeLabel,
    estimateTravelTime,
    getFareExamples,
    isValidCommuterType,
    getDiscountDescription,
    getFareForAI,
    FARE_RULES,
    DISCOUNT_RATES
}
