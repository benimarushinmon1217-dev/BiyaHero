/**
 * REALISTIC COMMUTER ROUTING SERVICE
 * 
 * This is NOT a generic map-based routing engine.
 * This is a COMMUTER KNOWLEDGE SYSTEM.
 * 
 * Philosophy:
 * - Routes are DISCOVERED from knowledge base, not CALCULATED from coordinates
 * - Only PREDEFINED patterns are returned
 * - Transfers only at LEGITIMATE hubs
 * - Transport types follow ACTUAL usage
 * 
 * This service understands:
 * - How Batangas commuters actually travel
 * - Which routes are commonly used
 * - Where people actually transfer
 * - What transport types are realistic
 */

import { getRoute } from './routingService.js';
import { BATANGAS_TRANSPORT_HUBS, ROUTE_TAGS, COMMUTER_BEHAVIOR, ROUTE_LEGITIMACY_RULES } from '../data/batangasTransportNetwork.js';
import { BATANGAS_JEEPNEY_ROUTES } from '../data/batangasJeepneyRoutes.js';

/**
 * Calculate fare based on distance and passenger type
 */
const calculateFare = (distance, passengerType, baseFare = 12) => {
    let fare = baseFare;

    if (distance > 5) {
        fare += Math.ceil(distance - 5) * 1; // ₱1 per km after 5km
    }

    // Apply discounts
    if (['student', 'senior', 'pwd'].includes(passengerType)) {
        fare = Math.round(fare * 0.8); // 20% discount
    }

    return fare;
};

/**
 * Calculate duration based on distance and transport type
 */
const calculateDuration = (distance, transportType = 'jeepney') => {
    const speeds = {
        jeepney: 25, // km/h
        tricycle: 20,
        bus: 40,
        uv_express: 50,
        walking: 4
    };

    const speed = speeds[transportType] || 25;
    const travelTime = (distance / speed) * 60; // Convert to minutes
    const waitTime = transportType === 'jeepney' ? 5 : 3;

    return Math.round(travelTime + waitTime);
};

/**
 * Find routes serving a specific location
 */
const findRoutesServingLocation = (locationName) => {
    const routes = [];
    const normalizedLocation = locationName.toLowerCase();

    for (const [routeId, route] of Object.entries(BATANGAS_JEEPNEY_ROUTES)) {
        const hasStop = route.stops.some(stop =>
            stop.name.toLowerCase().includes(normalizedLocation) ||
            normalizedLocation.includes(stop.name.toLowerCase())
        );

        if (hasStop) {
            routes.push(route);
        }
    }

    return routes;
};

/**
 * Find legitimate transfer hub between two routes
 */
const findLegitimateTransferHub = (route1Id, route2Id) => {
    const route1 = BATANGAS_JEEPNEY_ROUTES[route1Id];
    const route2 = BATANGAS_JEEPNEY_ROUTES[route2Id];

    if (!route1 || !route2) return null;

    // Find common stops that are transfer hubs
    for (const stop1 of route1.stops) {
        if (stop1.isTransferHub) {
            for (const stop2 of route2.stops) {
                if (stop2.isTransferHub && stop1.name === stop2.name) {
                    // Found a common transfer hub
                    const hubId = stop1.name.toLowerCase().replace(/ /g, '-');
                    return BATANGAS_TRANSPORT_HUBS[hubId] || {
                        name: stop1.name,
                        displayName: stop1.name,
                        lat: stop1.lat,
                        lng: stop1.lng,
                        transferTime: 5,
                        description: 'Transfer point'
                    };
                }
            }
        }
    }

    return null;
};

/**
 * Try to build route from jeepney route knowledge
 */
