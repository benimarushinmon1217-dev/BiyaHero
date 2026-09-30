/**
 * Multi-Modal Routing Service
 * Realistic Philippine commuter transportation simulation
 * Generates multiple route options with transfers based on actual Lipa City routes
 */

import { TransportHub, TransportRoute } from '../models/index.js';
import { calculateFare } from '../utils/fareCalculator.js';
import { getRoute } from './routingService.js';
import { generateRealisticRoutes } from './realisticRoutingService.js';
import { KNOWN_PLACE_LOCATIONS } from '../../shared/knownPlaceLocations.js';
import {
    LIPA_JEEPNEY_ROUTES,
    LIPA_TRANSFER_HUBS,
    findDirectRoutes,
    findTransferPoints,
    findRoutesServingLocation
} from '../data/lipaRoutes.js';

/**
 * Transport type configurations
 */
const TRANSPORT_CONFIG = {
    jeepney: {
        baseFare: 12,
        farePerKm: 1,
        baseDistance: 5,
        avgSpeed: 25, // km/h
        avgWaitTime: 10, // minutes
        comfortLevel: 'basic',
        capacity: 20
    },
    tricycle: {
        baseFare: 15,
        farePerKm: 5,
        baseDistance: 2,
        avgSpeed: 20,
        avgWaitTime: 5,
        comfortLevel: 'basic',
        capacity: 4
    },
    bus: {
        baseFare: 30,
        farePerKm: 2,
        baseDistance: 10,
        avgSpeed: 40,
        avgWaitTime: 15,
        comfortLevel: 'comfortable',
        capacity: 50
    },
    uv_express: {
        baseFare: 40,
        farePerKm: 3,
        baseDistance: 10,
        avgSpeed: 50,
        avgWaitTime: 10,
        comfortLevel: 'premium',
        capacity: 12
    },
    van: {
        baseFare: 35,
        farePerKm: 2.5,
        baseDistance: 10,
        avgSpeed: 45,
        avgWaitTime: 12,
        comfortLevel: 'comfortable',
        capacity: 15
    },
    walking: {
        baseFare: 0,
        farePerKm: 0,
        baseDistance: 0,
        avgSpeed: 4,
        avgWaitTime: 0,
        comfortLevel: 'basic',
        capacity: 1
    }
};

/**
 * Major transport hubs in Batangas (hardcoded for now, will be from DB)
 */
const MAJOR_HUBS = [
    {
        id: 'hub-lipa-bayan',
        name: 'Lipa Bayan',
        displayName: 'Lipa City Center (Bayan)',
        lat: 13.9411,
        lng: 121.1650,
        importance: 10,
        availableTransport: ['jeepney', 'tricycle', 'bus', 'uv_express']
    },
    {
        id: 'hub-sm-lipa',
        name: 'SM Lipa',
        displayName: 'SM City Lipa',
        lat: KNOWN_PLACE_LOCATIONS.smCityLipa.latitude,
        lng: KNOWN_PLACE_LOCATIONS.smCityLipa.longitude,
        importance: 9,
        availableTransport: ['jeepney', 'tricycle', 'bus']
    },
    {
        id: 'hub-bsu',
        name: 'BSU Lipa',
        displayName: 'Batangas State University - Lipa',
        lat: 13.9450,
        lng: 121.1680,
        importance: 8,
        availableTransport: ['jeepney', 'tricycle']
    },
    {
        id: 'hub-lipa-cathedral',
        name: 'Lipa Cathedral',
        displayName: 'San Sebastian Cathedral',
        lat: 13.9405,
        lng: 121.1655,
        importance: 7,
        availableTransport: ['jeepney', 'tricycle']
    },
    {
        id: 'hub-robinson-lipa',
        name: 'Robinson Lipa',
        displayName: 'Robinsons Place Lipa',
        lat: 13.9370,
        lng: 121.1640,
        importance: 8,
        availableTransport: ['jeepney', 'tricycle']
    },
    {
        id: 'hub-big-ben',
        name: 'Big Ben Terminal',
        displayName: 'Big Ben Terminal Lipa',
        lat: 13.9420,
        lng: 121.1670,
        importance: 9,
        availableTransport: ['jeepney', 'bus', 'uv_express']
    },
    {
        id: 'hub-batangas-grand',
        name: 'Batangas Grand Terminal',
        displayName: 'Batangas City Grand Terminal',
        lat: 13.7565,
        lng: 121.0583,
        importance: 10,
        availableTransport: ['jeepney', 'bus', 'uv_express', 'van']
    }
];

