/**
 * Multi-Modal Route Service
 * Calls backend API for realistic multi-modal routing
 */

import apiClient from '../api/axios';

/**
 * Get multiple route options from backend
 * @param {Object} origin - Origin place object {name, lat, lng}
 * @param {Object} destination - Destination place object {name, lat, lng}
 * @param {string} passengerType - regular, student, senior, pwd
 * @param {string} preference - cheapest, fastest, least_transfers, recommended
 * @returns {Promise<Object>} Route options response
 */
export const getMultiModalRoutes = async (origin, destination, passengerType = 'regular', preference = 'recommended') => {
    try {
        const response = await apiClient.post('/routes/multi-modal', {
            origin: {
                name: origin.name,
                lat: parseFloat(origin.lat),
                lng: parseFloat(origin.lng)
            },
            destination: {
                name: destination.name,
                lat: parseFloat(destination.lat),
                lng: parseFloat(destination.lng)
            },
            passengerType: passengerType.toLowerCase(),
            preference
        });

        return {
            success: true,
            data: response.data.data
        };
    } catch (error) {
        console.error('Multi-modal routing error:', error);
        return {
            success: false,
            error: error.response?.data?.error?.message || error.message
        };
    }
};

/**
 * Get all transport hubs
 * @returns {Promise<Object>} Transport hubs
 */
export const getTransportHubs = async () => {
    try {
        const response = await apiClient.get('/routes/transport-hubs');
        return {
            success: true,
            data: response.data.data
        };
    } catch (error) {
        console.error('Error fetching transport hubs:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Get transport type configurations
 * @returns {Promise<Object>} Transport types
 */
export const getTransportTypes = async () => {
    try {
        const response = await apiClient.get('/routes/transport-types');
        return {
            success: true,
            data: response.data.data
        };
    } catch (error) {
        console.error('Error fetching transport types:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Calculate segment fare
 * @param {string} transportType - jeepney, tricycle, bus, etc.
 * @param {number} distance - Distance in kilometers
 * @param {string} passengerType - regular, student, senior, pwd
 * @returns {Promise<Object>} Fare calculation
 */
export const calculateSegmentFare = async (transportType, distance, passengerType = 'regular') => {
    try {
        const response = await apiClient.post('/routes/calculate-segment-fare', {
            transportType,
            distance,
            passengerType: passengerType.toLowerCase()
        });

        return {
            success: true,
            data: response.data.data
        };
    } catch (error) {
        console.error('Error calculating segment fare:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

export default {
    getMultiModalRoutes,
    getTransportHubs,
    getTransportTypes,
    calculateSegmentFare
};
