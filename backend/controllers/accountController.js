import { User, SavedPlace, TripHistory } from '../models/index.js';
import { BATANGAS_TRANSPORT_HUBS, isVerifiedTransportHub } from '../data/batangasTransportNetwork.js';
import { BATANGAS_JEEPNEY_ROUTES, isVerifiedJeepneyRoute } from '../data/batangasJeepneyRoutes.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
    getBatangasScopeMessage,
    isBatangasMunicipality,
    isWithinBatangasScope
} from '../services/geographicScopeService.js';
import { evaluateAchievements } from '../services/achievementService.js';
import { generateResponse, getContextualSuggestions } from '../services/aiAssistantService.js';
import { generateRealisticRoutes } from '../services/realisticRoutingService.js';

const VALID_PLACE_LABELS = ['home', 'work', 'school', 'favorite', 'custom'];
const VALID_PASSENGER_TYPES = ['regular', 'student', 'senior', 'pwd'];
const VALID_ROUTE_PREFERENCES = ['recommended', 'cheapest', 'fastest', 'least_transfers'];

const toNumber = value => Number(value || 0);
const publicTrip = trip => ({
    ...trip.toJSON(),
    fare: toNumber(trip.fare),
    baselineFare: trip.baselineFare == null ? null : toNumber(trip.baselineFare),
    savings: trip.baselineFare == null ? 0 : Math.max(0, toNumber(trip.baselineFare) - toNumber(trip.fare))
});

const validateTripInput = body => {
    const { originName, destinationName, originMunicipality, destinationMunicipality } = body;
    if (!String(originName || '').trim() || !String(destinationName || '').trim()) {
        throw new ApiError(400, 'Origin and destination are required');
    }
    if (String(originName).length > 120 || String(destinationName).length > 120) {
        throw new ApiError(400, 'Origin and destination names must be 120 characters or fewer');
    }
    if (!isBatangasMunicipality(originMunicipality) || !isBatangasMunicipality(destinationMunicipality)) {
        throw new ApiError(400, getBatangasScopeMessage());
    }

    const originHasCoordinates = body.originLat != null || body.originLng != null;
    const destinationHasCoordinates = body.destinationLat != null || body.destinationLng != null;
    if (originHasCoordinates && !isWithinBatangasScope({
        lat: body.originLat, lng: body.originLng, municipality: originMunicipality, province: 'Batangas'
    })) {
        throw new ApiError(400, `Origin is outside the supported area. ${getBatangasScopeMessage()}`);
    }
    if (destinationHasCoordinates && !isWithinBatangasScope({
        lat: body.destinationLat, lng: body.destinationLng, municipality: destinationMunicipality, province: 'Batangas'
    })) {
        throw new ApiError(400, `Destination is outside the supported area. ${getBatangasScopeMessage()}`);
    }

    const fare = Number(body.fare);
    if (!Number.isFinite(fare) || fare < 0) throw new ApiError(400, 'Fare must be a non-negative amount');
    if (body.baselineFare != null && (!Number.isFinite(Number(body.baselineFare)) || Number(body.baselineFare) < fare)) {
        throw new ApiError(400, 'Baseline fare must be greater than or equal to the recorded fare');
    }
    if (body.distance != null && (!Number.isFinite(Number(body.distance)) || Number(body.distance) < 0)) {
        throw new ApiError(400, 'Distance must be a non-negative number');
    }
    if (body.duration != null && (!Number.isInteger(Number(body.duration)) || Number(body.duration) < 0)) {
        throw new ApiError(400, 'Duration must be a non-negative whole number');
    }
    if (body.transfers != null && (!Number.isInteger(Number(body.transfers)) || Number(body.transfers) < 0)) {
        throw new ApiError(400, 'Transfer count must be a non-negative whole number');
    }
    const tripDate = new Date(body.tripDate || Date.now());
    if (Number.isNaN(tripDate.getTime()) || tripDate.getTime() > Date.now() + 5 * 60 * 1000) {
        throw new ApiError(400, 'Trip date must be valid and cannot be in the future');
    }
    if (body.passengerType && !VALID_PASSENGER_TYPES.includes(body.passengerType)) {
        throw new ApiError(400, 'Invalid passenger type');
    }
    if (body.source !== 'route' && !['jeepney', 'tricycle', 'bus', 'uv_express', 'van', 'walking'].includes(body.transportType)) {
        throw new ApiError(400, 'Invalid transport type');
    }
};

