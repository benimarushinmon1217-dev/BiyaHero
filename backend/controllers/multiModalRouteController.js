/**
 * Multi-Modal Route Controller
 * Handles REALISTIC Philippine commuter routing requests
 * Uses only source-verified commuter corridors and transit geometry
 */

import { generateRealisticRoutes } from '../services/realisticRoutingService.js';
import { buildRoutePlan } from '../services/routePlanningService.js';
import { BATANGAS_TRANSPORT_HUBS, isVerifiedTransportHub, ROUTE_TAGS } from '../data/batangasTransportNetwork.js';
import { BATANGAS_JEEPNEY_ROUTES, isVerifiedJeepneyRoute } from '../data/batangasJeepneyRoutes.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { getBatangasScopeMessage, isBatangasMunicipality, isWithinBatangasScope } from '../services/geographicScopeService.js';
import { calculateSegmentFare } from '../utils/fareCalculator.js';
import { normalizeCoordinates } from '../utils/coordinates.js';

/**
 * @route   POST /api/v1/routes/multi-modal
 * @desc    Generate commute options only from source-verified transit data
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
    const originCoordinates = normalizeCoordinates(origin);
    const destinationCoordinates = normalizeCoordinates(destination);
    if (!origin || !origin.name || !originCoordinates) {
        throw new ApiError(400, 'Valid origin with name, latitude, and longitude is required');
    }

    if (!destination || !destination.name || !destinationCoordinates) {
        throw new ApiError(400, 'Valid destination with name, latitude, and longitude is required');
    }
    const normalizedOrigin = { ...origin, ...originCoordinates, lat: originCoordinates.latitude, lng: originCoordinates.longitude };
    const normalizedDestination = { ...destination, ...destinationCoordinates, lat: destinationCoordinates.latitude, lng: destinationCoordinates.longitude };
    if (!isWithinBatangasScope(normalizedOrigin) || !isWithinBatangasScope(normalizedDestination)) {
        throw new ApiError(400, getBatangasScopeMessage());
    }
    if (!['regular', 'student', 'senior', 'pwd'].includes(passengerType)) {
        throw new ApiError(400, 'Invalid passenger type');
    }
    if (!['recommended', 'cheapest', 'fastest', 'least_transfers'].includes(preference)) {
        throw new ApiError(400, 'Invalid route preference');
    }

    console.log(`🚌 Generating realistic route: ${origin.name} → ${destination.name}`);

    // Generate routes using REALISTIC routing (predefined patterns only)
    const result = await generateRealisticRoutes(
        normalizedOrigin,
        normalizedDestination,
        passengerType,
        { preference }
    );

    if (!result.success) {
        ApiResponse.success(res, result, result.message || 'No realistic route found');
        return;
    }

    ApiResponse.success(res, result, 'Realistic commuter routes generated successfully');
});

export const getRoutePlan = asyncHandler(async (req, res) => {
    const {
        origin,
        destination,
        passengerType = 'regular',
        preference = 'recommended'
    } = req.body;

    const originCoordinates = normalizeCoordinates(origin);
    const destinationCoordinates = normalizeCoordinates(destination);
    if (!origin?.name || !originCoordinates || !destination?.name || !destinationCoordinates) {
        throw new ApiError(400, 'Origin and destination must include a name and valid latitude/longitude coordinates.');
    }
    if (!['regular', 'student', 'senior', 'pwd'].includes(passengerType)) {
        throw new ApiError(400, 'Invalid passenger type');
    }
    if (!['recommended', 'cheapest', 'fastest', 'least_transfers'].includes(preference)) {
        throw new ApiError(400, 'Invalid route preference');
    }

    const normalizedOrigin = {
        ...origin,
        ...originCoordinates,
        lat: originCoordinates.latitude,
        lng: originCoordinates.longitude
    };
    const normalizedDestination = {
        ...destination,
        ...destinationCoordinates,
        lat: destinationCoordinates.latitude,
        lng: destinationCoordinates.longitude
    };
    if (!isWithinBatangasScope(normalizedOrigin) || !isWithinBatangasScope(normalizedDestination)) {
        throw new ApiError(400, getBatangasScopeMessage());
    }

    const plan = await buildRoutePlan({
        origin: normalizedOrigin,
        destination: normalizedDestination,
        passengerType,
        preference
    });
    ApiResponse.success(res, plan, 'BiyaHero route plan generated');
});

export const calculateSegmentFareEstimate = asyncHandler(async (req, res) => {
    const distance = Number(req.body.distance);
    const passengerType = req.body.passengerType || 'regular';
    const transportType = req.body.transportType || 'jeepney';
    if (!isBatangasMunicipality(req.body.originMunicipality) ||
        !isBatangasMunicipality(req.body.destinationMunicipality)) {
        throw new ApiError(400, getBatangasScopeMessage());
    }
    if (!Number.isFinite(distance) || distance <= 0) {
        throw new ApiError(400, 'Distance must be a positive number');
    }
    if (!['regular', 'student', 'senior', 'pwd'].includes(passengerType)) {
        throw new ApiError(400, 'Invalid passenger type');
    }
    if (!['jeepney', 'tricycle', 'bus', 'uv_express', 'van', 'walking'].includes(transportType)) {
        throw new ApiError(400, 'Invalid transport type');
    }
    ApiResponse.success(res, calculateSegmentFare(distance, passengerType, transportType), 'Segment fare calculated successfully');
});

/**
 * @route   GET /api/v1/routes/transport-hubs
 * @desc    Get all LEGITIMATE transfer hubs (not arbitrary points)
 * @access  Public
 */
