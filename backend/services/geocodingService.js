/**
 * Geocoding Service
 * Nominatim (OpenStreetMap) API integration for geocoding
 */

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const NOMINATIM_BASE_URL = process.env.NOMINATIM_BASE_URL || 'https://nominatim.openstreetmap.org';

// User agent required by Nominatim usage policy
const USER_AGENT = 'BiyaHero/1.0 (Smart Transportation Platform)';

/**
 * Search for places by query
 * @param {string} query - Search query
 * @param {number} limit - Maximum results
 * @returns {Promise<Array>} Array of place objects
 */
export const searchPlaces = async (query, limit = 5) => {
    try {
        const response = await axios.get(`${NOMINATIM_BASE_URL}/search`, {
            params: {
                q: `${query}, Batangas, Philippines`,
                format: 'json',
                limit,
                addressdetails: 1,
                'accept-language': 'en'
            },
            headers: {
                'User-Agent': USER_AGENT
            }
        });

        return response.data.map(place => ({
            name: place.name || place.display_name.split(',')[0],
            displayName: place.display_name,
            lat: parseFloat(place.lat),
            lng: parseFloat(place.lon),
            type: place.type,
            category: place.class,
            municipality: place.address?.city || place.address?.town || place.address?.municipality,
            province: place.address?.state || 'Batangas',
            country: place.address?.country,
            confidence: calculateConfidence(place, query)
        }));
    } catch (error) {
        console.error('Geocoding error:', error.message);
        throw new Error('Failed to search places');
    }
};

/**
 * Reverse geocode coordinates to address
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<Object>} Place object
 */
export const reverseGeocode = async (lat, lng) => {
    try {
        const response = await axios.get(`${NOMINATIM_BASE_URL}/reverse`, {
            params: {
                lat,
                lon: lng,
                format: 'json',
                addressdetails: 1,
                'accept-language': 'en'
            },
            headers: {
                'User-Agent': USER_AGENT
            }
        });

        const place = response.data;

        return {
            name: place.name || place.display_name.split(',')[0],
            displayName: place.display_name,
            lat: parseFloat(place.lat),
            lng: parseFloat(place.lon),
            type: place.type,
            category: place.class,
            municipality: place.address?.city || place.address?.town || place.address?.municipality,
            province: place.address?.state || 'Batangas',
            country: place.address?.country
        };
    } catch (error) {
        console.error('Reverse geocoding error:', error.message);
        throw new Error('Failed to reverse geocode');
    }
};

/**
 * Calculate confidence score for search result
 * @param {Object} place - Nominatim place object
 * @param {string} query - Original search query
 * @returns {number} Confidence score (0-1)
 */
const calculateConfidence = (place, query) => {
    let confidence = 0.5; // Base confidence

    // Boost if in Batangas
    if (place.address?.state?.toLowerCase().includes('batangas')) {
        confidence += 0.2;
    }

    // Boost if name matches query
    const placeName = (place.name || place.display_name).toLowerCase();
    const queryLower = query.toLowerCase();

    if (placeName.includes(queryLower)) {
        confidence += 0.2;
    }

    // Boost for specific place types
    const preferredTypes = ['city', 'town', 'village', 'place_of_worship', 'school', 'hospital', 'mall'];
    if (preferredTypes.includes(place.type)) {
        confidence += 0.1;
    }

    return Math.min(confidence, 1.0);
};

/**
 * Get place details by coordinates
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<Object>} Place details
 */
export const getPlaceDetails = async (lat, lng) => {
    return await reverseGeocode(lat, lng);
};

export default {
    searchPlaces,
    reverseGeocode,
    getPlaceDetails
};
