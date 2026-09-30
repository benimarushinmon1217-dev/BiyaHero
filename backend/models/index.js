/**
 * Models Index
 * Central export for all Sequelize models with associations
 */

import sequelize from '../config/database.js';
import User from './User.js';
import SavedRoute from './SavedRoute.js';
import TripHistory from './TripHistory.js';
import AIConversation from './AIConversation.js';
import Alert from './Alert.js';
import TransportHub from './TransportHub.js';
import TransportRoute from './TransportRoute.js';
import RouteSegment from './RouteSegment.js';
import SavedPlace from './SavedPlace.js';

/**
 * Define Model Associations
 * IMPORTANT: Define associations BEFORE syncing database
 */

// User has many SavedRoutes
User.hasMany(SavedRoute, {
    foreignKey: 'user_id', // Use underscored version
    as: 'savedRoutes',
    onDelete: 'CASCADE'
});
SavedRoute.belongsTo(User, {
    foreignKey: 'user_id', // Use underscored version
    as: 'user'
});

// User has many TripHistory records
User.hasMany(TripHistory, {
    foreignKey: 'user_id', // Use underscored version
    as: 'tripHistory',
    onDelete: 'CASCADE'
});
TripHistory.belongsTo(User, {
    foreignKey: 'user_id', // Use underscored version
    as: 'user'
});

User.hasMany(SavedPlace, {
    foreignKey: 'user_id',
    as: 'savedPlaces',
    onDelete: 'CASCADE'
});
SavedPlace.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

// User has many AIConversations
User.hasMany(AIConversation, {
    foreignKey: 'user_id', // Use underscored version
    as: 'conversations',
    onDelete: 'SET NULL'
});
AIConversation.belongsTo(User, {
    foreignKey: 'user_id', // Use underscored version
    as: 'user'
});

// TransportRoute belongs to TransportHub (origin)
TransportRoute.belongsTo(TransportHub, {
    foreignKey: 'origin_hub_id', // Use underscored version
    as: 'originHub'
});

// TransportRoute belongs to TransportHub (destination)
TransportRoute.belongsTo(TransportHub, {
    foreignKey: 'destination_hub_id', // Use underscored version
    as: 'destinationHub'
});

// TransportHub has many TransportRoutes (as origin)
TransportHub.hasMany(TransportRoute, {
    foreignKey: 'origin_hub_id', // Use underscored version
    as: 'routesFromHub'
});

// TransportHub has many TransportRoutes (as destination)
TransportHub.hasMany(TransportRoute, {
    foreignKey: 'destination_hub_id', // Use underscored version
    as: 'routesToHub'
});

// RouteSegment belongs to TransportRoute
RouteSegment.belongsTo(TransportRoute, {
    foreignKey: 'transport_route_id', // Use underscored version
    as: 'transportRoute'
});

// TransportRoute has many RouteSegments
TransportRoute.hasMany(RouteSegment, {
    foreignKey: 'transport_route_id', // Use underscored version
    as: 'segments'
});

/**
 * Export all models and sequelize instance
 */
export {
    sequelize,
    User,
    SavedRoute,
    TripHistory,
    AIConversation,
    Alert,
    TransportHub,
    TransportRoute,
    RouteSegment,
    SavedPlace
};

export default {
    sequelize,
    User,
    SavedRoute,
    TripHistory,
    AIConversation,
    Alert,
    TransportHub,
    TransportRoute,
    RouteSegment,
    SavedPlace
};
