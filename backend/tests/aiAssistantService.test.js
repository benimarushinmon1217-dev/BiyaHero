import test from 'node:test';
import assert from 'node:assert/strict';
import { generateResponse, getContextualSuggestions } from '../services/aiAssistantService.js';

test('answers usual commute fare questions from the most frequent recent trip history', async () => {
    const response = await generateResponse('How much is my usual commute?', {
        recentTrips: [
            { originName: 'Antipolo Del Sur', destinationName: 'SM City Lipa', fare: 24, tripDate: '2026-09-27T10:00:00Z' },
            { originName: 'Antipolo Del Sur', destinationName: 'SM City Lipa', fare: 28, tripDate: '2026-09-29T10:00:00Z' },
            { originName: 'Lipa Cathedral', destinationName: 'Batangas City', fare: 80, tripDate: '2026-09-30T10:00:00Z' }
        ]
    });

    assert.equal(response.responseType, 'fare-history');
    assert.match(response.response, /Antipolo Del Sur to SM City Lipa/);
    assert.match(response.response, /₱28\.00/);
    assert.match(response.response, /2 records/);
    assert.match(response.response, /not a live fare estimate/);
});

test('routes short fare follow-ups through the existing route engine context', async () => {
    const response = await generateResponse('How much?', {
        passengerType: 'student',
        preference: 'recommended',
        routeContext: {
            originName: 'Lipa Cathedral',
            destinationName: 'SM City Lipa',
            preference: 'recommended'
        }
    });

    assert.equal(response.responseType, 'unavailable');
    assert.equal(response.clearRouteContext, true);
    assert.match(response.response, /previous trip to verified BiyaHero locations/);
});

test('uses OSM-resolved destination coordinates with active origin in the route planner', async () => {
    const response = await generateResponse('How do I go to SM City Santo Tomas?', {
        activeLocation: {
            name: 'Lipa',
            lat: 13.9411,
            lng: 121.165,
            municipality: 'Lipa City',
            province: 'Batangas'
        },
        destinationPlace: {
            name: 'SM City Santo Tomas',
            lat: 14.106389,
            lng: 121.150728,
            municipality: 'Santo Tomas',
            province: 'Batangas',
            provider: 'OpenStreetMap'
        },
        passengerType: 'student',
        preference: 'cheapest',
        routePlanner: async request => {
            assert.deepEqual(request.origin, {
                name: 'Lipa',
                lat: 13.9411,
                lng: 121.165,
                municipality: 'Lipa City',
                province: 'Batangas'
            });
            assert.equal(request.destination.name, 'SM City Santo Tomas');
            assert.equal(request.destination.lat, 14.106389);
            assert.equal(request.destination.lng, 121.150728);
            assert.equal(request.passengerType, 'student');
            assert.equal(request.preference, 'cheapest');
            return {
                publicTransit: {
                    status: 'unavailable',
                    routes: [],
                    reason: 'No verified BiyaHero transit itinerary is available.'
                },
                road: {
                    status: 'available',
                    distanceKm: 24.5,
                    durationMinutes: 38
                }
            };
        }
    });

    assert.equal(response.responseType, 'unsupported-route');
    assert.match(response.response, /road-driving reference is 24\.5 km/);
    assert.match(response.response, /not a public-transit itinerary/);
    assert.equal(response.routeContext.destination.lat, 14.106389);
});

test('resolves a get-home request from the active location to the saved Home', async () => {
    const response = await generateResponse('How do I get home?', {
        activeLocation: {
            name: 'Lipa Cathedral',
            lat: 13.9405,
            lng: 121.1655,
            municipality: 'Lipa City',
            province: 'Batangas'
        },
        savedHome: {
            name: 'SM City Lipa',
            lat: 13.9547813,
            lng: 121.1630958,
            municipality: 'Lipa City',
            province: 'Batangas'
        },
        routePlanner: async request => {
            assert.equal(request.origin.name, 'Lipa Cathedral');
            assert.equal(request.destination.name, 'SM City Lipa');
            return {
                publicTransit: {
                    status: 'unavailable',
                    routes: [],
                    reason: 'No verified BiyaHero route is currently available.'
                },
                road: { status: 'unavailable' }
            };
        }
    });

    assert.equal(response.responseType, 'unsupported-route');
    assert.match(response.response, /No verified BiyaHero route/);
});

test('does not suggest the active mapped destination as a destination prompt', () => {
    const suggestions = getContextualSuggestions({
        name: 'SM City Lipa',
        lat: 13.9547813,
        lng: 121.1630958
    });

    assert.equal(suggestions.some(prompt => /to SM City Lipa\?/i.test(prompt)), false);
});

test('offers an actionable prompt to the saved home from a different active place', () => {
    const suggestions = getContextualSuggestions(
        { name: 'SM City Lipa', lat: 13.9547813, lng: 121.1630958 },
        { name: 'Home', lat: 13.95, lng: 121.17, municipality: 'Lipa City', province: 'Batangas' }
    );

    assert.ok(suggestions.some(prompt => prompt.includes('to my saved home (Home)')));
});
