import apiClient from '../api/axios'

export const registerAccount = async (details) => {
    const response = await apiClient.post('/auth/register', details)
    return response.data.data
}

export const loginAccount = async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials)
    return response.data.data
}

export const getCurrentAccount = async () => {
    const response = await apiClient.get('/auth/me')
    return response.data.data.user
}

export const getProfileData = async () => {
    const response = await apiClient.get('/users/me')
    return response.data.data
}

export const updateAccountPreferences = async (preferences) => {
    const response = await apiClient.put('/users/me/preferences', preferences)
    return response.data.data
}

export const getSavedPlaces = async () => {
    const response = await apiClient.get('/saved-places')
    return response.data.data.places
}

export const getVerifiedPlaces = async () => {
    const response = await apiClient.get('/places')
    return response.data.data.places
}

export const getPopularRoutes = async () => {
    const response = await apiClient.get('/routes/popular')
    return response.data.data.routes
}

export const createSavedPlace = async (place) => {
    const response = await apiClient.post('/saved-places', place)
    return response.data.data.place
}

export const updateSavedPlace = async (id, place) => {
    const response = await apiClient.put(`/saved-places/${id}`, place)
    return response.data.data.place
}

export const deleteSavedPlace = async (id) => {
    await apiClient.delete(`/saved-places/${id}`)
}

export const getTrips = async () => {
    const response = await apiClient.get('/trips')
    return response.data.data.trips
}

export const createTrip = async (trip) => {
    const response = await apiClient.post('/trips', trip)
    return response.data.data.trip
}

export const updateTrip = async (id, trip) => {
    const response = await apiClient.put(`/trips/${id}`, trip)
    return response.data.data.trip
}

export const deleteTrip = async (id) => {
    await apiClient.delete(`/trips/${id}`)
}

export const calculateFare = async (
    distance,
    passengerType = 'regular',
    transportType = 'jeepney',
    originMunicipality,
    destinationMunicipality
) => {
    const response = await apiClient.post('/routes/calculate-segment-fare', {
        distance,
        transportType,
        passengerType,
        originMunicipality,
        destinationMunicipality
    })
    return response.data.data
}

export const getAssistantSuggestions = async (activeLocation) => {
    const response = await apiClient.post('/assistant/suggestions', { activeLocation })
    return response.data.data.suggestions
}