/**
 * Calculate distance between two points (Haversine formula)
 */
const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

/**
 * Find nearest hub to a location
 */
const findNearestHub = (lat, lng, maxDistance = 5) => {
    let nearest = null;
    let minDistance = Infinity;

    for (const hub of MAJOR_HUBS) {
        const distance = calculateDistance(lat, lng, hub.lat, hub.lng);
        if (distance < minDistance && distance <= maxDistance) {
            minDistance = distance;
            nearest = { ...hub, distanceToHub: distance };
        }
    }

    return nearest;
};

/**
 * Calculate segment fare based on transport type and distance
 */
const calculateSegmentFare = (transportType, distance, passengerType = 'regular') => {
    const config = TRANSPORT_CONFIG[transportType];
    if (!config) return 0;

    let fare = config.baseFare;

    if (distance > config.baseDistance) {
        const additionalDistance = distance - config.baseDistance;
        fare += Math.round(additionalDistance) * config.farePerKm;
    }

    // Apply discount
    if (passengerType === 'student' || passengerType === 'senior' || passengerType === 'pwd') {
        fare = Math.round(fare * 0.8);
    }

    return fare;
};

/**
 * Calculate segment duration
 */
const calculateSegmentDuration = (transportType, distance) => {
    const config = TRANSPORT_CONFIG[transportType];
    if (!config) return 0;

    const travelTime = (distance / config.avgSpeed) * 60; // Convert to minutes
    return Math.round(travelTime + config.avgWaitTime);
};

/**
 * Generate direct route (single ride)
 */
const generateDirectRoute = async (origin, destination, passengerType = 'regular') => {
    try {
        // Get actual route from OSRM
        const routeData = await getRoute(
            { lat: origin.lat, lng: origin.lng },
            { lat: destination.lat, lng: destination.lng }
        );

        const distance = parseFloat(routeData.distance);
        const transportType = 'jeepney'; // Default to jeepney for direct routes

        const fare = calculateSegmentFare(transportType, distance, passengerType);
        const duration = calculateSegmentDuration(transportType, distance);

        return {
            routeId: 'direct-route',
            routeType: 'direct',
            routeName: 'Direct Route',
            totalSegments: 1,
            totalDistance: distance,
            totalDuration: duration,
            totalFare: fare,
            totalTransfers: 0,
            comfortLevel: 'basic',
            reliability: 8,
            segments: [
                {
                    segmentOrder: 1,
                    transportType,
                    originName: origin.name,
                    originLat: origin.lat,
                    originLng: origin.lng,
                    destinationName: destination.name,
                    destinationLat: destination.lat,
                    destinationLng: destination.lng,
                    distance,
                    duration,
                    fare,
                    waitTime: TRANSPORT_CONFIG[transportType].avgWaitTime,
                    transferTime: 0,
                    geometry: routeData.geometry,
                    instructions: `Take a ${transportType} from ${origin.name} to ${destination.name}`,
                    transferNotes: null
                }
            ],
            advantages: ['No transfers', 'Simple route', 'Cheapest option'],
            disadvantages: ['May take longer', 'Depends on jeepney availability']
        };
    } catch (error) {
        console.error('Error generating direct route:', error);
        return null;
    }
};

/**
 * Generate split route (via hub)
 */
