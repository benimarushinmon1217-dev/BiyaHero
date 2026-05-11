import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Clock, DollarSign, ArrowRight, Bus, Navigation2, AlertCircle, TrendingUp, Zap } from 'lucide-react'
import RouteMap from '../components/RouteMap'
import { generateRoutes } from '../utils/routeGenerator'

const RouteResults = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [routes, setRoutes] = useState([])
    const [selectedRoute, setSelectedRoute] = useState(null)
    const [fareType, setFareType] = useState('REGULAR')
    const [loading, setLoading] = useState(true)

    const { origin, destination, originPlace, destinationPlace, userCoords } = location.state || {}

    useEffect(() => {
        if (!origin || !destination) {
            navigate('/')
            return
        }

        // Generate routes with distance-based fares (async)
        const loadRoutes = async () => {
            setLoading(true)
            try {
                // Use validated place objects for accurate routing
                const generatedRoutes = await generateRoutes(
                    origin,
                    destination,
                    fareType,
                    userCoords,
                    originPlace,
                    destinationPlace
                )
                setRoutes(generatedRoutes)
                setSelectedRoute(generatedRoutes[0])
            } catch (error) {
                console.error('Route generation error:', error)
                // Set empty routes on error
                setRoutes([])
            } finally {
                setLoading(false)
            }
        }

        loadRoutes()
    }, [origin, destination, fareType, userCoords, originPlace, destinationPlace, navigate])

    const fareTypes = [
        { id: 'REGULAR', label: 'Regular', icon: '👤' },
        { id: 'STUDENT', label: 'Student', icon: '🎓' },
        { id: 'SENIOR', label: 'Senior', icon: '👴' },
        { id: 'PWD', label: 'PWD', icon: '♿' },
    ]

    const getFare = (route) => {
        return route.currentFare || route.baseFare
    }

    const getRouteBadge = (route) => {
        if (route.recommended) return { label: 'Recommended', color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300', icon: '⭐' }
        if (route.type === 'direct') return { label: 'Direct', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300', icon: '🎯' }
        if (route.type === 'alternative') return { label: 'Alternative', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300', icon: '🔄' }
        return { label: 'Route', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300', icon: '🚌' }
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full"
                />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <h1 className="text-3xl font-bold mb-2">Route Options</h1>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <MapPin size={18} />
                    <span>{origin}</span>
                    <ArrowRight size={18} />
                    <Navigation2 size={18} />
                    <span>{destination}</span>
                </div>
            </motion.div>

            {/* Fare Type Selector */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <div className="flex space-x-2 overflow-x-auto pb-2">
                    {fareTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => setFareType(type.id)}
                            className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all flex items-center space-x-2 ${fareType === type.id
                                ? 'bg-gradient-to-r from-primary-600 to-cyan-500 text-white shadow-lg'
                                : 'glass hover:shadow-md'
                                }`}
                        >
                            <span>{type.icon}</span>
                            <span>{type.label}</span>
                            {fareType === type.id && type.id !== 'REGULAR' && (
                                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">₱5 off</span>
                            )}
                        </button>
                    ))}
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Route Options */}
                <div className="lg:col-span-1 space-y-4">
                    {routes.map((route, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => setSelectedRoute(route)}
                            className={`card cursor-pointer transition-all ${selectedRoute?.id === route.id
                                ? 'ring-2 ring-primary-500 shadow-xl'
                                : 'hover:shadow-lg'
                                }`}
                        >
                            {/* Route Badge */}
                            <div className="flex items-center justify-between mb-3">
                                <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${getRouteBadge(route).color}`}>
                                    <span>{getRouteBadge(route).icon}</span>
                                    <span>{getRouteBadge(route).label}</span>
                                </div>
                                <span className="text-sm text-gray-500">{route.transfers} transfer{route.transfers !== 1 ? 's' : ''}</span>
                            </div>

                            {/* Time and Fare */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex flex-col space-y-1">
                                    <div className="flex items-center space-x-2">
                                        <Clock size={18} className="text-primary-600 dark:text-cyan-400" />
                                        <span className="text-xl font-bold">{route.duration}</span>
                                    </div>
                                    {route.distanceFormatted && (
                                        <div className="flex items-center space-x-2">
                                            <MapPin size={16} className="text-gray-400" />
                                            <span className="text-sm text-gray-600 dark:text-gray-400">{route.distanceFormatted}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-primary-600 dark:text-cyan-400">
                                        ₱{getFare(route)}
                                    </div>
                                    <div className="text-xs text-gray-500">{fareTypes.find(t => t.id === fareType)?.label} fare</div>
                                    {fareType !== 'REGULAR' && route.baseFare && (
                                        <div className="text-xs text-gray-400 line-through">₱{route.baseFare}</div>
                                    )}
                                </div>
                            </div>

                            {/* Route Preview */}
                            <div className="space-y-2">
                                {route.steps.slice(0, 2).map((step, idx) => (
                                    <div key={idx} className="flex items-center space-x-2 text-sm">
                                        <Bus size={16} className="text-gray-400" />
                                        <span className="text-gray-600 dark:text-gray-400 truncate">
                                            {step.vehicle} → {step.to}
                                        </span>
                                    </div>
                                ))}
                                {route.steps.length > 2 && (
                                    <div className="text-xs text-gray-500">
                                        +{route.steps.length - 2} more step{route.steps.length - 2 !== 1 ? 's' : ''}
                                    </div>
                                )}
                            </div>

                            {/* Route Notes */}
                            {route.notes && (
                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex items-start space-x-2">
                                        <AlertCircle size={14} className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                                        <span className="text-xs text-gray-600 dark:text-gray-400">{route.notes}</span>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Map and Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Map */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card p-0 overflow-hidden"
                    >
                        <RouteMap route={selectedRoute} origin={origin} destination={destination} userCoords={userCoords} originPlace={originPlace} destinationPlace={destinationPlace} />
                    </motion.div>

                    {/* Detailed Steps */}
                    {selectedRoute && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card"
                        >
                            <h2 className="text-2xl font-bold mb-4">Step-by-Step Guide</h2>
                            <div className="space-y-4">
                                {selectedRoute.steps.map((step, index) => (
                                    <div key={index} className="flex space-x-4">
                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                                                {index + 1}
                                            </div>
                                            {index < selectedRoute.steps.length - 1 && (
                                                <div className="w-0.5 h-full bg-gradient-to-b from-primary-600 to-cyan-500 my-2" />
                                            )}
                                        </div>
                                        <div className="flex-1 pb-6">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <Bus className="text-primary-600 dark:text-cyan-400" size={20} />
                                                <span className="font-semibold text-lg">{step.vehicle}</span>
                                            </div>
                                            <div className="text-gray-600 dark:text-gray-400 space-y-1">
                                                <p><strong>From:</strong> {step.from}</p>
                                                <p><strong>To:</strong> {step.to}</p>
                                                {step.distance && (
                                                    <p><strong>Distance:</strong> {step.distance.toFixed(1)} km</p>
                                                )}
                                                <p><strong>Duration:</strong> {step.duration}</p>
                                                <p><strong>Fare:</strong> ₱{step.fare} {fareType !== 'REGULAR' && step.regularFare && step.regularFare !== step.fare && (
                                                    <span className="text-xs text-gray-400 line-through ml-2">₱{step.regularFare}</span>
                                                )}</p>
                                                {step.tips && (
                                                    <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-start space-x-2">
                                                        <AlertCircle size={16} className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                                                        <span className="text-sm text-blue-700 dark:text-blue-300">{step.tips}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default RouteResults
