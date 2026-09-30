/**
 * Routing Service
 * OpenRouteService API integration for route calculation
 */

import axios from 'axios';
import dotenv from 'dotenv';
import {
    normalizeCoordinates,
    toGeoJSONCoordinate,
    validateRouteGeometryEndpoints
} from '../utils/coordinates.js';

dotenv.config();

const OPENROUTE_API_KEY = process.env.OPENROUTE_API_KEY;
const OPENROUTE_BASE_URL = process.env.OPENROUTE_BASE_URL || 'https://api.openrouteservice.org';

// Fallback to OSRM if OpenRouteService is not configured
const OSRM_BASE_URL = 'https://router.project-osrm.org';
const normalizeRouteGeometry = (coordinates, start, end, source) => {
    const result = validateRouteGeometryEndpoints(coordinates, start, end);
    console.info('Road route endpoint validation:', {
        source,
        requestedOrigin: start,
        actualRouteOrigin: result.geometry[0],
        requestedDestination: end,
        actualRouteDestination: result.geometry[result.geometry.length - 1],
        startSnapMeters: Math.round(result.startSnapMeters),
        endSnapMeters: Math.round(result.endSnapMeters)
    });
    return result;
};

/**
 * Get route using OpenRouteService
 * @param {Object} start - Start coordinates {lat, lng}
 * @param {Object} end - End coordinates {lat, lng}
 * @returns {Promise<Object>} Route data
 */
export const getRoute = async (start, end) => {
    const normalizedStart = normalizeCoordinates(start);
    const normalizedEnd = normalizeCoordinates(end);
    if (!normalizedStart || !normalizedEnd) {
        throw new Error('Routing requires finite latitude and longitude coordinates');
    }

    try {
        // Use OpenRouteService if API key is available
        if (OPENROUTE_API_KEY) {
            return await getRouteFromOpenRoute(normalizedStart, normalizedEnd);
        }

        // Fallback to OSRM (free, no API key required)
        return await getRouteFromOSRM(normalizedStart, normalizedEnd);
    } catch (error) {
        console.error('Routing error:', error.message);

        // Try fallback if primary fails
        if (OPENROUTE_API_KEY) {
            console.log('Falling back to OSRM...');
            return await getRouteFromOSRM(normalizedStart, normalizedEnd);
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
            coordinates: [toGeoJSONCoordinate(start), toGeoJSONCoordinate(end)],
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
    const normalizedGeometry = normalizeRouteGeometry(
        route.geometry.coordinates,
        start,
        end,
        'OpenRouteService'
    );

    return {
        success: true,
        distance: (properties.summary.distance / 1000).toFixed(2), // Convert to km
        duration: Math.round(properties.summary.duration / 60), // Convert to minutes
        geometry: normalizedGeometry.geometry,
        startSnapMeters: normalizedGeometry.startSnapMeters,
        endSnapMeters: normalizedGeometry.endSnapMeters,
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
    const url = `${OSRM_BASE_URL}/route/v1/driving/${toGeoJSONCoordinate(start).join(',')};${toGeoJSONCoordinate(end).join(',')}?overview=full&geometries=geojson&steps=true`;

    const response = await axios.get(url);

    if (response.data.code !== 'Ok') {
        throw new Error('OSRM routing failed');
    }

    const route = response.data.routes[0];
    const normalizedGeometry = normalizeRouteGeometry(
        route.geometry.coordinates,
        start,
        end,
        'OSRM driving'
    );

    return {
        success: true,
        distance: (route.distance / 1000).toFixed(2), // Convert to km
        duration: Math.round(route.duration / 60), // Convert to minutes
        geometry: normalizedGeometry.geometry,
        startSnapMeters: normalizedGeometry.startSnapMeters,
        endSnapMeters: normalizedGeometry.endSnapMeters,
        source: 'osrm-driving',
        steps: route.legs[0].steps.map(step => ({
            instruction: step.maneuver.type,
            distance: (step.distance / 1000).toFixed(2),
            duration: Math.round(step.duration / 60)
        })),
        source: 'osrm-driving'
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
