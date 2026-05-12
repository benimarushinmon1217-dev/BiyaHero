/**
 * Multi-Route Card Component
 * Displays individual route option with segments, transfers, and Filipino commuter notes
 */

import { motion } from 'framer-motion';
import { Clock, DollarSign, ArrowRight, MapPin, AlertCircle, TrendingUp, Zap, Users, Star, Award } from 'lucide-react';

const MultiRouteCard = ({ route, isSelected, onClick, fareType }) => {
    const getRouteTypeIcon = (type) => {
        switch (type) {
            case 'direct':
                return '🎯';
            case 'split':
                return '🔄';
            case 'hybrid':
                return '🚌';
            default:
                return '🚶';
        }
    };

    const getRouteTypeBadge = (type) => {
        switch (type) {
            case 'direct':
                return { label: 'Direct', color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' };
            case 'split':
                return { label: 'May Transfer', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' };
            case 'hybrid':
                return { label: 'Hybrid', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' };
            default:
                return { label: 'Route', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' };
        }
    };

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

    const getTagColor = (tagColor) => {
        const colors = {
            blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
            green: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
            yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
            red: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
            orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
            purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
            gold: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
        };
        return colors[tagColor] || colors.blue;
    };

    const badge = getRouteTypeBadge(route.routeType);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onClick}
            className={`card cursor-pointer transition-all ${isSelected
                ? 'ring-2 ring-primary-500 shadow-xl bg-primary-50 dark:bg-primary-900/20'
                : 'hover:shadow-lg hover:scale-[1.02]'
                }`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${badge.color}`}>
                    <span>{getRouteTypeIcon(route.routeType)}</span>
                    <span>{badge.label}</span>
                </div>
                {route.recommended && (
                    <div className="px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 rounded-full text-xs font-semibold flex items-center space-x-1">
                        <Star size={12} fill="currentColor" />
                        <span>Recommended</span>
                    </div>
                )}
            </div>

            {/* Route Tags */}
            {route.tags && route.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {route.tags.slice(0, 3).map((tag, idx) => (
                        <div
                            key={idx}
                            className={`px-2 py-0.5 rounded-md text-xs font-medium flex items-center space-x-1 ${getTagColor(tag.color)}`}
                            title={tag.description}
                        >
                            <span>{tag.icon}</span>
                            <span>{tag.label}</span>
                        </div>
                    ))}
                    {route.tags.length > 3 && (
                        <div className="px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                            +{route.tags.length - 3}
                        </div>
                    )}
                </div>
            )}

            {/* Main Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
                {/* Fare */}
                <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-gray-500 dark:text-gray-400 mb-1">
                        <DollarSign size={14} />
                        <span className="text-xs">Fare</span>
                    </div>
                    <div className="text-2xl font-bold text-primary-600 dark:text-cyan-400">
                        ₱{route.totalFare}
                    </div>
                </div>

                {/* Duration */}
                <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-gray-500 dark:text-gray-400 mb-1">
                        <Clock size={14} />
                        <span className="text-xs">Time</span>
                    </div>
                    <div className="text-2xl font-bold">
                        {route.totalDuration}
                        <span className="text-sm font-normal text-gray-500">min</span>
                    </div>
                </div>

                {/* Transfers */}
                <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-gray-500 dark:text-gray-400 mb-1">
                        <ArrowRight size={14} />
                        <span className="text-xs">Transfers</span>
                    </div>
                    <div className="text-2xl font-bold">
                        {route.totalTransfers}
                    </div>
                </div>
            </div>

            {/* Distance */}
            {route.totalDistance && (
                <div className="flex items-center justify-center space-x-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin size={14} />
                    <span>{route.totalDistance.toFixed(1)} km</span>
                </div>
            )}

            {/* Segments Preview */}
            <div className="space-y-2 mb-4">
                {route.segments && route.segments.slice(0, 2).map((segment, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-sm">
                        <span className="text-xl">{getTransportIcon(segment.transportType)}</span>
                        <div className="flex-1 truncate">
                            <span className="font-medium capitalize">{segment.transportType}</span>
                            <span className="text-gray-500 dark:text-gray-400"> • </span>
                            <span className="text-gray-600 dark:text-gray-400 text-xs">{segment.originName}</span>
                            <ArrowRight size={10} className="inline mx-1" />
                            <span className="text-gray-600 dark:text-gray-400 text-xs">{segment.destinationName}</span>
                        </div>
                        <span className="text-xs text-gray-500 font-semibold">₱{segment.fare}</span>
                    </div>
                ))}
                {route.segments && route.segments.length > 2 && (
                    <div className="text-xs text-gray-500 text-center">
                        +{route.segments.length - 2} more segment{route.segments.length - 2 !== 1 ? 's' : ''}
                    </div>
                )}
            </div>

            {/* Commuter Notes (Filipino) */}
            {route.commuterNotes && (
                <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start space-x-2">
                        <span className="text-blue-600 dark:text-blue-400 text-sm">💬</span>
                        <p className="text-xs text-blue-700 dark:text-blue-300 italic">
                            "{route.commuterNotes}"
                        </p>
                    </div>
                </div>
            )}

            {/* Advantages */}
            {route.advantages && route.advantages.length > 0 && (
                <div className="space-y-1 mb-3">
                    {route.advantages.slice(0, 2).map((advantage, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-xs text-green-700 dark:text-green-400">
                            <span className="mt-0.5">✓</span>
                            <span>{advantage}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Disadvantages */}
            {route.disadvantages && route.disadvantages.length > 0 && (
                <div className="space-y-1 mb-3">
                    {route.disadvantages.slice(0, 1).map((disadvantage, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-xs text-orange-700 dark:text-orange-400">
                            <span className="mt-0.5">⚠</span>
                            <span>{disadvantage}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Recommendation Reason */}
            {route.recommendationReason && (
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-start space-x-2">
                        <Award size={14} className="text-primary-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">{route.recommendationReason}</span>
                    </div>
                </div>
            )}

            {/* Comfort & Reliability */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700 mt-3">
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Users size={12} />
                    <span className="capitalize">{route.comfortLevel || 'Standard'}</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Zap size={12} />
                    <span>Reliability: {route.reliability || 7}/10</span>
                </div>
            </div>
        </motion.div>
    );
};

export default MultiRouteCard;
