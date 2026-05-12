/**
 * Route Results Page - Multi-Modal Version
 * Displays multiple route options with transfers and segments
 */

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Navigation2, Filter, TrendingDown, Zap, Users, AlertCircle } from 'lucide-react';
import RouteMap from '../components/RouteMap';
import MultiRouteCard from '../components/MultiRouteCard';
import RouteSegmentDetail from '../components/RouteSegmentDetail';
import { getMultiModalRoutes } from '../services/multiModalRouteService';

const RouteResultsMultiModal = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [routes, setRoutes] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [fareType, setFareType] = useState('regular');
    const [sortBy, setSortBy] = useState('recommended');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { origin, destination, originPlace, destinationPlace } = location.state || {};

    useEffect(() => {
        if (!origin || !destination || !originPlace || !destinationPlace) {
            navigate('/');
            return;
        }

        loadRoutes();
    }, [origin, destination, originPlace, destinationPlace, fareType, sortBy]);

    const loadRoutes = async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await getMultiModalRoutes(
                originPlace,
                destinationPlace,
                fareType,
                sortBy
            );

            if (result.success && result.data.routes) {
                setRoutes(result.data.routes);
                setSelectedRoute(result.data.routes[0]);
            } else {
                setError(result.error || 'Failed to load routes');
                setRoutes([]);
            }
        } catch (err) {
            console.error('Route loading error:', err);
            setError('An error occurred while loading routes');
            setRoutes([]);
        } finally {
            setLoading(false);
        }
    };

    const fareTypes = [
        { id: 'regular', label: 'Regular', icon: '👤' },
        { id: 'student', label: 'Student', icon: '🎓' },
        { id: 'senior', label: 'Senior', icon: '👴' },
        { id: 'pwd', label: 'PWD', icon: '♿' },
    ];

    const sortOptions = [
        { id: 'recommended', label: 'Recommended', icon: <TrendingDown size={16} /> },
        { id: 'cheapest', label: 'Cheapest', icon: <TrendingDown size={16} /> },
        { id: 'fastest', label: 'Fastest', icon: <Zap size={16} /> },
        { id: 'least_transfers', label: 'Least Transfers', icon: <Users size={16} /> },
    ];

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full mb-4"
                />
                <p className="text-gray-600 dark:text-gray-400">Finding best routes for you...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                    <div className="flex items-start space-x-3">
                        <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0" size={24} />
                        <div>
                            <h3 className="text-lg font-bold text-red-900 dark:text-red-300 mb-2">
                                Error Loading Routes
                            </h3>
                            <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
                            <button
                                onClick={() => navigate('/')}
                                className="btn-primary"
                            >
                                Back to Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <h1 className="text-3xl font-bold mb-2">🚌 Route Options</h1>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <MapPin size={18} />
                    <span className="font-medium">{origin}</span>
                    <ArrowRight size={18} />
                    <Navigation2 size={18} />
                    <span className="font-medium">{destination}</span>
                </div>
                {routes.length > 0 && (
                    <p className="text-sm text-gray-500 mt-2">
                        Found {routes.length} route option{routes.length !== 1 ? 's' : ''} for you
                    </p>
                )}
            </motion.div>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Fare Type Selector */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <label className="block text-sm font-medium mb-2">Passenger Type</label>
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
                                {fareType === type.id && type.id !== 'regular' && (
                                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">20% off</span>
                                )}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Sort Options */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <label className="block text-sm font-medium mb-2">Sort By</label>
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                        {sortOptions.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => setSortBy(option.id)}
                                className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all flex items-center space-x-2 ${sortBy === option.id
                                    ? 'bg-gradient-to-r from-primary-600 to-cyan-500 text-white shadow-lg'
                                    : 'glass hover:shadow-md'
                                    }`}
                            >
                                {option.icon}
                                <span>{option.label}</span>
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Route Options List */}
                <div className="lg:col-span-1 space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                    {routes.length === 0 ? (
                        <div className="card text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400">No routes available</p>
                        </div>
                    ) : (
                        routes.map((route, index) => (
                            <MultiRouteCard
                                key={route.routeId || index}
                                route={route}
                                isSelected={selectedRoute?.routeId === route.routeId}
                                onClick={() => setSelectedRoute(route)}
                                fareType={fareType}
                            />
                        ))
                    )}
                </div>

                {/* Map and Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Map */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card p-0 overflow-hidden"
                    >
                        <div className="h-[400px] lg:h-[500px]">
                            <RouteMap
                                route={selectedRoute}
                                origin={origin}
                                destination={destination}
                                originPlace={originPlace}
                                destinationPlace={destinationPlace}
                            />
                        </div>
                    </motion.div>

                    {/* Route Summary */}
                    {selectedRoute && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card"
                        >
                            <h2 className="text-2xl font-bold mb-4">📋 Route Summary</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div className="text-center p-4 glass rounded-xl">
                                    <p className="text-sm text-gray-500 mb-1">Total Fare</p>
                                    <p className="text-2xl font-bold text-primary-600 dark:text-cyan-400">
                                        ₱{selectedRoute.totalFare}
                                    </p>
                                </div>
                                <div className="text-center p-4 glass rounded-xl">
                                    <p className="text-sm text-gray-500 mb-1">Duration</p>
                                    <p className="text-2xl font-bold">
                                        {selectedRoute.totalDuration} min
                                    </p>
                                </div>
                                <div className="text-center p-4 glass rounded-xl">
                                    <p className="text-sm text-gray-500 mb-1">Distance</p>
                                    <p className="text-2xl font-bold">
                                        {selectedRoute.totalDistance?.toFixed(1)} km
                                    </p>
                                </div>
                                <div className="text-center p-4 glass rounded-xl">
                                    <p className="text-sm text-gray-500 mb-1">Transfers</p>
                                    <p className="text-2xl font-bold">
                                        {selectedRoute.totalTransfers}
                                    </p>
                                </div>
                            </div>

                            {/* Route Type Info */}
                            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                                <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-2 flex items-center space-x-2">
                                    <span>🎯</span>
                                    <span>{selectedRoute.routeName}</span>
                                </h3>
                                <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                                    {selectedRoute.recommendationReason || 'This route option provides a good balance of cost and convenience.'}
                                </p>

                                {/* Route Tags */}
                                {selectedRoute.tags && selectedRoute.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
                                        {selectedRoute.tags.map((tag, idx) => (
                                            <div
                                                key={idx}
                                                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-gray-800 shadow-sm flex items-center space-x-1.5"
                                                title={tag.description}
                                            >
                                                <span className="text-base">{tag.icon}</span>
                                                <span>{tag.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Commuter Notes */}
                                {selectedRoute.commuterNotes && (
                                    <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
                                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
                                            💬 Commuter Notes:
                                        </p>
                                        <p className="text-sm text-blue-700 dark:text-blue-300 italic">
                                            "{selectedRoute.commuterNotes}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Detailed Segments */}
                    {selectedRoute && selectedRoute.segments && (
                        <RouteSegmentDetail
                            segments={selectedRoute.segments}
                            fareType={fareType}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default RouteResultsMultiModal;
