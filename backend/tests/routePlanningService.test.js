import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRoutePlan } from '../services/routePlanningService.js';
import { KNOWN_PLACE_LOCATIONS } from '../../shared/knownPlaceLocations.js';

const origin = { name: 'Lipa', latitude: 13.9411, longitude: 121.165 };
const destination = {
    name: KNOWN_PLACE_LOCATIONS.smCityLipa.name,
    latitude: KNOWN_PLACE_LOCATIONS.smCityLipa.latitude,
    longitude: KNOWN_PLACE_LOCATIONS.smCityLipa.longitude
};

test('returns separate first-party road, verified transit, and motorcycle integration statuses', async () => {
    const plan = await buildRoutePlan(
        { origin, destination, passengerType: 'student' },
        {
            routeRoad: async () => ({
                success: true,
                source: 'osrm-driving',
                distance: '0.70',
                duration: 4,
                geometry: [origin, destination]
            }),
            planTransit: async () => ({
                success: false,
                message: 'No source-verified transit route is available.'
            })
        }
    );

    assert.equal(plan.provider, 'BiyaHero');
    assert.equal(plan.road.status, 'available');
    assert.equal(plan.road.routeType, 'road_reference');
    assert.equal(plan.road.distanceKm, 0.7);
    assert.equal(plan.publicTransit.status, 'unavailable');
    assert.deepEqual(plan.publicTransit.routes, []);
    assert.equal(plan.motorcycleTaxi.status, 'not_integrated');
    assert.equal(plan.motorcycleTaxi.fareQuote, null);
    assert.equal(plan.motorcycleTaxi.booking, null);
});

test('reports road routing failure explicitly while preserving verified transit results', async () => {
    const transitRoute = { routeId: 'verified-route' };
    const plan = await buildRoutePlan(
        { origin, destination },
        {
            routeRoad: async () => { throw new Error('provider network details'); },
            planTransit: async () => ({
                success: true,
                routingMethod: 'verified-transit-data',
                routes: [transitRoute]
            })
        }
    );

    assert.equal(plan.road.status, 'unavailable');
    assert.equal(plan.road.reason, 'Street routing provider is unavailable.');
    assert.equal(plan.publicTransit.status, 'available');
    assert.deepEqual(plan.publicTransit.routes, [transitRoute]);
});