const generateSplitRoute = async (origin, destination, viaHub, passengerType = 'regular') => {
    try {
        // Segment 1: Origin to Hub
        const route1 = await getRoute(
            { lat: origin.lat, lng: origin.lng },
            { lat: viaHub.lat, lng: viaHub.lng }
        );

        // Segment 2: Hub to Destination
        const route2 = await getRoute(
            { lat: viaHub.lat, lng: viaHub.lng },
            { lat: destination.lat, lng: destination.lng }
        );

        const distance1 = parseFloat(route1.distance);
        const distance2 = parseFloat(route2.distance);
        const totalDistance = distance1 + distance2;

        const transportType1 = 'jeepney';
        const transportType2 = 'jeepney';

        const fare1 = calculateSegmentFare(transportType1, distance1, passengerType);
        const fare2 = calculateSegmentFare(transportType2, distance2, passengerType);
        const totalFare = fare1 + fare2;

        const duration1 = calculateSegmentDuration(transportType1, distance1);
        const duration2 = calculateSegmentDuration(transportType2, distance2);
        const transferTime = 5; // 5 minutes transfer time
        const totalDuration = duration1 + duration2 + transferTime;

        return {
            routeId: `split-route-${viaHub.id}`,
            routeType: 'split',
            routeName: `Split Route via ${viaHub.displayName}`,
            totalSegments: 2,
            totalDistance,
            totalDuration,
            totalFare,
            totalTransfers: 1,
            comfortLevel: 'basic',
            reliability: 7,
            segments: [
                {
                    segmentOrder: 1,
                    transportType: transportType1,
                    originName: origin.name,
                    originLat: origin.lat,
                    originLng: origin.lng,
                    destinationName: viaHub.displayName,
                    destinationLat: viaHub.lat,
                    destinationLng: viaHub.lng,
                    distance: distance1,
                    duration: duration1,
                    fare: fare1,
                    waitTime: TRANSPORT_CONFIG[transportType1].avgWaitTime,
                    transferTime,
                    geometry: route1.geometry,
                    instructions: `Take a ${transportType1} from ${origin.name} to ${viaHub.displayName}`,
                    transferNotes: `Transfer at ${viaHub.displayName}. Look for ${transportType2} going to ${destination.name}`
                },
                {
                    segmentOrder: 2,
                    transportType: transportType2,
                    originName: viaHub.displayName,
                    originLat: viaHub.lat,
                    originLng: viaHub.lng,
                    destinationName: destination.name,
                    destinationLat: destination.lat,
                    destinationLng: destination.lng,
                    distance: distance2,
                    duration: duration2,
                    fare: fare2,
                    waitTime: TRANSPORT_CONFIG[transportType2].avgWaitTime,
                    transferTime: 0,
                    geometry: route2.geometry,
                    instructions: `Take a ${transportType2} from ${viaHub.displayName} to ${destination.name}`,
                    transferNotes: null
                }
            ],
            advantages: ['Faster travel time', 'More frequent vehicles', 'Better route coverage'],
            disadvantages: ['More expensive', 'Requires transfer', 'Waiting time at hub']
        };
    } catch (error) {
        console.error('Error generating split route:', error);
        return null;
    }
};

/**
 * Generate hybrid route (different transport types)
 */
