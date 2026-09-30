const BATANGAS_BOUNDS = {
    minLatitude: 13.3,
    maxLatitude: 14.25,
    minLongitude: 120.35,
    maxLongitude: 121.55
};

export const normalizeCoordinates = value => {
    if (!value || typeof value !== 'object') return null;

    const rawLatitude = value.latitude ?? value.lat;
    const rawLongitude = value.longitude ?? value.lng;
    if (rawLatitude == null || rawLongitude == null ||
        String(rawLatitude).trim() === '' || String(rawLongitude).trim() === '') return null;

    const latitude = Number(rawLatitude);
    const longitude = Number(rawLongitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude) ||
        latitude < -90 || latitude > 90 ||
        longitude < -180 || longitude > 180) return null;

    return { latitude, longitude };
};

export const fromGeoJSONCoordinate = coordinate => {
    if (!Array.isArray(coordinate) || coordinate.length < 2) return null;
    return normalizeCoordinates({
        longitude: coordinate[0],
        latitude: coordinate[1]
    });
};

export const toGeoJSONCoordinate = value => {
    const coordinates = normalizeCoordinates(value);
    return coordinates
        ? [coordinates.longitude, coordinates.latitude]
        : null;
};

export const toLeafletCoordinate = value => {
    const coordinates = normalizeCoordinates(value);
    return coordinates
        ? [coordinates.latitude, coordinates.longitude]
        : null;
};

export const isWithinBatangasCoordinateBounds = value => {
    const coordinates = normalizeCoordinates(value);
    return Boolean(coordinates &&
        coordinates.latitude >= BATANGAS_BOUNDS.minLatitude &&
        coordinates.latitude <= BATANGAS_BOUNDS.maxLatitude &&
        coordinates.longitude >= BATANGAS_BOUNDS.minLongitude &&
        coordinates.longitude <= BATANGAS_BOUNDS.maxLongitude);
};

export const distanceBetweenCoordinatesInMeters = (first, second) => {
    const start = normalizeCoordinates(first);
    const end = normalizeCoordinates(second);
    if (!start || !end) return Infinity;

    const radians = degrees => degrees * Math.PI / 180;
    const latitudeDelta = radians(end.latitude - start.latitude);
    const longitudeDelta = radians(end.longitude - start.longitude);
    const startLatitude = radians(start.latitude);
    const endLatitude = radians(end.latitude);
    const haversine = Math.sin(latitudeDelta / 2) ** 2
        + Math.cos(startLatitude) * Math.cos(endLatitude) * Math.sin(longitudeDelta / 2) ** 2;

    return 6371000 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
};

export const validateRouteGeometryEndpoints = (
    geoJSONCoordinates,
    requestedOrigin,
    requestedDestination,
    maximumSnapMeters = 250
) => {
    if (!Array.isArray(geoJSONCoordinates)) {
        throw new Error('Router returned no GeoJSON route coordinates');
    }
    const geometry = geoJSONCoordinates.map(fromGeoJSONCoordinate);
    if (geometry.length < 2 || geometry.some(point => !point)) {
        throw new Error('Router returned invalid GeoJSON route coordinates');
    }

    const startSnapMeters = distanceBetweenCoordinatesInMeters(requestedOrigin, geometry[0]);
    const endSnapMeters = distanceBetweenCoordinatesInMeters(
        requestedDestination,
        geometry[geometry.length - 1]
    );
    if (startSnapMeters > maximumSnapMeters || endSnapMeters > maximumSnapMeters) {
        throw new Error(`Router snapped route endpoints more than ${maximumSnapMeters}m from the requested coordinates`);
    }

    return { geometry, startSnapMeters, endSnapMeters };
};
