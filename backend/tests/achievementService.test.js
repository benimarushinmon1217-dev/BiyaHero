import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateAchievements } from '../services/achievementService.js';

test('does not award activity-based achievements for an empty history', () => {
    assert.deepEqual(evaluateAchievements([]), []);
});

test('evaluates trip counts, multi-modal activity, and distinct destinations', () => {
    const trips = [
        { destinationName: 'School', segments: [{ transportType: 'jeepney' }, { transportType: 'bus' }] },
        ...Array.from({ length: 4 }, (_, index) => ({
            destinationName: `Destination ${index}`,
            segments: [{ transportType: 'jeepney' }]
        }))
    ];
    const earned = evaluateAchievements(trips).map(achievement => achievement.id);
    assert.ok(earned.includes('first-trip'));
    assert.ok(earned.includes('five-trips'));
    assert.ok(earned.includes('multi-modal'));
    assert.ok(earned.includes('explorer'));
    assert.equal(earned.includes('ten-trips'), false);
});
