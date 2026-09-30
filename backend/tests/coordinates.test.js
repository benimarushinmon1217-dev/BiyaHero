import test from 'node:test';
import assert from 'node:assert/strict';
import {
    distanceBetweenCoordinatesInMeters,
    fromGeoJSONCoordinate,
    isWithinBatangasCoordinateBounds,
    normalizeCoordinates,
    toGeoJSONCoordinate,
    toLeafletCoordinate,
    validateRouteGeometryEndpoints
} from '../utils/coordinates.js';

test('normalizes legacy and canonical coordinates without swapping axes', () => {
    const coordinates = normalizeCoordinates({ lat: 13.9411, lng: 121.165 });

    assert.deepEqual(coordinates, { latitude: 13.9411, longitude: 121.165 });
    assert.deepEqual(toGeoJSONCoordinate(coordinates), [121.165, 13.9411]);
    assert.deepEqual(toLeafletCoordinate(coordinates), [13.9411, 121.165]);
    assert.deepEqual(fromGeoJSONCoordinate([121.165, 13.9411]), coordinates);
});

test('rejects missing, null, non-finite and out-of-range coordinates', () => {
    for (const value of [
        {},
        { latitude: null, longitude: 121 },
        { latitude: Number.NaN, longitude: 121 },
        { latitude: 91, longitude: 121 },
        { latitude: 13, longitude: 181 }
    ]) {
        assert.equal(normalizeCoordinates(value), null);
    }
});

test('Batangas bounds check detects swapped latitude and longitude', () => {
    assert.equal(isWithinBatangasCoordinateBounds({ latitude: 13.9411, longitude: 121.165 }), true);
    assert.equal(isWithinBatangasCoordinateBounds({ latitude: 121.165, longitude: 13.9411 }), false);
});

test('calculates the separation in meters and rejects invalid route endpoints', () => {
    assert.ok(distanceBetweenCoordinatesInMeters(
        { latitude: 13.9411, longitude: 121.165 },
        { latitude: 13.9411, longitude: 121.166 }
    ) > 100);
    assert.equal(distanceBetweenCoordinatesInMeters({}, {}), Infinity);
});

test('validates GeoJSON route starts and ends against requested coordinates', () => {
    const start = { latitude: 13.94, longitude: 121.16 };
    const end = { latitude: 13.95, longitude: 121.17 };
    const result = validateRouteGeometryEndpoints(
        [[121.16, 13.94], [121.165, 13.945], [121.17, 13.95]],
        start,
        end
    );

    assert.deepEqual(result.geometry[0], start);
    assert.deepEqual(result.geometry.at(-1), end);
    assert.equal(result.startSnapMeters, 0);
    assert.equal(result.endSnapMeters, 0);
    assert.throws(() => validateRouteGeometryEndpoints(
        [[121.2, 13.94], [121.17, 13.95]],
        start,
        end
    ), /snapped route endpoints more than 250m/);
});
