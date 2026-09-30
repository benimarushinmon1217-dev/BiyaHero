export const evaluateAchievements = (trips = []) => {
    const count = trips.length;
    const modalTrips = trips.filter(trip => {
        const segments = Array.isArray(trip.segments) ? trip.segments : [];
        return new Set(segments.map(segment => segment.transportType).filter(Boolean)).size > 1;
    }).length;
    const uniqueDestinations = new Set(
        trips.map(trip => String(trip.destinationName || '').trim().toLowerCase()).filter(Boolean)
    ).size;

    const candidates = [
        { id: 'first-trip', title: 'First Trip', description: 'Recorded your first trip.', icon: '🚌', unlocked: count >= 1 },
        { id: 'five-trips', title: '5 Trips', description: 'Recorded five trips.', icon: '🛣️', unlocked: count >= 5 },
        { id: 'ten-trips', title: '10 Trips', description: 'Recorded ten trips.', icon: '🚏', unlocked: count >= 10 },
        { id: 'twenty-five-trips', title: '25 Trips', description: 'Recorded twenty-five trips.', icon: '🏅', unlocked: count >= 25 },
        { id: 'frequent-commuter', title: 'Frequent Commuter', description: 'Recorded ten or more trips.', icon: '⭐', unlocked: count >= 10 },
        { id: 'multi-modal', title: 'Multi-Modal Traveler', description: 'Recorded a trip with multiple transport modes.', icon: '🔄', unlocked: modalTrips > 0 },
        { id: 'explorer', title: 'Explorer', description: 'Recorded trips to five different destinations.', icon: '🧭', unlocked: uniqueDestinations >= 5 }
    ];

    return candidates.filter(achievement => achievement.unlocked);
};

export default { evaluateAchievements };