export const getTransportHubs = asyncHandler(async (req, res) => {
    const hubs = Object.values(BATANGAS_TRANSPORT_HUBS)
        .filter(isVerifiedTransportHub);

    ApiResponse.success(res, {
        totalHubs: hubs.length,
        hubs,
        coverageArea: 'Batangas Province',
        municipalities: [...new Set(hubs.map(h => h.municipality))],
        note: hubs.length
            ? 'Only source-verified transport hubs are listed.'
            : 'No source-verified transport hubs are currently available.'
    }, 'Batangas transport hubs retrieved successfully');
});

/**
 * @route   GET /api/v1/routes/jeepney-routes
 * @desc    Get candidate jeepney route records and their verification status
 * @access  Public
 */
export const getJeepneyRoutes = asyncHandler(async (req, res) => {
    const routes = Object.values(BATANGAS_JEEPNEY_ROUTES);

    ApiResponse.success(res, {
        totalRoutes: routes.length,
        routes,
        coverageArea: 'Batangas Province',
        municipalities: [...new Set(routes.map(r => r.municipality))],
        note: 'Unverified route records are provided for review only and are excluded from route generation.'
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

export const getPopularRoutes = asyncHandler(async (req, res) => {
    const preferredRoutes = [
        { id: 'lipa-bayan-sm', destination: 'SM City Lipa' },
        { id: 'lipa-bayan-bsu', destination: 'Batangas State University' },
        { id: 'tanauan-lipa' },
        { id: 'lipa-batangas-city' }
    ];
    const allHubs = Object.values(BATANGAS_TRANSPORT_HUBS)
        .filter(isVerifiedTransportHub);
    const municipalityFor = (stop, routeMunicipality) => {
        if (routeMunicipality !== 'Inter-City') return routeMunicipality;
        const hub = allHubs.find(candidate =>
            candidate.name.toLowerCase() === stop.name.toLowerCase() ||
            (candidate.aliases || []).some(alias => alias.toLowerCase() === stop.name.toLowerCase())
        ) || allHubs
            .map(candidate => ({
                candidate,
                distance: Math.hypot(candidate.lat - stop.lat, candidate.lng - stop.lng)
            }))
            .sort((a, b) => a.distance - b.distance)[0]?.candidate;
        return hub?.municipality || '';
    };
    const routes = preferredRoutes.flatMap(({ id, destination }) => {
        const route = BATANGAS_JEEPNEY_ROUTES[id];
        if (!isVerifiedJeepneyRoute(route)) return [];
        const destinationStop = destination
            ? route.stops.find(stop => stop.name.toLowerCase() === destination.toLowerCase())
            : route.stops[route.stops.length - 1];
        if (!destinationStop) return [];
        const originStop = route.stops[0];
        return [{
            id: route.routeId,
            name: route.routeName,
            transportType: route.transportType,
            origin: { ...originStop, municipality: municipalityFor(originStop, route.municipality), province: 'Batangas' },
            destination: { ...destinationStop, municipality: municipalityFor(destinationStop, route.municipality), province: 'Batangas' },
            startingFare: route.baseFare,
            transfers: 0,
            operatingHours: route.operatingHours,
            verified: isVerifiedJeepneyRoute(route)
        }];
    });
    ApiResponse.success(res, { routes, coverageArea: 'Batangas Province' });
});

export default {
    getMultiModalRoutes,
    getRoutePlan,
    calculateSegmentFareEstimate,
    getTransportHubs,
    getJeepneyRoutes,
    getRouteTags,
    getTransportTypes,
    getPopularRoutes
};