const buildRouteFromJeepneyNetwork = async (origin, destination, passengerType) => {
    try {
        // Find routes serving origin and destination
        const originRoutes = findRoutesServingLocation(origin.name);
        const destRoutes = findRoutesServingLocation(destination.name);

        if (originRoutes.length === 0 || destRoutes.length === 0) {
            return null;
        }

        // Check for direct route (same jeepney serves both)
        const directRoute = originRoutes.find(or =>
            destRoutes.some(dr => dr.routeId === or.routeId)
        );

        if (directRoute) {
            // Direct route exists!
            const originStop = directRoute.stops.find(s =>
                s.name.toLowerCase().includes(origin.name.toLowerCase()) ||
                origin.name.toLowerCase().includes(s.name.toLowerCase())
            );
            const destStop = directRoute.stops.find(s =>
                s.name.toLowerCase().includes(destination.name.toLowerCase()) ||
                destination.name.toLowerCase().includes(s.name.toLowerCase())
            );

            if (!originStop || !destStop) return null;

            const routeData = await getRoute(
                { lat: originStop.lat, lng: originStop.lng },
                { lat: destStop.lat, lng: destStop.lng }
            );

            const distance = parseFloat(routeData.distance);
            const fare = calculateFare(distance, passengerType, directRoute.baseFare);
            const duration = calculateDuration(distance, directRoute.transportType);

            // Get route tags
            const routeTags = directRoute.tags ? directRoute.tags.map(tagId => {
                const tagKey = tagId.toUpperCase();
                return ROUTE_TAGS[tagKey] || null;
            }).filter(Boolean) : [];

            return {
                routeId: `direct-${directRoute.routeId}`,
                routeType: 'direct',
                routeName: `Direct via ${directRoute.routeName}`,
                totalSegments: 1,
                totalDistance: distance,
                totalDuration: duration,
                totalFare: fare,
                totalTransfers: 0,
                comfortLevel: 'basic',
                reliability: directRoute.reliability,
                tags: routeTags,
                commuterNotes: directRoute.commuterNotes,
                segments: [{
                    segmentOrder: 1,
                    transportType: directRoute.transportType,
                    routeName: directRoute.routeName,
                    routeCode: directRoute.routeCode,
                    originName: origin.name,
                    originLat: originStop.lat,
                    originLng: originStop.lng,
                    destinationName: destination.name,
                    destinationLat: destStop.lat,
                    destinationLng: destStop.lng,
                    distance,
                    duration,
                    fare,
                    waitTime: directRoute.frequencyMinutes || 5,
                    transferTime: 0,
                    geometry: routeData.geometry,
                    instructions: `Sakay ka po ng "${directRoute.routeName}" jeep mula ${origin.name} papuntang ${destination.name}`,
                    filipinoInstructions: `Sakay ka po ng "${directRoute.routeName}" jeep mula ${origin.name} papuntang ${destination.name}`,
                    transferNotes: null,
                    commuterNotes: directRoute.commuterNotes
                }],
                advantages: [
                    'Direct route - walang transfer',
                    'Actual jeepney route',
                    directRoute.studentFriendly ? 'Student friendly' : null,
                    'Pinakamura'
                ].filter(Boolean),
                disadvantages: [],
                recommendationReason: 'Direct jeepney route available - walang hassle!',
                isRealistic: true,
                culturallyAccurate: true
            };
        }

        // No direct route - find transfer via legitimate hub
        for (const originRoute of originRoutes) {
            for (const destRoute of destRoutes) {
                const transferHub = findLegitimateTransferHub(originRoute.routeId, destRoute.routeId);

                if (transferHub) {
                    // Found a legitimate transfer!
                    const segments = [];
                    let totalDistance = 0;
                    let totalDuration = 0;
                    let totalFare = 0;

                    // Segment 1: Origin to Hub
                    const originStop = originRoute.stops.find(s =>
                        s.name.toLowerCase().includes(origin.name.toLowerCase()) ||
                        origin.name.toLowerCase().includes(s.name.toLowerCase())
                    );
                    const hubStop1 = originRoute.stops.find(s =>
                        s.name === transferHub.name
                    );

                    if (originStop && hubStop1) {
                        const route1Data = await getRoute(
                            { lat: originStop.lat, lng: originStop.lng },
                            { lat: hubStop1.lat, lng: hubStop1.lng }
                        );

                        const distance1 = parseFloat(route1Data.distance);
                        const fare1 = calculateFare(distance1, passengerType, originRoute.baseFare);
                        const duration1 = calculateDuration(distance1, originRoute.transportType);

                        totalDistance += distance1;
                        totalDuration += duration1 + transferHub.transferTime;
                        totalFare += fare1;

                        segments.push({
                            segmentOrder: 1,
                            transportType: originRoute.transportType,
                            routeName: originRoute.routeName,
                            routeCode: originRoute.routeCode,
                            originName: origin.name,
                            originLat: originStop.lat,
                            originLng: originStop.lng,
                            destinationName: transferHub.displayName,
                            destinationLat: transferHub.lat,
                            destinationLng: transferHub.lng,
                            distance: distance1,
                            duration: duration1,
                            fare: fare1,
                            waitTime: originRoute.frequencyMinutes || 5,
                            transferTime: transferHub.transferTime,
                            geometry: route1Data.geometry,
                            instructions: `Sakay ka po ng "${originRoute.routeName}" jeep papuntang ${transferHub.displayName}`,
                            filipinoInstructions: `Sakay ka po ng "${originRoute.routeName}" jeep papuntang ${transferHub.displayName}`,
                            transferNotes: `Baba ka sa ${transferHub.displayName}. ${transferHub.commuterNote || transferHub.description}`,
                            commuterNotes: originRoute.commuterNotes
                        });
                    }

                    // Segment 2: Hub to Destination
                    const hubStop2 = destRoute.stops.find(s =>
                        s.name === transferHub.name
                    );
                    const destStop = destRoute.stops.find(s =>
                        s.name.toLowerCase().includes(destination.name.toLowerCase()) ||
                        destination.name.toLowerCase().includes(s.name.toLowerCase())
                    );

                    if (hubStop2 && destStop) {
                        const route2Data = await getRoute(
                            { lat: hubStop2.lat, lng: hubStop2.lng },
                            { lat: destStop.lat, lng: destStop.lng }
                        );

                        const distance2 = parseFloat(route2Data.distance);
                        const fare2 = calculateFare(distance2, passengerType, destRoute.baseFare);
                        const duration2 = calculateDuration(distance2, destRoute.transportType);

                        totalDistance += distance2;
                        totalDuration += duration2;
                        totalFare += fare2;

                        segments.push({
                            segmentOrder: 2,
                            transportType: destRoute.transportType,
                            routeName: destRoute.routeName,
                            routeCode: destRoute.routeCode,
                            originName: transferHub.displayName,
                            originLat: transferHub.lat,
                            originLng: transferHub.lng,
                            destinationName: destination.name,
                            destinationLat: destStop.lat,
                            destinationLng: destStop.lng,
                            distance: distance2,
                            duration: duration2,
                            fare: fare2,
                            waitTime: destRoute.frequencyMinutes || 5,
                            transferTime: 0,
                            geometry: route2Data.geometry,
                            instructions: `Sakay ka ulit ng "${destRoute.routeName}" jeep papuntang ${destination.name}`,
                            filipinoInstructions: `Sakay ka ulit ng "${destRoute.routeName}" jeep papuntang ${destination.name}`,
                            transferNotes: null,
                            commuterNotes: destRoute.commuterNotes
                        });
                    }

                    if (segments.length === 2) {
                        // Combine tags from both routes
                        const allTags = [...(originRoute.tags || []), ...(destRoute.tags || [])];
                        const uniqueTags = [...new Set(allTags)];
                        const routeTags = uniqueTags.map(tagId => {
                            const tagKey = tagId.toUpperCase();
                            return ROUTE_TAGS[tagKey] || null;
                        }).filter(Boolean);

                        return {
                            routeId: `transfer-${originRoute.routeId}-${destRoute.routeId}`,
                            routeType: 'split',
                            routeName: `Via ${transferHub.displayName}`,
                            totalSegments: 2,
                            totalDistance,
                            totalDuration,
                            totalFare,
                            totalTransfers: 1,
                            comfortLevel: 'basic',
                            reliability: Math.min(originRoute.reliability, destRoute.reliability),
                            tags: routeTags,
                            segments,
                            advantages: [
                                'Uses actual jeepney routes',
                                'Legitimate transfer hub',
                                'Commonly used by locals'
                            ],
                            disadvantages: [
                                'Kailangan mag-transfer once'
                            ],
                            recommendationReason: `Mag-transfer ka sa ${transferHub.displayName}, major hub yan ng commuters`,
                            isRealistic: true,
                            culturallyAccurate: true
                        };
                    }
                }
            }
        }

        return null;
    } catch (error) {
        console.error('Error building route from jeepney network:', error);
        return null;
    }
};

