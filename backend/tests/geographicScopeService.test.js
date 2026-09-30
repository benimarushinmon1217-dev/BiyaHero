import test from 'node:test';
import assert from 'node:assert/strict';
import { isBatangasMunicipality, isValidCoordinate, isWithinBatangasScope } from '../services/geographicScopeService.js';

test('validates numeric coordinates without accepting missing values', () => {
    assert.equal(isValidCoordinate(13.94, 121.16), true);
    assert.equal(isValidCoordinate(undefined, 121.16), false);
    assert.equal(isValidCoordinate(null, 121.16), false);
    assert.equal(isValidCoordinate(91, 121.16), false);
});

test('accepts known Batangas places and rejects out-of-area or contradictory metadata', () => {
    assert.equal(isWithinBatangasScope({
        lat: 13.94, lng: 121.16, municipality: 'Lipa City', province: 'Batangas'
    }), true);
    assert.equal(isWithinBatangasScope({
        lat: 14.60, lng: 121.00, municipality: 'Antipolo', province: 'Rizal'
    }), false);
    assert.equal(isWithinBatangasScope({
        lat: 13.94, lng: 121.16, municipality: 'Lipa City', province: 'Laguna'
    }), false);
    assert.equal(isWithinBatangasScope({
        lat: 13.94, lng: 121.16, municipality: 'Unknown City', province: 'Batangas'
    }), false);
    assert.equal(isWithinBatangasScope({
        latitude: 13.94, longitude: 121.16, municipality: 'Lipa City', province: 'Batangas'
    }), true);
    assert.equal(isWithinBatangasScope({
        latitude: 121.16, longitude: 13.94, municipality: 'Lipa City', province: 'Batangas'
    }), false);
});

test('normalizes common Batangas city name variants', () => {
    assert.equal(isBatangasMunicipality('Sto. Tomas'), true);
    assert.equal(isBatangasMunicipality('Tanauan'), true);
    assert.equal(isBatangasMunicipality('Quezon City'), false);
});
