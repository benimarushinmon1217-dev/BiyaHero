/**
 * Routing Service
 * OpenRouteService API integration for route calculation
 */

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const OPENROUTE_API_KEY = process.env.OPENROUTE_API_KEY;
const OPENROUTE_BASE_URL = process.env.OPENROUTE_BASE_URL || 'https://api.openrouteservice.org';

// Fallback to OSRM if OpenRouteService is not configured
const OSRM_BASE_URL = 'https://router.project-osrm.org';

/**
 * Get route using OpenRouteService
 * @param {Object} start - Start coordinates {lat, lng}
 * @param {Object} end - End coordinates {lat, lng}
 * @returns {Promise<Object>} Route data
 */
export const getRoute = async (start, end) => {
    try {
        // Use OpenRouteService if API key is available
        if (OPENROUTE_API_KEY) {
            return await getRouteFromOpenRoute(start, end);
        }

        // Fallback to OSRM (free, no API key required)
        return await getRouteFromOSRM(start, end);
    } catch (error) {
        console.error('Routing error:', error.message);

        // Try fallback if primary fails
        if (OPENROUTE_API_KEY) {
            console.log('Falling back to OSRM...');
            return await getRouteFromOSRM(start, end);
        }

        throw error;
    }
};

/**
 * Get route from OpenRouteService
 */
const getRouteFromOpenRoute = async (start, end) => {
    const url = `${OPENROUTE_BASE_URL}/v2/directions/driving-car`;

    const response = await axios.post(
        url,
        {
            coordinates: [
                [start.lng, start.lat],
                [end.lng, end.lat]
            ],
            format: 'geojson',
            instructions: true,
            elevation: false
        },
        {
            headers: {
                'Authorization': OPENROUTE_API_KEY,
                'Content-Type': 'application/json'
            }
        }
    );

    const route = response.data.features[0];
    const properties = route.properties;
    const segments = properties.segments[0];

    return {
        success: true,
        distance: (properties.summary.distance / 1000).toFixed(2), // Convert to km
        duration: Math.round(properties.summary.duration / 60), // Convert to minutes
        geometry: route.geometry.coordinates.map(coord => [coord[1], coord[0]]), // [lat, lng]
        steps: segments.steps.map(step => ({
            instruction: step.instruction,
            distance: (step.distance / 1000).toFixed(2),
            duration: Math.round(step.duration / 60)
        })),
        source: 'openroute'
    };
};

/**
 * Get route from OSRM (fallback)
 */
const getRouteFromOSRM = async (start, end) => {
    const url = `${OSRM_BASE_URL}/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson&steps=true`;

    const response = await axios.get(url);

    if (response.data.code !== 'Ok') {
        throw new Error('OSRM routing failed');
    }

    const route = response.data.routes[0];

    return {
        success: true,
        distance: (route.distance / 1000).toFixed(2), // Convert to km
        duration: Math.round(route.duration / 60), // Convert to minutes
        geometry: route.geometry.coordinates.map(coord => [coord[1], coord[0]]), // [lat, lng]
        steps: route.legs[0].steps.map(step => ({
            instruction: step.maneuver.type,
            distance: (step.distance / 1000).toFixed(2),
            duration: Math.round(step.duration / 60)
        })),
        source: 'osrm'
    };
};

/**
 * Get multiple route options
 */
export const getRouteOptions = async (start, end) => {
    try {
        const mainRoute = await getRoute(start, end);

        // For now, return single route
        // Can be extended to return alternative routes
        return {
            success: true,
            routes: [
                {
                    id: 1,
                    type: 'fastest',
                    name: 'Fastest Route',
                    ...mainRoute
                }
            ]
        };
    } catch (error) {
        throw new Error(`Failed to get route options: ${error.message}`);
    }
};

export default {
    getRoute,
    getRouteOptions
};
