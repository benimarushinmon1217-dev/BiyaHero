/**
 * Multi-Modal Route Controller
 * Handles REALISTIC Philippine commuter routing requests
 * Uses predefined commuter patterns and actual jeepney routes
 */

import { generateRealisticRoutes } from '../services/realisticRoutingService.js';
import { BATANGAS_TRANSPORT_HUBS, ROUTE_TAGS } from '../data/batangasTransportNetwork.js';
import { BATANGAS_JEEPNEY_ROUTES } from '../data/batangasJeepneyRoutes.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * @route   POST /api/v1/routes/multi-modal
 * @desc    Generate REALISTIC commute options based on actual commuter behavior
 * @access  Public
 */
export const getMultiModalRoutes = asyncHandler(async (req, res) => {
    const {
        origin,
        destination,
        passengerType = 'regular',
        preference = 'recommended'
    } = req.body;

    // Validate input
    if (!origin || !origin.name || !origin.lat || !origin.lng) {
        throw new ApiError(400, 'Valid origin with name, lat, and lng is required');
    }

    if (!destination || !destination.name || !destination.lat || !destination.lng) {
        throw new ApiError(400, 'Valid destination with name, lat, and lng is required');
    }

    console.log(`🚌 Generating realistic route: ${origin.name} → ${destination.name}`);

    // Generate routes using REALISTIC routing (predefined patterns only)
    const result = await generateRealisticRoutes(
        origin,
        destination,
        passengerType,
        { preference }
    );

    if (!result.success) {
        ApiResponse.success(res, result, result.message || 'No realistic route found');
        return;
    }

    ApiResponse.success(res, result, 'Realistic commuter routes generated successfully');
});

/**
 * @route   GET /api/v1/routes/transport-hubs
 * @desc    Get all LEGITIMATE transfer hubs (not arbitrary points)
 * @access  Public
 */
export const getTransportHubs = asyncHandler(async (req, res) => {
    const hubs = Object.values(BATANGAS_TRANSPORT_HUBS);

    ApiResponse.success(res, {
        totalHubs: hubs.length,
        hubs,
        coverageArea: 'Batangas Province',
        municipalities: [...new Set(hubs.map(h => h.municipality))],
        note: 'These are the legitimate transfer points across Batangas Province'
    }, 'Batangas transport hubs retrieved successfully');
});

/**
 * @route   GET /api/v1/routes/jeepney-routes
 * @desc    Get all actual jeepney routes
 * @access  Public
 */
export const getJeepneyRoutes = asyncHandler(async (req, res) => {
    const routes = Object.values(BATANGAS_JEEPNEY_ROUTES);

    ApiResponse.success(res, {
        totalRoutes: routes.length,
        routes,
        coverageArea: 'Batangas Province',
        municipalities: [...new Set(routes.map(r => r.municipality))],
        note: 'These are actual jeepney routes across Batangas Province'
    }, 'Batangas jeepney routes retrieved successfully');
});

/**
 * @route   GET /api/v1/routes/route-tags
 * @desc    Get all available route tags
 * @access  Public
 */
export const getRouteTags = asyncHandler(async (req, res) => {
    ApiResponse.success(res, {
        totalTags: Object.keys(ROUTE_TAGS).length,
        tags: ROUTE_TAGS,
        note: 'These tags help classify and filter routes based on commuter needs'
    }, 'Route tags retrieved successfully');
});

/**
 * @route   GET /api/v1/routes/transport-types
 * @desc    Get transport type usage rules
 * @access  Public
 */
export const getTransportTypes = asyncHandler(async (req, res) => {
    const transportTypes = {
        jeepney: {
            name: 'Jeepney',
            icon: '🚌',
            description: 'Main public transport in Batangas',
            typicalFare: '₱12-30',
            capacity: '16-20 passengers',
            comfortLevel: 'basic',
            usage: 'Short to medium distance (1-30km)'
        },
        tricycle: {
            name: 'Tricycle',
            icon: '🛺',
            description: 'For short distances and barangay routes',
            typicalFare: '₱10-20',
            capacity: '4-6 passengers',
            comfortLevel: 'basic',
            usage: 'Very short distance (<3km)'
        },
        bus: {
            name: 'Bus',
            icon: '🚍',
            description: 'For long distance inter-city travel',
            typicalFare: '₱40-100',
            capacity: '40-50 passengers',
            comfortLevel: 'comfortable',
            usage: 'Long distance (>20km)'
        },
        uv_express: {
            name: 'UV Express',
            icon: '🚐',
            description: 'Fast point-to-point service',
            typicalFare: '₱50-150',
            capacity: '12-15 passengers',
            comfortLevel: 'comfortable',
            usage: 'Express routes, longer distances'
        }
    };

    ApiResponse.success(res, {
        transportTypes,
        note: 'These rules define when each transport type is actually used by commuters'
    }, 'Transport types retrieved successfully');
});

export default {
    getMultiModalRoutes,
    getTransportHubs,
    getJeepneyRoutes,
    getRouteTags,
    getTransportTypes
};
