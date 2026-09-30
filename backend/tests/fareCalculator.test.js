import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateFare, calculateSegmentFare, getFareBreakdown } from '../utils/fareCalculator.js';

test('applies the configured regular fare and per-kilometer fare to one segment', () => {
    assert.equal(calculateFare(2), 15);
    assert.equal(calculateFare(2, 'regular', 12), 15);
    assert.equal(calculateFare(7), 17);
    assert.equal(calculateFare(6, 'regular', 45, 2), 47);
});

test('applies configured passenger discounts after calculating the segment', () => {
    assert.equal(calculateFare(7, 'student'), 14);
    assert.equal(calculateFare(2, 'student'), 12);
    assert.equal(calculateFare(2, 'student', 12), 12);
});

test('returns a transparent segment breakdown', () => {
    const result = calculateSegmentFare(7, 'regular', 'jeepney');
    assert.equal(result.transportType, 'jeepney');
    assert.equal(result.segmentCount, 1);
    assert.equal(result.baseFare, 15);
    assert.equal(result.additionalFare, 2);
    assert.equal(result.total, 17);
    assert.equal(getFareBreakdown(7, 'regular', { baseFare: 45, ratePerKm: 2 }).total, 49);
});
