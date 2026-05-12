/**
 * Route Segment Detail Component
 * Displays detailed step-by-step instructions for each segment
 */

import { motion } from 'framer-motion';
import { MapPin, Clock, DollarSign, AlertCircle, ArrowRight } from 'lucide-react';

const RouteSegmentDetail = ({ segments, fareType }) => {
    const getTransportIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'jeepney':
                return '🚌';
            case 'tricycle':
                return '🛺';
            case 'bus':
                return '🚍';
            case 'uv_express':
            case 'uv express':
                return '🚐';
            case 'van':
                return '🚐';
            case 'walking':
                return '🚶';
            default:
                return '🚌';
        }
    };

    const getTransportColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'jeepney':
                return 'from-blue-600 to-blue-500';
            case 'tricycle':
                return 'from-orange-600 to-orange-500';
            case 'bus':
                return 'from-green-600 to-green-500';
            case 'uv_express':
            case 'uv express':
                return 'from-purple-600 to-purple-500';
            case 'van':
                return 'from-indigo-600 to-indigo-500';
            case 'walking':
                return 'from-gray-600 to-gray-500';
            default:
                return 'from-primary-600 to-cyan-500';
        }
    };

    if (!segments || segments.length === 0) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
        >
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                <span>🗺️</span>
                <span>Step-by-Step Guide</span>
            </h2>

            <div className="space-y-6">
                {segments.map((segment, index) => (
                    <div key={index} className="flex space-x-4">
                        {/* Step Number & Line */}
                        <div className="flex flex-col items-center">
                            <div className={`w-12 h-12 bg-gradient-to-br ${getTransportColor(segment.transportType)} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                                {index + 1}
                            </div>
                            {index < segments.length - 1 && (
                                <div className={`w-1 flex-1 bg-gradient-to-b ${getTransportColor(segment.transportType)} my-2 min-h-[60px]`} />
                            )}
                        </div>

                        {/* Segment Details */}
                        <div className="flex-1 pb-6">
                            {/* Transport Type Header */}
                            <div className="flex items-center space-x-3 mb-3">
                                <span className="text-3xl">{getTransportIcon(segment.transportType)}</span>
                                <div>
                                    <h3 className="font-bold text-lg capitalize">{segment.transportType}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Segment {index + 1} of {segments.length}
                                    </p>
                                </div>
                            </div>

                            {/* Route Info */}
                            <div className="glass p-4 rounded-xl space-y-3">
                                {/* From → To */}
                                <div className="flex items-center space-x-2">
                                    <MapPin size={16} className="text-green-600 dark:text-green-400 flex-shrink-0" />
                                    <span className="font-semibold text-green-700 dark:text-green-400">From:</span>
                                    <span className="text-gray-700 dark:text-gray-300">{segment.originName}</span>
                                </div>

                                <div className="flex items-center space-x-2 pl-6">
                                    <ArrowRight size={16} className="text-gray-400" />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <MapPin size={16} className="text-red-600 dark:text-red-400 flex-shrink-0" />
                                    <span className="font-semibold text-red-700 dark:text-red-400">To:</span>
                                    <span className="text-gray-700 dark:text-gray-300">{segment.destinationName}</span>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <div>
                                        <div className="flex items-center space-x-1 text-xs text-gray-500 mb-1">
                                            <MapPin size={12} />
                                            <span>Distance</span>
                                        </div>
                                        <div className="font-bold">{segment.distance?.toFixed(1) || 'N/A'} km</div>
                                    </div>

                                    <div>
                                        <div className="flex items-center space-x-1 text-xs text-gray-500 mb-1">
                                            <Clock size={12} />
                                            <span>Duration</span>
                                        </div>
                                        <div className="font-bold">{segment.duration} min</div>
                                    </div>

                                    <div>
                                        <div className="flex items-center space-x-1 text-xs text-gray-500 mb-1">
                                            <DollarSign size={12} />
                                            <span>Fare</span>
                                        </div>
                                        <div className="font-bold text-primary-600 dark:text-cyan-400">₱{segment.fare}</div>
                                    </div>
                                </div>

                                {/* Wait Time */}
                                {segment.waitTime > 0 && (
                                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center space-x-2 text-sm">
                                            <Clock size={14} className="text-orange-600 dark:text-orange-400" />
                                            <span className="text-gray-600 dark:text-gray-400">
                                                Expected wait time: <strong>{segment.waitTime} minutes</strong>
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Instructions (Filipino) */}
                            {segment.filipinoInstructions && (
                                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                                    <div className="flex items-start space-x-2">
                                        <span className="text-lg">🗣️</span>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
                                                Paano pumunta:
                                            </p>
                                            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                                                {segment.filipinoInstructions}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Commuter Notes */}
                            {segment.commuterNotes && (
                                <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                                    <div className="flex items-start space-x-2">
                                        <span className="text-lg">💬</span>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-purple-900 dark:text-purple-300 mb-1">
                                                Commuter Tips:
                                            </p>
                                            <p className="text-sm text-purple-700 dark:text-purple-300 italic">
                                                "{segment.commuterNotes}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Transfer Notes */}
                            {segment.transferNotes && (
                                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                                    <div className="flex items-start space-x-2">
                                        <span className="text-xl">🔄</span>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-300 mb-1">
                                                Transfer Information:
                                            </p>
                                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                                {segment.transferNotes}
                                            </p>
                                            {segment.transferTime > 0 && (
                                                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2 flex items-center space-x-1">
                                                    <Clock size={12} />
                                                    <span>Transfer time: ~{segment.transferTime} minutes</span>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Total Summary */}
            <div className="mt-6 pt-6 border-t-2 border-gray-300 dark:border-gray-600">
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Total Distance</p>
                        <p className="text-2xl font-bold">
                            {segments.reduce((sum, seg) => sum + (seg.distance || 0), 0).toFixed(1)} km
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Total Time</p>
                        <p className="text-2xl font-bold">
                            {segments.reduce((sum, seg) => sum + (seg.duration || 0) + (seg.transferTime || 0), 0)} min
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Total Fare</p>
                        <p className="text-2xl font-bold text-primary-600 dark:text-cyan-400">
                            ₱{segments.reduce((sum, seg) => sum + (seg.fare || 0), 0)}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default RouteSegmentDetail;
