import { BATANGAS_JEEPNEY_ROUTES, isVerifiedJeepneyRoute } from '../data/batangasJeepneyRoutes.js';
import { BATANGAS_TRANSPORT_HUBS, isVerifiedTransportHub } from '../data/batangasTransportNetwork.js';
import { buildRoutePlan } from './routePlanningService.js';
import { getBatangasScopeMessage, isWithinBatangasScope } from './geographicScopeService.js';

const normalize = value => String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const getKnownPlaces = () => {
    const known = new Map();
    for (const route of Object.values(BATANGAS_JEEPNEY_ROUTES)) {
        if (!isVerifiedJeepneyRoute(route)) continue;
        for (const stop of route.stops) known.set(normalize(stop.name), stop);
    }
    for (const hub of Object.values(BATANGAS_TRANSPORT_HUBS)) {
        if (!isVerifiedTransportHub(hub)) continue;
        known.set(normalize(hub.name), hub);
        for (const alias of hub.aliases || []) known.set(normalize(alias), hub);
    }
    return [...known.values()];
};

const resolvePlace = (value, knownPlaces) => {
    const query = normalize(value);
    if (!query) return null;
    return knownPlaces
        .filter(place => {
            const names = [place.name || place.displayName, ...(place.aliases || [])].map(normalize);
            return names.some(name => name && (query.includes(name) || name.includes(query)));
        })
        .sort((a, b) => Math.max(...[b.name || b.displayName, ...(b.aliases || [])].map(name => normalize(name).length))
            - Math.max(...[a.name || a.displayName, ...(a.aliases || [])].map(name => normalize(name).length)))[0] || null;
};

const placeResult = place => ({
    name: place.name || place.displayName,
    lat: Number(place.lat),
    lng: Number(place.lng),
    municipality: place.municipality || '',
    province: 'Batangas'
});

const routeDestination = (message, knownPlaces) => {
    const normalizedMessage = normalize(message);
    return knownPlaces
        .filter(place => {
            const names = [place.name || place.displayName, ...(place.aliases || [])].map(normalize);
            return names.some(name => name.length > 2 && normalizedMessage.includes(name));
        })
        .sort((a, b) => Math.max(...[b.name || b.displayName, ...(b.aliases || [])].map(name => normalize(name).length))
            - Math.max(...[a.name || a.displayName, ...(a.aliases || [])].map(name => normalize(name).length)))[0] || null;
};

const hasCoordinates = place => {
    const lat = place?.lat ?? place?.latitude;
    const lng = place?.lng ?? place?.longitude;
    return lat != null && lng != null &&
        Number.isFinite(Number(lat)) && Number.isFinite(Number(lng));
};

const placeCoordinates = place => ({
    lat: Number(place.lat ?? place.latitude),
    lng: Number(place.lng ?? place.longitude)
});

const validatedContextPlace = (place, knownPlaces) => {
    const resolvedPlace = place && typeof place === 'object'
        ? place
        : resolvePlace(place, knownPlaces);
    if (!resolvedPlace || !hasCoordinates(resolvedPlace) || !isWithinBatangasScope(resolvedPlace)) return null;
    const coordinates = placeCoordinates(resolvedPlace);
    return {
        name: String(resolvedPlace.name || resolvedPlace.displayName || ''),
        ...coordinates,
        municipality: resolvedPlace.municipality || '',
        province: resolvedPlace.province || 'Batangas'
    };
};

const savedRouteContext = (routeContext, knownPlaces) => {
    if (!routeContext) return null;
    const origin = validatedContextPlace(routeContext.origin || routeContext.originName, knownPlaces);
    const destination = validatedContextPlace(routeContext.destination || routeContext.destinationName, knownPlaces);
    return origin && destination ? { origin, destination } : null;
};

const routeIntentPattern = /\b(route|commut(?:e|ing)|sakay|biyahe|travel|go to|get to|how (?:do|can) i get|paano (?:pumunta|magpunta)|papunt(?:a|ang)|from .+ to|may (?:jeep|bus|van)|where can i (?:ride|board))\b/i;
const preferenceIntent = message => {
    const normalized = normalize(message);
    if (/\b(cheaper|cheapest|less expensive|mas mura|pinakamura)\b/.test(normalized)) return 'cheapest';
    if (/\b(faster|fastest|quickest|mas mabilis|pinakamabilis)\b/.test(normalized)) return 'fastest';
    if (/\b(fewer|less|least) transfers?\b/.test(normalized) ||
        /\b(konti(?:ng)?|kaunting|pinakakonti|pinakakaunti|pinakakaunting) lipat\b/.test(normalized)) return 'least_transfers';
    return null;
};

