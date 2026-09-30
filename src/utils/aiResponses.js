import apiClient from '../api/axios'

export const getAIResponse = async (question, context = {}) => {
    const response = await apiClient.post('/assistant/respond', {
        message: question,
        activeLocation: context.activeLocation,
        originPlace: context.originPlace,
        destinationPlace: context.destinationPlace,
        routeContext: context.routeContext,
        passengerType: context.passengerType,
        preference: context.preference
    })
    return response.data.data
}
