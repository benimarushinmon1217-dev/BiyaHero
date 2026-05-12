/**
 * API Error Handler
 * Provides user-friendly error messages for API failures
 */

export const handleApiError = (error, customMessage = null) => {
    // Custom message takes priority
    if (customMessage) {
        return customMessage
    }

    // Network errors (backend offline, no internet, etc.)
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        return '🔌 Unable to connect to BiyaHero backend server. Please ensure the backend is running.'
    }

    if (error.code === 'ERR_CONNECTION_REFUSED') {
        return '🔌 Connection refused. The backend server may not be running. Try: npm run dev'
    }

    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        return '⏱️ Request timed out. The server is taking too long to respond.'
    }

    // HTTP status errors
    if (error.response) {
        const status = error.response.status
        const data = error.response.data

        switch (status) {
            case 400:
                return data?.message || '❌ Invalid request. Please check your input.'
            case 401:
                return '🔒 Unauthorized. Please log in again.'
            case 403:
                return '🚫 Access denied. You don\'t have permission to perform this action.'
            case 404:
                return '🔍 Resource not found. The requested endpoint doesn\'t exist.'
            case 429:
                return '⏸️ Too many requests. Please wait a moment and try again.'
            case 500:
                return '⚠️ Server error. Something went wrong on our end.'
            case 502:
                return '🔌 Bad gateway. The server is temporarily unavailable.'
            case 503:
                return '🔧 Service unavailable. The server is under maintenance.'
            default:
                return data?.message || `❌ Request failed with status ${status}`
        }
    }

    // Request was made but no response received
    if (error.request) {
        return '📡 No response from server. Please check your internet connection.'
    }

    // Something else happened
    return error.message || '❌ An unexpected error occurred.'
}

export const isBackendOffline = (error) => {
    return (
        error.code === 'ERR_NETWORK' ||
        error.code === 'ECONNREFUSED' ||
        error.code === 'ERR_CONNECTION_REFUSED' ||
        !error.response
    )
}

export const showFriendlyError = (error, fallbackMessage = 'Something went wrong') => {
    const message = handleApiError(error, fallbackMessage)
    console.error('API Error:', message, error)
    return message
}

export default {
    handleApiError,
    isBackendOffline,
    showFriendlyError
}