const generateHybridRoute = async (origin, destination, viaHub, passengerType = 'regular') => {
    try {
        // Segment 1: Origin to Hub (Jeepney)
        const route1 = await getRoute(
            { lat: origin.lat, lng: origin.lng },
            { lat: viaHub.lat, lng: viaHub.lng }
        );

        // Segment 2: Hub to Destination (Tricycle for last mile)
        const route2 = await getRoute(
            { lat: viaHub.lat, lng: viaHub.lng },
            { lat: destination.lat, lng: destination.lng }
        );

        const distance1 = parseFloat(route1.distance);
        const distance2 = parseFloat(route2.distance);
        const totalDistance = distance1 + distance2;

        const transportType1 = 'jeepney';
        const transportType2 = distance2 < 3 ? 'tricycle' : 'jeepney'; // Use tricycle for short distances

        const fare1 = calculateSegmentFare(transportType1, distance1, passengerType);
        const fare2 = calculateSegmentFare(transportType2, distance2, passengerType);
        const totalFare = fare1 + fare2;

        const duration1 = calculateSegmentDuration(transportType1, distance1);
        const duration2 = calculateSegmentDuration(transportType2, distance2);
        const transferTime = 3; // 3 minutes transfer time
        const totalDuration = duration1 + duration2 + transferTime;

        return {
            routeId: `hybrid-route-${viaHub.id}`,
            routeType: 'hybrid',
            routeName: `Hybrid Route via ${viaHub.displayName}`,
            totalSegments: 2,
            totalDistance,
            totalDuration,
            totalFare,
            totalTransfers: 1,
            comfortLevel: 'standard',
            reliability: 8,
            segments: [
                {
                    segmentOrder: 1,
                    transportType: transportType1,
                    originName: origin.name,
                    originLat: origin.lat,
                    originLng: origin.lng,
                    destinationName: viaHub.displayName,
                    destinationLat: viaHub.lat,
                    destinationLng: viaHub.lng,
                    distance: distance1,
                    duration: duration1,
                    fare: fare1,
                    waitTime: TRANSPORT_CONFIG[transportType1].avgWaitTime,
                    transferTime,
                    geometry: route1.geometry,
                    instructions: `Take a ${transportType1} from ${origin.name} to ${viaHub.displayName}`,
                    transferNotes: `Transfer at ${viaHub.displayName}. Take a ${transportType2} for the last leg`
                },
                {
                    segmentOrder: 2,
                    transportType: transportType2,
                    originName: viaHub.displayName,
                    originLat: viaHub.lat,
                    originLng: viaHub.lng,
                    destinationName: destination.name,
                    destinationLat: destination.lat,
                    destinationLng: destination.lng,
                    distance: distance2,
                    duration: duration2,
                    fare: fare2,
                    waitTime: TRANSPORT_CONFIG[transportType2].avgWaitTime,
                    transferTime: 0,
                    geometry: route2.geometry,
                    instructions: `Take a ${transportType2} from ${viaHub.displayName} to ${destination.name}`,
                    transferNotes: null
                }
            ],
            advantages: ['Convenient last-mile transport', 'Less walking', 'Flexible'],
            disadvantages: ['More expensive than direct', 'Requires transfer']
        };
    } catch (error) {
        console.error('Error generating hybrid route:', error);
        return null;
    }
};

/**
 * Generate route using actual Lipa City jeepney routes
 */
