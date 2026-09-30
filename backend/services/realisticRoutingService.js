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

import { BATANGAS_TRANSPORT_HUBS, isVerifiedTransportHub, ROUTE_TAGS } from '../data/batangasTransportNetwork.js';
import { BATANGAS_JEEPNEY_ROUTES, isVerifiedJeepneyRoute } from '../data/batangasJeepneyRoutes.js';
import { calculateFare } from '../utils/fareCalculator.js';
import {
    distanceBetweenCoordinatesInMeters,
    isWithinBatangasCoordinateBounds,
    normalizeCoordinates
} from '../utils/coordinates.js';

/**
 * Calculate fare based on distance and passenger type
 */
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

const MAX_STOP_ACCESS_DISTANCE_KM = 2;

const serializePlace = place => {
    const coordinates = normalizeCoordinates(place);
    return {
        name: place.name,
        address: place.address || place.formattedAddress || place.name,
        ...(coordinates || {}),
        lat: coordinates?.latitude,
        lng: coordinates?.longitude
    };
};

const distanceInKm = (first, second) => {
    return distanceBetweenCoordinatesInMeters(first, second) / 1000;
};

export const findNearestNetworkStop = (
    place,
    maximumDistanceKm = MAX_STOP_ACCESS_DISTANCE_KM,
    routeRecords = Object.values(BATANGAS_JEEPNEY_ROUTES)
) => {
    if (!normalizeCoordinates(place)) return null;

    const stops = new Map();
    for (const route of routeRecords) {
        if (!isVerifiedJeepneyRoute(route)) continue;
        for (const stop of route.stops) {
            const key = `${stop.name}|${stop.lat}|${stop.lng}`;
            if (!stops.has(key)) stops.set(key, stop);
        }
    }
    const nearest = [...stops.values()]
        .map(stop => ({ stop, distanceKm: distanceInKm(place, stop) }))
        .sort((first, second) => first.distanceKm - second.distanceKm)[0];
    if (!nearest || nearest.distanceKm > maximumDistanceKm) return null;
    return { ...nearest.stop, distanceKm: nearest.distanceKm };
};

const findRoutesServingLocation = locationName => Object.values(BATANGAS_JEEPNEY_ROUTES)
    .filter(route => isVerifiedJeepneyRoute(route) &&
        route.stops.some(stop => stop.name === locationName));

