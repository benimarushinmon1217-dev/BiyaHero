/**
 * Axios Configuration
 * Centralized API client with interceptors and error handling
 */

import axios from 'axios'
import { handleApiError, isBackendOffline } from '../utils/apiErrorHandler'

// Create axios instance
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api/v1',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Track backend status
let backendOfflineNotified = false
let reconnectAttempts = 0
const MAX_RECONNECT_ATTEMPTS = 3

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Add auth token if available
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        // Reset offline notification on new request
        if (reconnectAttempts > 0) {
            console.log(`🔄 Reconnect attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}`)
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor
apiClient.interceptors.response.use(
    (response) => {
        // Reset reconnect attempts on successful response
        if (reconnectAttempts > 0) {
            console.log('✅ Backend reconnected successfully!')
            reconnectAttempts = 0
            backendOfflineNotified = false
        }
        return response
    },
    async (error) => {
        const originalRequest = error.config

        // Check if backend is offline
        if (isBackendOffline(error)) {
            // Auto-reconnect logic
            if (!originalRequest._retry && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
                originalRequest._retry = true
                reconnectAttempts++

                // Show notification only once
                if (!backendOfflineNotified) {
                    console.warn('⚠️ Backend appears to be offline. Attempting to reconnect...')
                    backendOfflineNotified = true
                }

                // Wait before retry (exponential backoff)
                const delay = Math.min(1000 * Math.pow(2, reconnectAttempts - 1), 5000)
                await new Promise(resolve => setTimeout(resolve, delay))

                // Retry the request
                return apiClient(originalRequest)
            } else if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
                console.error('❌ Failed to reconnect after multiple attempts')
                reconnectAttempts = 0
            }
        }

        // Handle 401 Unauthorized (token expired)
        if (error.response?.status === 401) {
            // Clear token and redirect to login
            localStorage.removeItem('token')
            localStorage.removeItem('user')

            // Only redirect if not already on login page
            if (!window.location.pathname.includes('/login')) {
                console.warn('🔒 Session expired. Please log in again.')
                // You can dispatch a logout action here if using Redux/Context
            }
        }

        // Attach user-friendly error message
        error.friendlyMessage = handleApiError(error)

        return Promise.reject(error)
    }
)

// Health check function
export const checkBackendHealth = async () => {
    try {
        const response = await axios.get('/health', {
            timeout: 3000
        })
        return {
            online: true,
            data: response.data
        }
    } catch (error) {
        return {
            online: false,
            error: error.message
        }
    }
}

export default apiClient