const haversineKm = (from, to) => {
    const radians = degrees => degrees * Math.PI / 180;
    const fromCoordinates = placeCoordinates(from);
    const toCoordinates = placeCoordinates(to);
    const dLat = radians(toCoordinates.lat - fromCoordinates.lat);
    const dLng = radians(toCoordinates.lng - fromCoordinates.lng);
    const a = Math.sin(dLat / 2) ** 2
        + Math.cos(radians(fromCoordinates.lat)) * Math.cos(radians(toCoordinates.lat)) * Math.sin(dLng / 2) ** 2;
    return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const generateResponse = async (message, context = {}) => {
    const knownPlaces = getKnownPlaces();
    const originMatch = message.match(/\b(?:from|galing sa)\s+(.+?)\s+(?:to|papunta sa|hanggang)\s+(.+?)(?:[?.!]|$)/i);
    const activeLocation = context.activeLocation || null;
    const savedHome = context.savedHome || null;
    const fallbackLocation = activeLocation || savedHome;
    const contextOrigin = validatedContextPlace(context.originPlace, knownPlaces);
    const contextDestination = validatedContextPlace(context.destinationPlace, knownPlaces);
    const fromText = originMatch?.[1] || contextOrigin?.name || fallbackLocation?.name || '';
    const resolvedOrigin = contextOrigin || resolvePlace(fromText, knownPlaces);
    const originPlace = resolvedOrigin || (originMatch && fallbackLocation &&
        normalize(fromText) === normalize(fallbackLocation.name) &&
        hasCoordinates(fallbackLocation) ? fallbackLocation : null);
    const requestedDestination = originMatch ? originMatch[2] : message;
    const resolvedDestination = originMatch
        ? resolvePlace(requestedDestination, knownPlaces)
        : routeDestination(message, knownPlaces);
    const refersToSavedHome = Boolean(savedHome && (
        normalize(requestedDestination).includes(normalize(savedHome.name)) ||
        /\b(my|the|saved) home\b/i.test(requestedDestination) ||
        /\b(?:get|go|travel|commute)(?:\s+to)?\s+home\b|\b(?:pumunta|umuwi|makauwi|makakauwi)\b/i.test(requestedDestination)
    ));
    const destinationPlace = contextDestination || resolvedDestination || (refersToSavedHome ? savedHome : null);
    const normalizedMessage = normalize(message);
    const previousRoute = savedRouteContext(context.routeContext, knownPlaces);
    const routeFollowUpQuestion = (
        /\b(fare|pamasahe|magkano|cost|how much|how long|duration|time|tagal|transfer|lipat|cheaper|cheapest|faster|fastest|quickest|mura|bilis)\b/i.test(message)
    );
    const hasRouteContext = Boolean(context.routeContext?.originName && context.routeContext?.destinationName);
    const isRouteFollowUp = hasRouteContext && routeFollowUpQuestion;
    const usualFareQuestion = /\b(usual|regular|usual commute|usual trip)\b/i.test(message) &&
        /\b(fare|how much|cost|pamasahe|magkano)\b/i.test(message);

    if (usualFareQuestion && Array.isArray(context.recentTrips) && context.recentTrips.length > 0) {
        const groupedTrips = new Map();
        for (const trip of context.recentTrips) {
            if (!trip.originName || !trip.destinationName || !Number.isFinite(Number(trip.fare))) continue;
            const key = `${normalize(trip.originName)}→${normalize(trip.destinationName)}`;
            const existing = groupedTrips.get(key) || { trip, count: 0, latestDate: 0 };
            const tripDate = new Date(trip.tripDate || 0).getTime();
            existing.count += 1;
            if (tripDate >= existing.latestDate) {
                existing.trip = trip;
                existing.latestDate = tripDate;
            }
            groupedTrips.set(key, existing);
        }
        const usualTrip = [...groupedTrips.values()].sort((first, second) =>
            second.count - first.count || second.latestDate - first.latestDate
        )[0];
        if (usualTrip) {
            const { trip, count } = usualTrip;
            const fare = Number(trip.fare);
            const frequency = count > 1 ? ` This is your most frequently recorded trip (${count} records).` : '';
            const date = trip.tripDate ? new Date(trip.tripDate).toLocaleDateString() : 'a previous trip';
            return {
                response: `Your most recent recorded fare for ${trip.originName} to ${trip.destinationName} was ₱${fare.toFixed(2)} (${date}).${frequency} This is the fare you reported, not a live fare estimate.`,
                responseType: 'fare-history'
            };
        }
    }

    if (isRouteFollowUp && !previousRoute) {
        return {
            response: 'I can no longer match that previous trip to verified BiyaHero locations. Ask me for the route again and I will check current verified data.',
            responseType: 'unavailable',
            clearRouteContext: true
        };
    }

    const routeOrigin = originMatch
        ? originPlace
        : (isRouteFollowUp ? previousRoute.origin : null) ||
            (originPlace ||
            (hasCoordinates(fallbackLocation) ? fallbackLocation : null));
    const routeDestinationPlace = originMatch
        ? destinationPlace
        : (destinationPlace || (isRouteFollowUp ? previousRoute.destination : null));
    const commuteIntent = Boolean(originMatch || routeIntentPattern.test(message) ||
        preferenceIntent(message) || isRouteFollowUp ||
        (destinationPlace && routeOrigin));

    if (normalizedMessage.includes('nearest transport hub') ||
        normalizedMessage.includes('nearest terminal') ||
        /\bwhere can i (?:ride|board)|\bwhere do i (?:ride|board)|\bsaan ako sasakay\b|\bsaan puwede(?:ng)? sumakay\b/i.test(message)) {
        const active = activeLocation || savedHome;
        if (!active || !isWithinBatangasScope(active)) {
            return { response: `Set a verified Batangas location first, or save your home location. ${getBatangasScopeMessage()}`, responseType: 'location' };
        }
        if (!hasCoordinates(active)) {
            return {
                response: 'I need the coordinates of your active or saved-home location to calculate the nearest listed transport hub.',
                responseType: 'location'
            };
        }
        const nearest = Object.values(BATANGAS_TRANSPORT_HUBS)
            .filter(isVerifiedTransportHub)
            .map(hub => ({ hub, distance: haversineKm(active, hub) }))
            .sort((a, b) => a.distance - b.distance)[0];
        return {
            response: nearest
                ? `The closest listed BiyaHero transport hub to ${active.name || 'your location'} is ${nearest.hub.displayName} (${nearest.distance.toFixed(1)} km straight-line distance).`
                : 'No verified transport hub is listed near your active location.',
            responseType: 'hub'
        };
    }

    if (commuteIntent && routeDestinationPlace && routeOrigin) {
        const origin = hasCoordinates(routeOrigin)
            ? (routeOrigin === originPlace ? placeResult(originPlace) : {
                name: routeOrigin.name || routeOrigin.displayName,
                ...placeCoordinates(routeOrigin),
                municipality: routeOrigin.municipality || '',
                province: routeOrigin.province || 'Batangas'
            })
            : placeResult(routeOrigin);
        const destination = placeResult(routeDestinationPlace);
        if (!isWithinBatangasScope(origin) || !isWithinBatangasScope(destination)) {
            return { response: getBatangasScopeMessage(), responseType: 'scope' };
        }
        if (normalize(origin.name) === normalize(destination.name)) {
            return {
                response: `Nasa ${destination.name} ka na ngayon. I can help you find another verified Batangas destination.`,
                responseType: 'same-location',
                clearRouteContext: true
            };
        }

        try {
            const requestedPreference = preferenceIntent(message);
            const requestedRoutePreference = requestedPreference || (isRouteFollowUp
                ? context.routeContext?.preference
                : null) || context.preference || 'recommended';
            const routePreference = ['recommended', 'cheapest', 'fastest', 'least_transfers']
                .includes(requestedRoutePreference) ? requestedRoutePreference : 'recommended';
            const routePlanner = context.routePlanner || buildRoutePlan;
            const plan = await routePlanner({
                origin,
                destination,
                passengerType: context.passengerType || 'regular',
                preference: routePreference
            });
            const route = plan.publicTransit.routes[0];
            const routeContext = {
                origin,
                destination,
                preference: routePreference
            };
            if (!route) {
                const roadReference = plan.road.status === 'available'
                    ? ` A road-driving reference is ${plan.road.distanceKm.toFixed(1)} km and about ${plan.road.durationMinutes} minutes; it is not a public-transit itinerary and has no transit fare estimate.`
                    : '';
                return {
                    response: `${plan.publicTransit.reason || 'No verified BiyaHero public-transit itinerary is currently available.'}${roadReference}`,
                    responseType: 'unsupported-route',
                    ...(plan.road.status === 'available' ? { routeContext } : { clearRouteContext: true })
                };
            }
            const segments = route.segments.map((segment, index) =>
                `${index + 1}. ${segment.transportType}: ${segment.originName} to ${segment.destinationName} (₱${segment.fare})`
            ).join('\n');
            return {
                response: `${route.routeName}\nEstimated total fare: ₱${route.totalFare}\nEstimated duration: ${route.totalDuration} minutes\nTransfers: ${route.totalTransfers}\n${segments}\n\nThis guidance uses the verified BiyaHero transport network.`,
                responseType: 'route',
                route,
                routeContext
            };
        } catch (error) {
            console.error('Grounded assistant route lookup failed:', error.message || error.name);
            return {
                response: 'Verified route information is temporarily unavailable. Please try route search again shortly.',
                responseType: 'unavailable',
                clearRouteContext: true
            };
        }
    }

    if (commuteIntent && routeDestinationPlace && !routeOrigin) {
        const active = activeLocation || savedHome;
        if (active && !isWithinBatangasScope(active)) {
            return { response: getBatangasScopeMessage(), responseType: 'scope' };
        }
        if (active && normalize(active.name) === normalize(routeDestinationPlace.name || routeDestinationPlace.displayName)) {
            return { response: `Nasa ${routeDestinationPlace.name || routeDestinationPlace.displayName} ka na ngayon.`, responseType: 'same-location' };
        }
        return {
            response: active
                ? 'I could not match your active or saved-home location to a verified stop. Select an origin from route search so I can check the network.'
                : 'Tell me your Batangas starting point or set your current location in route search first. I will only suggest routes verified in BiyaHero.',
            responseType: 'location-needed'
        };
    }

    if (normalizedMessage.includes('fare') || normalizedMessage.includes('pamasahe') || normalizedMessage.includes('magkano')) {
        return {
            response: 'I can estimate fares only for a verified BiyaHero route. Please include an origin and destination (for example, “Magkano from Lipa Cathedral to SM City Lipa?”).',
            responseType: 'fare'
        };
    }

    if (normalizedMessage.includes('transfer') || normalizedMessage.includes('lipat') || normalizedMessage.includes('saan ako sasakay')) {
        return {
            response: 'Share your active location and destination. I will list boarding and transfer details only when they are present in the verified route network.',
            responseType: 'transfer'
        };
    }

    if (commuteIntent) {
        return {
            response: 'I could not match that trip to verified Batangas locations. Please name a verified destination and, if needed, an origin; I will only report routes returned by BiyaHero route search.',
            responseType: 'location-needed'
        };
    }

    return {
        response: 'I can help with verified BiyaHero routes, fares, transfer points, and listed transport hubs in Batangas. Ask about a destination or provide an origin and destination; I will not guess unsupported routes.',
        responseType: 'general'
    };
};

export const getContextualSuggestions = (activeLocation, savedHome) => {
    const effectiveLocation = activeLocation || savedHome;
    const locationName = normalize(effectiveLocation?.name);
    const currentPlace = resolvePlace(effectiveLocation?.name, getKnownPlaces());
    const servingRoutes = Object.values(BATANGAS_JEEPNEY_ROUTES).filter(route =>
        isVerifiedJeepneyRoute(route) &&
        route.stops.some(stop => {
            const stopName = normalize(stop.name);
            return stopName && (locationName.includes(stopName) || stopName.includes(locationName));
        })
    );
    const destinations = new Map();
    for (const route of servingRoutes) {
        for (const stop of route.stops) {
            if (normalize(stop.name) !== locationName &&
                normalize(stop.name) !== normalize(currentPlace?.name)) {
                destinations.set(normalize(stop.name), stop);
            }
        }
    }
    const destinationPrompts = [...destinations.values()].slice(0, 3).map(stop =>
        `Paano pumunta sa ${stop.name}?`
    );
    return [
        ...(activeLocation && savedHome &&
            normalize(activeLocation.name) !== normalize(savedHome.name)
            ? [`How do I commute from ${activeLocation.name} to my saved home (${savedHome.name})?`]
            : []),
        ...(destinationPrompts.length
            ? destinationPrompts
            : [effectiveLocation
                ? `May verified route mula ${effectiveLocation.name}?`
                : 'Set my current location or save your home for route help']),
        'Nasaan ang pinakamalapit na transport hub?',
        'Magkano ang pamasahe sa verified route?'
    ];
};

export default { generateResponse, getContextualSuggestions };
