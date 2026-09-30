/**
 * Fare Calculator Utility
 * Distance-based fare calculation with passenger type discounts
 */

/**
 * Base fare configuration
 */
const FARE_CONFIG = {
    baseFare: 15,           // ₱15 regular fare for the first 5km
    baseDistance: 5,        // First 5 kilometers
    additionalPerKm: 1,     // ₱1 per km after 5km
    minimumFares: {
        regular: 15,
        student: 12,
        senior: 12,
        pwd: 12
    },
    discounts: {
        regular: 0,           // 0% discount
        student: 0.20,        // 20% discount
        senior: 0.20,         // 20% discount
        pwd: 0.20             // 20% discount
    }
};

/**
 * Calculate fare from distance
 * @param {number} distanceKm - Distance in kilometers
 * @param {string} passengerType - Passenger type (regular, student, senior, pwd)
 * @returns {number} Calculated fare in PHP
 */
export const calculateFare = (
    distanceKm,
    passengerType = 'regular',
    baseFare = FARE_CONFIG.baseFare,
    ratePerKm = FARE_CONFIG.additionalPerKm,
    baseDistance = FARE_CONFIG.baseDistance
) => {
    if (!distanceKm || distanceKm <= 0) {
        return 0;
    }

    // Calculate base fare
    let fare = Math.max(Number(baseFare), FARE_CONFIG.baseFare);

    // Add additional fare for distance beyond base distance
    if (distanceKm > baseDistance) {
        const additionalDistance = distanceKm - baseDistance;
        fare += Math.ceil(additionalDistance) * Number(ratePerKm);
    }

    // Apply discount based on passenger type
    const discount = FARE_CONFIG.discounts[passengerType] || 0;
    if (discount > 0) {
        fare = fare * (1 - discount);
    }

    // Round to nearest peso
    const minimumFare = FARE_CONFIG.minimumFares[passengerType] || FARE_CONFIG.minimumFares.regular;
    return Math.max(minimumFare, Math.round(fare));
};

/**
 * Calculate all fare types for a distance
 * @param {number} distanceKm - Distance in kilometers
 * @returns {Object} Fares for all passenger types
 */
export const calculateAllFares = (distanceKm) => {
    return {
        regular: calculateFare(distanceKm, 'regular'),
        student: calculateFare(distanceKm, 'student'),
        senior: calculateFare(distanceKm, 'senior'),
        pwd: calculateFare(distanceKm, 'pwd')
    };
};

/**
 * Get fare breakdown with details
 * @param {number} distanceKm - Distance in kilometers
 * @param {string} passengerType - Passenger type
 * @returns {Object} Detailed fare breakdown
 */
export const getFareBreakdown = (
    distanceKm,
    passengerType = 'regular',
    { baseFare = FARE_CONFIG.baseFare, ratePerKm = FARE_CONFIG.additionalPerKm, baseDistance = FARE_CONFIG.baseDistance } = {}
) => {
    const additionalDistance = Math.max(0, distanceKm - baseDistance);
    const effectiveBaseFare = Math.max(Number(baseFare), FARE_CONFIG.baseFare);
    const additionalFare = Math.ceil(additionalDistance) * ratePerKm;
    const subtotal = effectiveBaseFare + additionalFare;
    const discount = FARE_CONFIG.discounts[passengerType] || 0;
    const discountAmount = Math.round(subtotal * discount);
    const total = calculateFare(distanceKm, passengerType, effectiveBaseFare, ratePerKm, baseDistance);

    return {
        distance: distanceKm,
        baseFare: effectiveBaseFare,
        additionalDistance: Math.ceil(additionalDistance),
        additionalFare,
        subtotal,
        passengerType,
        discountPercent: discount * 100,
        discountAmount,
        total,
        ratePerKm
    };
};

export const calculateSegmentFare = (distanceKm, passengerType = 'regular', transportType = 'jeepney') => {
    const fare = getFareBreakdown(distanceKm, passengerType);
    return { ...fare, transportType, segmentCount: 1 };
};

export default {
    calculateFare,
    calculateAllFares,
    getFareBreakdown,
    calculateSegmentFare,
    FARE_CONFIG
};
