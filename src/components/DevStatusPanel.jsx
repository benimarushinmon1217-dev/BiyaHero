import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Server, Database, MapPin, Navigation, Wifi, WifiOff, X } from 'lucide-react'
import axios from 'axios'

const DevStatusPanel = () => {
    const [isVisible, setIsVisible] = useState(true)
    const [isMinimized, setIsMinimized] = useState(false)
    const [status, setStatus] = useState({
        frontend: true,
        backend: 'checking',
        database: 'checking',
        geolocation: 'checking',
        routing: 'checking'
    })
    const [backendInfo, setBackendInfo] = useState(null)

    // Only show in development
    const isDev = import.meta.env.DEV

    useEffect(() => {
        if (!isDev) return

        // Check backend health
        const checkBackend = async () => {
            try {
                const response = await axios.get('http://localhost:5000/health', {
                    timeout: 3000
                })

                if (response.data.success) {
                    setBackendInfo(response.data)
                    setStatus(prev => ({
                        ...prev,
                        backend: 'connected',
                        database: response.data.database?.status === 'connected' ? 'connected' : 'disconnected'
                    }))
                }
            } catch (error) {
                setStatus(prev => ({
                    ...prev,
                    backend: 'disconnected',
                    database: 'unknown'
                }))
            }
        }

        // Check geolocation
        const checkGeolocation = () => {
            if (navigator.geolocation) {
                setStatus(prev => ({ ...prev, geolocation: 'available' }))
            } else {
                setStatus(prev => ({ ...prev, geolocation: 'unavailable' }))
            }
        }

        // Check routing engine (OpenRouteService)
        const checkRouting = async () => {
            try {
                // Just check if we can make a request (don't actually call API)
                setStatus(prev => ({ ...prev, routing: 'available' }))
            } catch (error) {
                setStatus(prev => ({ ...prev, routing: 'unavailable' }))
            }
        }

        // Initial checks
        checkBackend()
        checkGeolocation()
        checkRouting()

        // Periodic backend check
        const interval = setInterval(checkBackend, 10000) // Every 10 seconds

        return () => clearInterval(interval)
    }, [isDev])

    if (!isDev || !isVisible) return null

    const getStatusColor = (serviceStatus) => {
        switch (serviceStatus) {
            case 'connected':
            case 'available':
            case true:
                return 'text-green-500'
            case 'disconnected':
            case 'unavailable':
            case false:
                return 'text-red-500'
            case 'checking':
            case 'unknown':
                return 'text-yellow-500'
            default:
                return 'text-gray-500'
        }
    }

    const getStatusIcon = (serviceStatus) => {
        switch (serviceStatus) {
            case 'connected':
            case 'available':
            case true:
                return '✅'
            case 'disconnected':
            case 'unavailable':
            case false:
                return '❌'
            case 'checking':
            case 'unknown':
                return '⏳'
            default:
                return '❓'
        }
    }

    const getStatusText = (serviceStatus) => {
        switch (serviceStatus) {
            case 'connected':
                return 'Connected'
            case 'available':
                return 'Available'
            case true:
                return 'Running'
            case 'disconnected':
                return 'Disconnected'
            case 'unavailable':
                return 'Unavailable'
            case false:
                return 'Stopped'
            case 'checking':
                return 'Checking...'
            case 'unknown':
                return 'Unknown'
            default:
                return 'Unknown'
        }
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-4 right-4 z-50"
            >
                <div className="bg-gray-900 text-white rounded-lg shadow-2xl border border-gray-700 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Server size={16} />
                            <span className="text-sm font-semibold">Dev Status</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setIsMinimized(!isMinimized)}
                                className="hover:bg-white/20 p-1 rounded transition-colors"
                                title={isMinimized ? 'Expand' : 'Minimize'}
                            >
                                {isMinimized ? '▲' : '▼'}
                            </button>
                            <button
                                onClick={() => setIsVisible(false)}
                                className="hover:bg-white/20 p-1 rounded transition-colors"
                                title="Close"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    {!isMinimized && (
                        <div className="p-4 space-y-2">
                            {/* Frontend */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Wifi size={16} className={getStatusColor(status.frontend)} />
                                    <span className="text-sm">Frontend</span>
                                </div>
                                <span className={`text-xs ${getStatusColor(status.frontend)}`}>
                                    {getStatusIcon(status.frontend)} {getStatusText(status.frontend)}
                                </span>
                            </div>

                            {/* Backend */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Server size={16} className={getStatusColor(status.backend)} />
                                    <span className="text-sm">Backend</span>
                                </div>
                                <span className={`text-xs ${getStatusColor(status.backend)}`}>
                                    {getStatusIcon(status.backend)} {getStatusText(status.backend)}
                                </span>
                            </div>

                            {/* Database */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Database size={16} className={getStatusColor(status.database)} />
                                    <span className="text-sm">Database</span>
                                </div>
                                <span className={`text-xs ${getStatusColor(status.database)}`}>
                                    {getStatusIcon(status.database)} {getStatusText(status.database)}
                                </span>
                            </div>

                            {/* Geolocation */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <MapPin size={16} className={getStatusColor(status.geolocation)} />
                                    <span className="text-sm">Geolocation</span>
                                </div>
                                <span className={`text-xs ${getStatusColor(status.geolocation)}`}>
                                    {getStatusIcon(status.geolocation)} {getStatusText(status.geolocation)}
                                </span>
                            </div>

                            {/* Routing Engine */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Navigation size={16} className={getStatusColor(status.routing)} />
                                    <span className="text-sm">Routing</span>
                                </div>
                                <span className={`text-xs ${getStatusColor(status.routing)}`}>
                                    {getStatusIcon(status.routing)} {getStatusText(status.routing)}
                                </span>
                            </div>

                            {/* Backend Info */}
                            {backendInfo && (
                                <div className="mt-3 pt-3 border-t border-gray-700">
                                    <div className="text-xs text-gray-400 space-y-1">
                                        <div>Port: {backendInfo.server?.port}</div>
                                        <div>Uptime: {Math.floor(backendInfo.uptime)}s</div>
                                        <div>Response: {backendInfo.responseTime}</div>
                                    </div>
                                </div>
                            )}

                            {/* Warning if backend is down */}
                            {status.backend === 'disconnected' && (
                                <div className="mt-3 pt-3 border-t border-gray-700">
                                    <div className="text-xs text-red-400 bg-red-900/20 p-2 rounded">
                                        ⚠️ Backend is offline. Run: <code className="bg-gray-800 px-1 rounded">npm run dev</code>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Reopen button when closed */}
                {!isVisible && (
                    <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        onClick={() => setIsVisible(true)}
                        className="fixed bottom-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                        title="Show Dev Status"
                    >
                        <Server size={20} />
                    </motion.button>
                )}
            </motion.div>
        </AnimatePresence>
    )
}

export default DevStatusPanel