const generateRealisticLipaRoute = async (origin, destination, passengerType = 'regular') => {
    try {
        // Check for direct routes first
        const directRoutes = findDirectRoutes(origin.name, destination.name);

        if (directRoutes.length > 0) {
            // Direct route available
            const route = directRoutes[0];
            const routeData = await getRoute(
                { lat: origin.lat, lng: origin.lng },
                { lat: destination.lat, lng: destination.lng }
            );

            const distance = parseFloat(routeData.distance);
            const fare = calculateSegmentFare('jeepney', distance, passengerType);
            const duration = calculateSegmentDuration('jeepney', distance);

            return {
                routeId: 'direct-lipa-route',
                routeType: 'direct',
                routeName: `Direct Route (${route.routeName})`,
                totalSegments: 1,
                totalDistance: distance,
                totalDuration: duration,
                totalFare: fare,
                totalTransfers: 0,
                comfortLevel: 'basic',
                reliability: 9,
                segments: [
                    {
                        segmentOrder: 1,
                        transportType: 'jeepney',
                        routeName: route.routeName,
                        originName: origin.name,
                        originLat: origin.lat,
                        originLng: origin.lng,
                        destinationName: destination.name,
                        destinationLat: destination.lat,
                        destinationLng: destination.lng,
                        distance,
                        duration,
                        fare,
                        waitTime: 5,
                        transferTime: 0,
                        geometry: routeData.geometry,
                        instructions: `Take ${route.routeName} jeepney from ${origin.name} to ${destination.name}`,
                        transferNotes: null
                    }
                ],
                advantages: ['Direct route', 'No transfers', 'Cheapest option'],
                disadvantages: ['May take longer than routes with transfers']
            };
        }

        // No direct route - find transfer points
        const transferPoints = findTransferPoints(origin.name, destination.name);

        if (transferPoints.length > 0) {
            // Use the best transfer hub (highest importance)
            const hub = transferPoints[0];

            // Segment 1: Origin to Hub
            const route1Data = await getRoute(
                { lat: origin.lat, lng: origin.lng },
                { lat: hub.lat, lng: hub.lng }
            );

            // Segment 2: Hub to Destination
            const route2Data = await getRoute(
                { lat: hub.lat, lng: hub.lng },
                { lat: destination.lat, lng: destination.lng }
            );

            const distance1 = parseFloat(route1Data.distance);
            const distance2 = parseFloat(route2Data.distance);
            const totalDistance = distance1 + distance2;

            const fare1 = calculateSegmentFare('jeepney', distance1, passengerType);
            const fare2 = calculateSegmentFare('jeepney', distance2, passengerType);
            const totalFare = fare1 + fare2;

            const duration1 = calculateSegmentDuration('jeepney', distance1);
            const duration2 = calculateSegmentDuration('jeepney', distance2);
            const transferTime = 5;
            const totalDuration = duration1 + duration2 + transferTime;

            return {
                routeId: `transfer-lipa-route-${hub.id}`,
                routeType: 'split',
                routeName: `Route via ${hub.displayName}`,
                totalSegments: 2,
                totalDistance,
                totalDuration,
                totalFare,
                totalTransfers: 1,
                comfortLevel: 'basic',
                reliability: 8,
                segments: [
                    {
                        segmentOrder: 1,
                        transportType: 'jeepney',
                        routeName: hub.originRoute,
                        originName: origin.name,
                        originLat: origin.lat,
                        originLng: origin.lng,
                        destinationName: hub.displayName,
                        destinationLat: hub.lat,
                        destinationLng: hub.lng,
                        distance: distance1,
                        duration: duration1,
                        fare: fare1,
                        waitTime: 5,
                        transferTime,
                        geometry: route1Data.geometry,
                        instructions: `Take ${hub.originRoute} jeepney from ${origin.name} to ${hub.displayName}`,
                        transferNotes: `Transfer at ${hub.displayName}. ${hub.description} Look for jeepney going to ${destination.name}.`
                    },
                    {
                        segmentOrder: 2,
                        transportType: 'jeepney',
                        routeName: hub.destinationRoute,
                        originName: hub.displayName,
                        originLat: hub.lat,
                        originLng: hub.lng,
                        destinationName: destination.name,
                        destinationLat: destination.lat,
                        destinationLng: destination.lng,
                        distance: distance2,
                        duration: duration2,
                        fare: fare2,
                        waitTime: 5,
                        transferTime: 0,
                        geometry: route2Data.geometry,
                        instructions: `Take ${hub.destinationRoute} jeepney from ${hub.displayName} to ${destination.name}`,
                        transferNotes: null
                    }
                ],
                advantages: ['Follows actual jeepney routes', 'Reliable transfer point', 'Frequent jeepneys'],
                disadvantages: ['Requires one transfer', 'Slightly more expensive']
            };
        }

        return null;
    } catch (error) {
        console.error('Error generating realistic Lipa route:', error);
        return null;
    }
};

/**
 * Main function: Generate multiple commute options
 */
export const generateMultiModalRoutes = async (origin, destination, passengerType = 'regular', options = {}) => {
    return generateRealisticRoutes(origin, destination, passengerType, options);
};

export default {
    generateMultiModalRoutes,
    calculateSegmentFare,
    calculateSegmentDuration,
    TRANSPORT_CONFIG,
    MAJOR_HUBS
};
