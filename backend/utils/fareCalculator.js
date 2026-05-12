/**
 * Fare Calculator Utility
 * Distance-based fare calculation with passenger type discounts
 */

/**
 * Base fare configuration
 */
const FARE_CONFIG = {
    baseFare: 12,           // ₱12 for first 5km
    baseDistance: 5,        // First 5 kilometers
    additionalPerKm: 1,     // ₱1 per km after 5km
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
export const calculateFare = (distanceKm, passengerType = 'regular') => {
    if (!distanceKm || distanceKm <= 0) {
        return 0;
    }

    // Calculate base fare
    let fare = FARE_CONFIG.baseFare;

    // Add additional fare for distance beyond base distance
    if (distanceKm > FARE_CONFIG.baseDistance) {
        const additionalDistance = distanceKm - FARE_CONFIG.baseDistance;
        fare += Math.round(additionalDistance) * FARE_CONFIG.additionalPerKm;
    }

    // Apply discount based on passenger type
    const discount = FARE_CONFIG.discounts[passengerType] || 0;
    if (discount > 0) {
        fare = fare * (1 - discount);
    }

    // Round to nearest peso
    return Math.round(fare);
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
export const getFareBreakdown = (distanceKm, passengerType = 'regular') => {
    const baseFare = FARE_CONFIG.baseFare;
    const additionalDistance = Math.max(0, distanceKm - FARE_CONFIG.baseDistance);
    const additionalFare = Math.round(additionalDistance) * FARE_CONFIG.additionalPerKm;
    const subtotal = baseFare + additionalFare;
    const discount = FARE_CONFIG.discounts[passengerType] || 0;
    const discountAmount = Math.round(subtotal * discount);
    const total = subtotal - discountAmount;

    return {
        distance: distanceKm,
        baseFare,
        additionalDistance: Math.round(additionalDistance),
        additionalFare,
        subtotal,
        passengerType,
        discountPercent: discount * 100,
        discountAmount,
        total
    };
};

export default {
    calculateFare,
    calculateAllFares,
    getFareBreakdown,
    FARE_CONFIG
};
