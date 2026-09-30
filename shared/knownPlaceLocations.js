export const KNOWN_PLACE_LOCATIONS = {
    smCityLipa: {
        name: 'SM City Lipa',
        aliases: ['sm city lipa', 'sm lipa'],
        latitude: 13.9547813,
        longitude: 121.1630958,
        formattedAddress: 'SM City Lipa, Ayala Highway, Sabang, Lipa, Batangas, Philippines',
        source: 'OpenStreetMap way 31705509',
        sourceUrl: 'https://www.openstreetmap.org/way/31705509'
    }
};

export const findKnownPlaceLocation = name => {
    const normalizedName = String(name || '').trim().toLowerCase();
    return Object.values(KNOWN_PLACE_LOCATIONS).find(place =>
        place.aliases.includes(normalizedName)
    ) || null;
};

export const reconcileKnownPlaceLocation = place => {
    const knownPlace = findKnownPlaceLocation(place?.name)
        || findKnownPlaceLocation(place?.searchQuery);
    if (!knownPlace) return { place, corrected: false };

    const latitude = Number(place.latitude ?? place.lat);
    const longitude = Number(place.longitude ?? place.lng);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return {
            place: {
                ...place,
                name: knownPlace.name,
                latitude: knownPlace.latitude,
                longitude: knownPlace.longitude,
                lat: knownPlace.latitude,
                lng: knownPlace.longitude,
                formattedAddress: knownPlace.formattedAddress,
                displayName: knownPlace.formattedAddress,
                locationSource: knownPlace.source,
                locationSourceUrl: knownPlace.sourceUrl
            },
            corrected: true
        };
    }

    const radians = degrees => degrees * Math.PI / 180;
    const deltaLatitude = radians(knownPlace.latitude - latitude);
    const deltaLongitude = radians(knownPlace.longitude - longitude);
    const haversine = Math.sin(deltaLatitude / 2) ** 2
        + Math.cos(radians(latitude)) * Math.cos(radians(knownPlace.latitude))
        * Math.sin(deltaLongitude / 2) ** 2;
    const distanceMeters = 6371000 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
    if (distanceMeters <= 500) return { place, corrected: false };

    return {
        place: {
            ...place,
            name: knownPlace.name,
            latitude: knownPlace.latitude,
            longitude: knownPlace.longitude,
            lat: knownPlace.latitude,
            lng: knownPlace.longitude,
            formattedAddress: knownPlace.formattedAddress,
            displayName: knownPlace.formattedAddress,
            locationSource: knownPlace.source,
            locationSourceUrl: knownPlace.sourceUrl
        },
        corrected: true
    };
};