const getTripsForUser = userId => TripHistory.findAll({
    where: { userId },
    order: [['tripDate', 'DESC']]
});
const getRecentTripsForUser = userId => TripHistory.findAll({
    where: { userId },
    order: [['tripDate', 'DESC']],
    limit: 20
});

export const getProfile = asyncHandler(async (req, res) => {
    const [user, trips, savedPlaces] = await Promise.all([
        User.findByPk(req.userId),
        getTripsForUser(req.userId),
        SavedPlace.findAll({ where: { userId: req.userId }, order: [['label', 'ASC'], ['name', 'ASC']] })
    ]);
    if (!user) throw new ApiError(404, 'User not found');

    const totalSpent = trips.reduce((sum, trip) => sum + toNumber(trip.fare), 0);
    const totalSavings = trips.reduce((sum, trip) => {
        if (trip.baselineFare == null) return sum;
        return sum + Math.max(0, toNumber(trip.baselineFare) - toNumber(trip.fare));
    }, 0);
    const modeCounts = new Map();
    for (const trip of trips) {
        for (const segment of (Array.isArray(trip.segments) ? trip.segments : [])) {
            if (segment.transportType) {
                modeCounts.set(segment.transportType, (modeCounts.get(segment.transportType) || 0) + 1);
            }
        }
        if (!trip.segments?.length && trip.transportType) {
            modeCounts.set(trip.transportType, (modeCounts.get(trip.transportType) || 0) + 1);
        }
    }
    const mostUsedTransportType = [...modeCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    ApiResponse.success(res, {
        user: user.toJSON(),
        preferences: {
            passengerType: user.passengerType,
            routePreference: user.routePreference
        },
        savedPlaces,
        trips: trips.slice(0, 20).map(publicTrip),
        statistics: {
            totalTrips: trips.length,
            totalSpent: Number(totalSpent.toFixed(2)),
            totalSavings: Number(totalSavings.toFixed(2)),
            averageFare: trips.length ? Number((totalSpent / trips.length).toFixed(2)) : 0,
            mostUsedTransportType
        },
        achievements: evaluateAchievements(trips)
    });
});

export const updatePreferences = asyncHandler(async (req, res) => {
    const { passengerType, routePreference } = req.body;
    if (passengerType && !VALID_PASSENGER_TYPES.includes(passengerType)) {
        throw new ApiError(400, 'Invalid passenger type');
    }
    if (routePreference && !VALID_ROUTE_PREFERENCES.includes(routePreference)) {
        throw new ApiError(400, 'Invalid route preference');
    }
    const user = await User.findByPk(req.userId);
    if (!user) throw new ApiError(404, 'User not found');
    await user.update({
        ...(passengerType && { passengerType }),
        ...(routePreference && { routePreference })
    });
    ApiResponse.success(res, {
        passengerType: user.passengerType,
        routePreference: user.routePreference
    }, 'Preferences updated successfully');
});

export const getSavedPlaces = asyncHandler(async (req, res) => {
    const places = await SavedPlace.findAll({
        where: { userId: req.userId },
        order: [['label', 'ASC'], ['name', 'ASC']]
    });
    ApiResponse.success(res, { places });
});

export const createSavedPlace = asyncHandler(async (req, res) => {
    const { name, label = 'favorite', lat, lng, formattedAddress, barangay, municipality, province = 'Batangas' } = req.body;
    if (!String(name || '').trim()) throw new ApiError(400, 'Place name is required');
    if (String(name).trim().length > 120 || String(formattedAddress || '').length > 255) {
        throw new ApiError(400, 'Saved place name or address is too long');
    }
    if (!VALID_PLACE_LABELS.includes(label)) throw new ApiError(400, 'Invalid saved place label');
    if (!isWithinBatangasScope({ lat, lng, municipality, province })) {
        throw new ApiError(400, getBatangasScopeMessage());
    }

    const duplicate = await SavedPlace.findOne({
        where: {
            userId: req.userId,
            label,
            ...(label === 'home' || label === 'work' || label === 'school' ? {} : { name: name.trim() })
        }
    });
    if (duplicate) {
        await duplicate.update({ name: name.trim(), lat, lng, formattedAddress, barangay, municipality, province });
        ApiResponse.success(res, { place: duplicate }, 'Saved place updated successfully');
        return;
    }

    const place = await SavedPlace.create({
        userId: req.userId,
        name: name.trim(),
        label,
        lat,
        lng,
        formattedAddress,
        barangay,
        municipality,
        province
    });
    ApiResponse.created(res, { place }, 'Place saved successfully');
});

export const updateSavedPlace = asyncHandler(async (req, res) => {
    const place = await SavedPlace.findOne({ where: { id: req.params.id, userId: req.userId } });
    if (!place) throw new ApiError(404, 'Saved place not found');

    const updated = { ...req.body };
    if (updated.label && !VALID_PLACE_LABELS.includes(updated.label)) throw new ApiError(400, 'Invalid saved place label');
    const candidate = { ...place.toJSON(), ...updated };
    if (!isWithinBatangasScope(candidate)) throw new ApiError(400, getBatangasScopeMessage());
    delete updated.userId;
    delete updated.id;
    await place.update(updated);
    ApiResponse.success(res, { place }, 'Saved place updated successfully');
});

export const deleteSavedPlace = asyncHandler(async (req, res) => {
    const deleted = await SavedPlace.destroy({ where: { id: req.params.id, userId: req.userId } });
    if (!deleted) throw new ApiError(404, 'Saved place not found');
    ApiResponse.success(res, null, 'Saved place deleted successfully');
});

export const getTrips = asyncHandler(async (req, res) => {
    const trips = await getTripsForUser(req.userId);
    ApiResponse.success(res, { trips: trips.map(publicTrip) });
});

export const createTrip = asyncHandler(async (req, res) => {
    validateTripInput(req.body);
    const {
        originName, originLat = null, originLng = null, originMunicipality,
        destinationName, destinationLat = null, destinationLng = null, destinationMunicipality,
        distance = null, fare, passengerType = req.user.passengerType || 'regular',
        transportType = null, duration = null, tripDate = new Date(), routeId = null,
        segments = [], transfers = 0, baselineFare = null, source = 'expense'
    } = req.body;
    if (!Array.isArray(segments) || !['route', 'expense'].includes(source)) {
        throw new ApiError(400, 'Invalid trip details');
    }
    let verifiedRoute = null;
    if (source === 'route') {
        if (!routeId || originLat == null || originLng == null || destinationLat == null || destinationLng == null) {
            throw new ApiError(400, 'A verified route selection is required to record route history');
        }
        try {
            const routeResult = await generateRealisticRoutes(
                { name: String(originName).trim(), lat: Number(originLat), lng: Number(originLng), municipality: originMunicipality, province: 'Batangas' },
                { name: String(destinationName).trim(), lat: Number(destinationLat), lng: Number(destinationLng), municipality: destinationMunicipality, province: 'Batangas' },
                passengerType,
                { preference: req.user.routePreference }
            );
            verifiedRoute = routeResult.success
                ? routeResult.routes.find(route => route.routeId === routeId) || null
                : null;
        } catch (error) {
            console.error('Trip route verification failed:', error.message || error.name);
            throw new ApiError(503, 'Verified route data is temporarily unavailable. Please try recording this trip again.');
        }
        if (!verifiedRoute) {
            throw new ApiError(400, 'This route is not currently verified in BiyaHero’s transportation network');
        }
    }
    const trip = await TripHistory.create({
        userId: req.userId,
        originName: String(originName).trim(),
        originLat,
        originLng,
        originMunicipality,
        destinationName: String(destinationName).trim(),
        destinationLat,
        destinationLng,
        destinationMunicipality,
        distance: verifiedRoute ? verifiedRoute.totalDistance : distance,
        fare,
        baselineFare,
        passengerType,
        transportType: verifiedRoute
            ? [...new Set(verifiedRoute.segments.map(segment => segment.transportType))].join(', ')
            : transportType,
        duration: verifiedRoute ? verifiedRoute.totalDuration : duration,
        tripDate,
        routeId,
        segments: verifiedRoute
            ? verifiedRoute.segments
            : [{ transportType, fare: Number(fare) }],
        transfers: verifiedRoute ? verifiedRoute.totalTransfers : transfers,
        source
    });
    ApiResponse.created(res, { trip: publicTrip(trip) }, 'Trip recorded successfully');
});

export const updateTrip = asyncHandler(async (req, res) => {
    const trip = await TripHistory.findOne({ where: { id: req.params.id, userId: req.userId } });
    if (!trip) throw new ApiError(404, 'Trip not found');
    if (trip.source !== 'expense') {
        throw new ApiError(400, 'Completed route records cannot be edited; delete the record and add it again if needed');
    }
    validateTripInput({ ...trip.toJSON(), ...req.body });
    const updated = { ...req.body };
    delete updated.userId;
    delete updated.id;
    if (updated.source && updated.source !== 'expense') {
        throw new ApiError(400, 'Only fare records can be edited');
    }
    await trip.update(updated);
    ApiResponse.success(res, { trip: publicTrip(trip) }, 'Trip updated successfully');
});

export const deleteTrip = asyncHandler(async (req, res) => {
    const deleted = await TripHistory.destroy({ where: { id: req.params.id, userId: req.userId } });
    if (!deleted) throw new ApiError(404, 'Trip not found');
    ApiResponse.success(res, null, 'Trip deleted successfully');
});

export const getAchievements = asyncHandler(async (req, res) => {
    const trips = await getTripsForUser(req.userId);
    ApiResponse.success(res, { achievements: evaluateAchievements(trips) });
});

export const getPlaces = asyncHandler(async (req, res) => {
    const stops = new Map();
    for (const route of Object.values(BATANGAS_JEEPNEY_ROUTES)) {
        if (!isVerifiedJeepneyRoute(route)) continue;
        for (const stop of route.stops) {
            const key = stop.name.trim().toLowerCase();
            if (!stops.has(key)) stops.set(key, { ...stop, routeMunicipality: route.municipality });
        }
    }
    const hubEntries = Object.values(BATANGAS_TRANSPORT_HUBS)
        .filter(isVerifiedTransportHub);
    const places = [...stops.values()].map(stop => {
        const hub = hubEntries.find(candidate =>
            candidate.name.toLowerCase() === stop.name.toLowerCase() ||
            (candidate.aliases || []).some(alias => alias.toLowerCase() === stop.name.toLowerCase())
        );
        const id = stop.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        return {
            id,
            name: stop.name,
            category: hub?.type || (stop.isTerminal ? 'terminal' : 'landmark'),
            lat: stop.lat,
            lng: stop.lng,
            municipality: hub?.municipality || (stop.routeMunicipality === 'Inter-City' ? '' : stop.routeMunicipality),
            province: 'Batangas',
            verified: true
        };
    }).sort((a, b) => a.name.localeCompare(b.name));
    ApiResponse.success(res, { places });
});

export const getPlace = asyncHandler(async (req, res) => {
    const place = Object.values(BATANGAS_JEEPNEY_ROUTES)
        .filter(isVerifiedJeepneyRoute)
        .flatMap(route => route.stops)
        .find(stop => stop.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') === req.params.id);
    if (!place) throw new ApiError(404, 'Place not found');
    const hub = Object.values(BATANGAS_TRANSPORT_HUBS).find(candidate => isVerifiedTransportHub(candidate) &&
        candidate.name.toLowerCase() === place.name.toLowerCase() ||
        (candidate.aliases || []).some(alias => alias.toLowerCase() === place.name.toLowerCase())
    );
    ApiResponse.success(res, {
        place: {
            id: req.params.id,
            name: place.name,
            category: hub?.type || (place.isTerminal ? 'terminal' : 'landmark'),
            lat: place.lat,
            lng: place.lng,
            municipality: hub?.municipality || '',
            province: 'Batangas',
            verified: true
        }
    });
});

export const respondToAssistant = asyncHandler(async (req, res) => {
    const message = String(req.body.message || '').trim();
    if (!message || message.length > 2000) throw new ApiError(400, 'Message must be between 1 and 2000 characters');
    const savedHome = await SavedPlace.findOne({
        where: { userId: req.userId, label: 'home' },
        order: [['updatedAt', 'DESC']]
    });
    const recentTrips = (await getRecentTripsForUser(req.userId)).map(publicTrip);
    const result = await generateResponse(message, {
        activeLocation: req.body.activeLocation,
        savedHome,
        recentTrips,
        originPlace: req.body.originPlace,
        destinationPlace: req.body.destinationPlace,
        routeContext: req.body.routeContext,
        passengerType: req.user.passengerType,
        preference: req.user.routePreference
    });
    ApiResponse.success(res, result);
});

export const getAssistantSuggestionsForLocation = asyncHandler(async (req, res) => {
    const activeLocation = req.body.activeLocation;
    if (activeLocation && !isWithinBatangasScope(activeLocation)) {
        throw new ApiError(400, getBatangasScopeMessage());
    }
    const savedHome = await SavedPlace.findOne({
        where: { userId: req.userId, label: 'home' },
        order: [['updatedAt', 'DESC']]
    });
    ApiResponse.success(res, { suggestions: getContextualSuggestions(activeLocation, savedHome) });
});

export default {
    getProfile, updatePreferences, getSavedPlaces, createSavedPlace,
    updateSavedPlace, deleteSavedPlace, getTrips, createTrip, updateTrip,
    deleteTrip, getAchievements, getPlaces, getPlace,
    respondToAssistant, getAssistantSuggestionsForLocation
};