/**
 * MAIN ROUTING FUNCTION
 * Generate realistic commuter routes ONLY
 */
export const generateRealisticRoutes = async (origin, destination, passengerType = 'regular', options = {}) => {
    try {
        const routes = [];

        // Build from jeepney network knowledge
        console.log('🔍 Building route from Batangas jeepney network...');
        const networkRoute = await buildRouteFromJeepneyNetwork(origin, destination, passengerType);
        if (networkRoute) {
            networkRoute.recommended = true;
            routes.push(networkRoute);
        }

        // If still no routes, return error
        if (routes.length === 0) {
            return {
                success: false,
                error: 'No realistic commuter route found',
                message: `Wala pa kaming route information para sa ${origin.name} to ${destination.name}. Baka hindi pa ito common na route o kailangan pa namin i-add sa database.`,
                suggestion: 'Try searching for routes to major hubs like Lipa Cathedral, SM Lipa, Batangas Grand Terminal, o Tanauan City Hall.',
                origin: { name: origin.name, lat: origin.lat, lng: origin.lng },
                destination: { name: destination.name, lat: destination.lat, lng: destination.lng }
            };
        }

        // Sort by preference
        const sortedRoutes = routes.sort((a, b) => {
            if (options.preference === 'cheapest') return a.totalFare - b.totalFare;
            if (options.preference === 'fastest') return a.totalDuration - b.totalDuration;
            if (options.preference === 'least_transfers') return a.totalTransfers - b.totalTransfers;
            return 0;
        });

        return {
            success: true,
            origin: { name: origin.name, lat: origin.lat, lng: origin.lng },
            destination: { name: destination.name, lat: destination.lat, lng: destination.lng },
            passengerType,
            totalRoutes: sortedRoutes.length,
            routes: sortedRoutes,
            routingMethod: 'batangas_commuter_network',
            culturallyAccurate: true,
            coverageArea: 'Batangas Province'
        };

    } catch (error) {
        console.error('Error generating realistic routes:', error);
        throw error;
    }
};

export default {
    generateRealisticRoutes
};
