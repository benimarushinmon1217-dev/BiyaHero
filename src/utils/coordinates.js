const BATANGAS_BOUNDS = {
    minLatitude: 13.3,
    maxLatitude: 14.25,
    minLongitude: 120.35,
    maxLongitude: 121.55
}

export const normalizeCoordinates = value => {
    if (!value || typeof value !== 'object') return null

    const rawLatitude = value.latitude ?? value.lat
    const rawLongitude = value.longitude ?? value.lng
    if (rawLatitude == null || rawLongitude == null ||
        String(rawLatitude).trim() === '' || String(rawLongitude).trim() === '') return null

    const latitude = Number(rawLatitude)
    const longitude = Number(rawLongitude)
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude) ||
        latitude < -90 || latitude > 90 ||
        longitude < -180 || longitude > 180) return null

    return { latitude, longitude }
}

export const isWithinBatangasCoordinateBounds = value => {
    const coordinates = normalizeCoordinates(value)
    return Boolean(coordinates &&
        coordinates.latitude >= BATANGAS_BOUNDS.minLatitude &&
        coordinates.latitude <= BATANGAS_BOUNDS.maxLatitude &&
        coordinates.longitude >= BATANGAS_BOUNDS.minLongitude &&
        coordinates.longitude <= BATANGAS_BOUNDS.maxLongitude)
}

export const toLeafletCoordinate = value => {
    const coordinates = normalizeCoordinates(value)
    return coordinates
        ? [coordinates.latitude, coordinates.longitude]
        : null
}

export const fromGeoJSONCoordinate = coordinate => {
    if (!Array.isArray(coordinate) || coordinate.length < 2) return null
    return normalizeCoordinates({
        longitude: coordinate[0],
        latitude: coordinate[1]
    })
}

export const routeGeometryPointToLeaflet = point => {
    if (Array.isArray(point) && point.length >= 2) {
        const [latitude, longitude] = point.map(Number)
        return normalizeCoordinates({ latitude, longitude })
            ? [latitude, longitude]
            : null
    }
    return toLeafletCoordinate(point)
}