export const getVerifiedTransitLeg = (route, originStop, destinationStop) => {
    if (!isVerifiedJeepneyRoute(route)) return null;
    const originIndex = route.stops.findIndex(stop => stop.name === originStop.name);
    const destinationIndex = route.stops.findIndex(stop => stop.name === destinationStop.name);
    if (originIndex < 0 || destinationIndex <= originIndex) return null;

    const geometry = route.transitGeometry.map(normalizeCoordinates);
    if (geometry.length < 2 || geometry.some(point =>
        !point || !isWithinBatangasCoordinateBounds(point)
    )) return null;

    const nearestGeometryIndex = stop => geometry
        .map((point, index) => ({
            index,
            distanceMeters: distanceBetweenCoordinatesInMeters(stop, point)
        }))
        .sort((first, second) => first.distanceMeters - second.distanceMeters)[0];
    const originPoint = nearestGeometryIndex(originStop);
    const destinationPoint = nearestGeometryIndex(destinationStop);
    const MAX_STOP_TO_SHAPE_DISTANCE_METERS = 30;
    if (!originPoint || !destinationPoint ||
        originPoint.distanceMeters > MAX_STOP_TO_SHAPE_DISTANCE_METERS ||
        destinationPoint.distanceMeters > MAX_STOP_TO_SHAPE_DISTANCE_METERS ||
        destinationPoint.index <= originPoint.index) return null;

    const legGeometry = geometry.slice(originPoint.index, destinationPoint.index + 1);
    const distance = legGeometry.slice(1).reduce(
        (total, point, index) => total + distanceInKm(legGeometry[index], point),
        0
    );
    if (!Number.isFinite(distance) || distance <= 0) return null;

    return {
        geometry: legGeometry,
        distance,
        startSnapMeters: originPoint.distanceMeters,
        endSnapMeters: destinationPoint.distanceMeters,
        source: route.transitGeometrySource
    };
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
                    const hub = BATANGAS_TRANSPORT_HUBS[hubId];
                    if (isVerifiedTransportHub(hub)) return hub;
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
        const originInput = origin;
        const destinationInput = destination;
        const nearestOriginStop = findNearestNetworkStop(originInput);
        const nearestDestinationStop = findNearestNetworkStop(destinationInput);
        if (!nearestOriginStop || !nearestDestinationStop) return [];

        // Match selected coordinates to the verified network before looking up routes.
        origin = { ...originInput, name: nearestOriginStop.name };
        destination = { ...destinationInput, name: nearestDestinationStop.name };
        const originRoutes = findRoutesServingLocation(origin.name);
        const destRoutes = findRoutesServingLocation(destination.name);
        const routes = [];

        if (originRoutes.length === 0 || destRoutes.length === 0) {
            return routes;
        }

        // Check for direct route (same jeepney serves both)
        const directRoutes = originRoutes.filter(or =>
            destRoutes.some(dr => dr.routeId === or.routeId)
        );

        for (const directRoute of directRoutes) {
            const originStop = directRoute.stops.find(stop => stop.name === origin.name);
            const destStop = directRoute.stops.find(stop => stop.name === destination.name);

            if (!originStop || !destStop || originStop.name === destStop.name) continue;
            if (distanceInKm(originStop, destStop) < 0.01) continue;

            const routeData = getVerifiedTransitLeg(directRoute, originStop, destStop);
            if (!routeData) continue;

            const distance = routeData.distance;
            const fare = calculateFare(distance, passengerType, directRoute.baseFare, directRoute.farePerKm);
            const duration = calculateDuration(distance, directRoute.transportType);

            // Get route tags
            const routeTags = directRoute.tags ? directRoute.tags.map(tagId => {
                const tagKey = tagId.toUpperCase();
                return ROUTE_TAGS[tagKey] || null;
            }).filter(Boolean) : [];

            routes.push({
                routeId: `direct-${directRoute.routeId}`,
                routeType: 'direct',
                routeName: `Direct via ${directRoute.routeName}`,
                networkId: 'batangas-jeepney-network',
                transportVerificationStatus: directRoute.verificationStatus,
                totalSegments: 1,
                totalDistance: distance,
                totalDuration: duration,
                totalFare: fare,
                totalTransfers: 0,
                comfortLevel: 'basic',
                reliability: directRoute.reliability,
                tags: routeTags,
                commuterNotes: directRoute.commuterNotes,
                originAccess: {
                    locationName: originInput.name,
                    lat: Number(originInput.lat),
                    lng: Number(originInput.lng),
                    stopName: originStop.name,
                    stopLat: originStop.lat,
                    stopLng: originStop.lng,
                    distanceKm: Number(nearestOriginStop.distanceKm.toFixed(2))
                },
                destinationAccess: {
                    locationName: destinationInput.name,
                    lat: Number(destinationInput.lat),
                    lng: Number(destinationInput.lng),
                    stopName: destStop.name,
                    stopLat: destStop.lat,
                    stopLng: destStop.lng,
                    distanceKm: Number(nearestDestinationStop.distanceKm.toFixed(2))
                },
                segments: [{
                    segmentOrder: 1,
                    transportType: directRoute.transportType,
                    routeName: directRoute.routeName,
                    routeCode: directRoute.routeCode,
                    originName: originStop.name,
                    originLat: originStop.lat,
                    originLng: originStop.lng,
                    destinationName: destStop.name,
                    destinationLat: destStop.lat,
                    destinationLng: destStop.lng,
                    distance,
                    duration,
                    fare,
                    waitTime: directRoute.frequencyMinutes || 5,
                    transferTime: 0,
                    geometry: routeData.geometry,
                    geometryProvider: routeData.source,
                    startSnapMeters: routeData.startSnapMeters,
                    endSnapMeters: routeData.endSnapMeters,
                    instructions: `Sakay ka po ng "${directRoute.routeName}" jeep mula ${originStop.name} papuntang ${destStop.name}`,
                    filipinoInstructions: `Sakay ka po ng "${directRoute.routeName}" jeep mula ${originStop.name} papuntang ${destStop.name}`,
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
            });
        }

        // Find additional transfer options only through legitimate network hubs.
        for (const originRoute of originRoutes) {
            for (const destRoute of destRoutes) {
                const transferHub = findLegitimateTransferHub(originRoute.routeId, destRoute.routeId);

                if (transferHub && originRoute.routeId !== destRoute.routeId) {
                    // Found a legitimate transfer!
                    const segments = [];
                    let totalDistance = 0;
                    let totalDuration = 0;
                    let totalFare = 0;

                    // Segment 1: Origin to Hub
                    const originStop = originRoute.stops.find(s =>
                        s.name === origin.name
                    );
                    const hubStop1 = originRoute.stops.find(s =>
                        s.name === transferHub.name
                    );

                    if (originStop && hubStop1 && originStop.name !== hubStop1.name) {
                        const route1Data = getVerifiedTransitLeg(originRoute, originStop, hubStop1);
                        if (!route1Data) continue;
                        const distance1 = route1Data.distance;
                        const fare1 = calculateFare(distance1, passengerType, originRoute.baseFare, originRoute.farePerKm);
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
                            geometryProvider: route1Data.source,
                            startSnapMeters: route1Data.startSnapMeters,
                            endSnapMeters: route1Data.endSnapMeters,
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
                        s.name === destination.name
                    );

                    if (hubStop2 && destStop && hubStop2.name !== destStop.name) {
                        const route2Data = getVerifiedTransitLeg(destRoute, hubStop2, destStop);
                        if (!route2Data) continue;
                        const distance2 = route2Data.distance;
                        const fare2 = calculateFare(distance2, passengerType, destRoute.baseFare, destRoute.farePerKm);
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
                            geometryProvider: route2Data.source,
                            startSnapMeters: route2Data.startSnapMeters,
                            endSnapMeters: route2Data.endSnapMeters,
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

                        routes.push({
                            routeId: `transfer-${originRoute.routeId}-${destRoute.routeId}`,
                            routeType: 'split',
                            routeName: `Via ${transferHub.displayName}`,
                            networkId: 'batangas-jeepney-network',
                            transportVerificationStatus: 'verified',
                            totalSegments: 2,
                            totalDistance,
                            totalDuration,
                            totalFare,
                            totalTransfers: 1,
                            comfortLevel: 'basic',
                            reliability: Math.min(originRoute.reliability, destRoute.reliability),
                            tags: routeTags,
                            originAccess: {
                                locationName: originInput.name,
                                lat: Number(originInput.lat),
                                lng: Number(originInput.lng),
                                stopName: originStop.name,
                                stopLat: originStop.lat,
                                stopLng: originStop.lng,
                                distanceKm: Number(nearestOriginStop.distanceKm.toFixed(2))
                            },
                            destinationAccess: {
                                locationName: destinationInput.name,
                                lat: Number(destinationInput.lat),
                                lng: Number(destinationInput.lng),
                                stopName: destStop.name,
                                stopLat: destStop.lat,
                                stopLng: destStop.lng,
                                distanceKm: Number(nearestDestinationStop.distanceKm.toFixed(2))
                            },
                            segments,
                            advantages: [
                                'Uses a source-verified transit corridor',
                                'Legitimate transfer hub',
                                'Commonly used by locals'
                            ],
                            disadvantages: [
                                'Kailangan mag-transfer once'
                            ],
                            recommendationReason: `Mag-transfer ka sa ${transferHub.displayName}, major hub yan ng commuters`,
                            isRealistic: true,
                            culturallyAccurate: true
                        });
                    }
                }
            }
        }

        return routes;
    } catch (error) {
        console.error('Error building route from jeepney network:', error);
        throw error;
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
        const networkRoutes = await buildRouteFromJeepneyNetwork(origin, destination, passengerType);
        routes.push(...networkRoutes);

        // If still no routes, return error
        if (routes.length === 0) {
            return {
                success: false,
                error: 'No verified BiyaHero route is currently available for this trip.',
                message: 'No source-verified transit stops or public transportation corridors are currently available. Candidate route records are excluded until their stop coordinates and service are verified.',
                suggestion: 'Use the selected place coordinates for a road-navigation app, or check again when verified Batangas transit data is available.',
                origin: serializePlace(origin),
                destination: serializePlace(destination)
            };
        }

        // Sort by preference
        const sortedRoutes = routes.sort((a, b) => {
            if (options.preference === 'cheapest') return a.totalFare - b.totalFare;
            if (options.preference === 'fastest') return a.totalDuration - b.totalDuration;
            if (options.preference === 'least_transfers') return a.totalTransfers - b.totalTransfers;
            return b.reliability - a.reliability || a.totalFare - b.totalFare;
        });
        sortedRoutes.forEach((route, index) => {
            route.recommended = index === 0;
        });

        return {
            success: true,
            origin: serializePlace(origin),
            destination: serializePlace(destination),
            passengerType,
            totalRoutes: sortedRoutes.length,
            routes: sortedRoutes,
            matchedLocations: {
                origin: sortedRoutes[0].originAccess,
                destination: sortedRoutes[0].destinationAccess
            },
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
