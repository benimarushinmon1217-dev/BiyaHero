import test from 'node:test';
import assert from 'node:assert/strict';
import { generateRealisticRoutes, findNearestNetworkStop, getVerifiedTransitLeg } from '../services/realisticRoutingService.js';
import { BATANGAS_JEEPNEY_ROUTES } from '../data/batangasJeepneyRoutes.js';
import { BATANGAS_TRANSPORT_HUBS, isVerifiedTransportHub } from '../data/batangasTransportNetwork.js';
import { KNOWN_PLACE_LOCATIONS, reconcileKnownPlaceLocation } from '../../shared/knownPlaceLocations.js';

test('does not treat unverified candidate stops as verified route access points', () => {
    assert.equal(findNearestNetworkStop({
        name: 'Lipa',
        lat: 13.95,
        lng: 121.17
    }), null);
    assert.ok(Object.values(BATANGAS_JEEPNEY_ROUTES).every(
        route => route.verificationStatus === 'unverified'
    ));
    assert.ok(Object.values(BATANGAS_TRANSPORT_HUBS).every(
        hub => !isVerifiedTransportHub(hub)
    ));
});

test('uses the mapped SM City Lipa point instead of the stale street coordinate', () => {
    const mappedPlace = KNOWN_PLACE_LOCATIONS.smCityLipa;
    const routeStops = Object.values(BATANGAS_JEEPNEY_ROUTES)
        .flatMap(route => route.stops)
        .filter(stop => stop.name === mappedPlace.name);
    const mappedHub = BATANGAS_TRANSPORT_HUBS['sm-lipa'];

    assert.ok(routeStops.length > 0);
    assert.ok(routeStops.every(stop =>
        stop.lat === mappedPlace.latitude && stop.lng === mappedPlace.longitude
    ));
    assert.equal(mappedHub.lat, mappedPlace.latitude);
    assert.equal(mappedHub.lng, mappedPlace.longitude);
    assert.equal(mappedHub.verificationStatus, 'unverified');

    const reconciled = reconcileKnownPlaceLocation({
        name: mappedPlace.name,
        lat: 13.938,
        lng: 121.1625
    });
    assert.equal(reconciled.corrected, true);
    assert.equal(reconciled.place.lat, mappedPlace.latitude);
    assert.equal(reconciled.place.lng, mappedPlace.longitude);

    const staleActiveSelection = reconcileKnownPlaceLocation({
        name: 'SM Cinema Lipa',
        searchQuery: 'SM City Lipa',
        lat: 13.938,
        lng: 121.1625
    });
    assert.equal(staleActiveSelection.corrected, true);
    assert.equal(staleActiveSelection.place.lat, mappedPlace.latitude);
    assert.equal(staleActiveSelection.place.lng, mappedPlace.longitude);
});

test('matches a verified stop by coordinates rather than by an address substring', () => {
    const verifiedRoutes = [{
        verificationStatus: 'verified',
        verificationSource: 'source',
        stopCoordinatesVerificationStatus: 'verified',
        stopCoordinatesSource: 'source',
        directionVerificationStatus: 'verified',
        directionSource: 'source',
        transitGeometryVerificationStatus: 'verified',
        transitGeometrySource: 'source',
        transitGeometry: [
            { latitude: 13.9411, longitude: 121.165 },
            { latitude: 13.9412, longitude: 121.1651 }
        ],
        stops: [{ name: 'Lipa Cathedral', lat: 13.9411, lng: 121.165 }]
    }];
    const matched = findNearestNetworkStop({
        name: 'East Wood, Lipa',
        latitude: 13.9411,
        longitude: 121.165
    }, 2, verifiedRoutes);

    assert.equal(matched?.name, 'Lipa Cathedral');
    assert.equal(matched?.distanceKm, 0);
});

test('does not match selected locations that are too far from a verified network stop', () => {
    const verifiedRoutes = [{
        verificationStatus: 'verified',
        verificationSource: 'source',
        stopCoordinatesVerificationStatus: 'verified',
        stopCoordinatesSource: 'source',
        directionVerificationStatus: 'verified',
        directionSource: 'source',
        transitGeometryVerificationStatus: 'verified',
        transitGeometrySource: 'source',
        transitGeometry: [
            { latitude: 13.9411, longitude: 121.165 },
            { latitude: 13.9412, longitude: 121.1651 }
        ],
        stops: [{ name: 'Lipa Cathedral', lat: 13.9411, lng: 121.165 }]
    }];
    assert.equal(findNearestNetworkStop({
        name: 'Lobo, Batangas',
        lat: 13.65,
        lng: 121.2
    }, 2, verifiedRoutes), null);
});

test('returns no public transit itinerary instead of routing on unverified corridors', async () => {
    const result = await generateRealisticRoutes(
        { name: 'Antipolo Del Sur', latitude: 13.95, longitude: 121.17 },
        { name: 'SM City Lipa', latitude: 13.9547813, longitude: 121.1630958 }
    );

    assert.equal(result.success, false);
    assert.match(result.message, /No source-verified transit stops or public transportation corridors/);
    assert.equal(result.routes, undefined);
});

test('uses only source-verified transit geometry in its ordered direction', () => {
    const stops = [
        { name: 'Stop A', lat: 13.94, lng: 121.16 },
        { name: 'Stop B', lat: 13.945, lng: 121.165 },
        { name: 'Stop C', lat: 13.95, lng: 121.17 }
    ];
    const route = {
        routeId: 'test-verified-route',
        verificationStatus: 'verified',
        verificationSource: 'transit-operator-record',
        stopCoordinatesVerificationStatus: 'verified',
        stopCoordinatesSource: 'field-survey-2026',
        directionVerificationStatus: 'verified',
        directionSource: 'operator-direction-record',
        transitGeometryVerificationStatus: 'verified',
        transitGeometrySource: 'operator-route-shape',
        stops,
        transitGeometry: stops.map(stop => ({
            latitude: stop.lat,
            longitude: stop.lng
        }))
    };

    const forwardLeg = getVerifiedTransitLeg(route, stops[0], stops[2]);
    assert.equal(forwardLeg?.geometry.length, 3);
    assert.equal(forwardLeg?.source, 'operator-route-shape');
    assert.ok(forwardLeg?.distance > 0);
    assert.equal(getVerifiedTransitLeg(route, stops[2], stops[0]), null);
    assert.equal(getVerifiedTransitLeg({
        ...route,
        transitGeometryVerificationStatus: 'unverified'
    }, stops[0], stops[2]), null);
});
