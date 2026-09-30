import { generateRealisticRoutes } from './realisticRoutingService.js';
import { getRoute } from './routingService.js';

const errorMessage = error => error instanceof Error ? error.message : 'Unknown routing provider error';

export const buildRoutePlan = async ({
    origin,
    destination,
    passengerType = 'regular',
    preference = 'recommended'
}, dependencies = {}) => {
    const routeRoad = dependencies.routeRoad || getRoute;
    const planTransit = dependencies.planTransit || generateRealisticRoutes;

    const [roadResult, transitResult] = await Promise.allSettled([
        routeRoad(origin, destination),
        planTransit(origin, destination, passengerType, { preference })
    ]);

    if (roadResult.status === 'rejected') {
        console.error('BiyaHero road routing provider failed:', errorMessage(roadResult.reason));
    }
    if (transitResult.status === 'rejected') {
        console.error('BiyaHero transit route planner failed:', errorMessage(transitResult.reason));
    }

    const road = roadResult.status === 'fulfilled' && roadResult.value?.success
        ? {
            status: 'available',
            routeType: 'road_reference',
            label: 'Road-route reference',
            profile: roadResult.value.source,
            distanceKm: Number(roadResult.value.distance),
            durationMinutes: roadResult.value.duration,
            geometry: roadResult.value.geometry
        }
        : {
            status: 'unavailable',
            routeType: 'road_reference',
            reason: roadResult.status === 'rejected'
                ? 'Street routing provider is unavailable.'
                : roadResult.value?.error || 'Road router returned no route.'
        };

    const transit = transitResult.status === 'fulfilled' && transitResult.value?.success
        ? {
            status: 'available',
            routes: transitResult.value.routes,
            routingMethod: transitResult.value.routingMethod
        }
        : {
            status: 'unavailable',
            routes: [],
            reason: transitResult.status === 'rejected'
                ? 'BiyaHero transit route data is temporarily unavailable.'
                : transitResult.value?.message || 'No source-verified transit itinerary is available.'
        };

    return {
        provider: 'BiyaHero',
        apiVersion: 'v1',
        origin,
        destination,
        road,
        publicTransit: transit,
        motorcycleTaxi: {
            status: 'not_integrated',
            route: null,
            fareQuote: null,
            booking: null,
            message: 'BiyaHero does not yet have its own motorcycle driver network, verified motorcycle-specific route profile, or fare schedule.'
        },
        notes: [
            'Road geometry is a street-route reference, not a public-transit or motorcycle-specific itinerary.',
            'Public-transit options are returned only when their service, stops, direction, and transit geometry are source-verified.',
            'No external provider handoff or booking is performed.'
        ]
    };
};

export default { buildRoutePlan };
