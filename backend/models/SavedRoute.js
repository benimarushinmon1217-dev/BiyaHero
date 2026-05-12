/**
 * SavedRoute Model
 * User's saved/favorite routes
 */

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const SavedRoute = sequelize.define('SavedRoute', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    routeName: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'User-defined name for the route'
    },
    originName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    originLat: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false
    },
    originLng: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false
    },
    destinationName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    destinationLat: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false
    },
    destinationLng: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false
    },
    distance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Distance in kilometers'
    },
    estimatedFare: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Estimated fare in PHP'
    },
    transportType: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Primary transport type (jeepney, bus, etc.)'
    },
    usageCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Number of times this route was used'
    },
    isFavorite: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'saved_routes',
    timestamps: true,
    indexes: [
        {
            fields: ['user_id'] // Use underscored version
        },
        {
            fields: ['user_id', 'is_favorite'] // Use underscored version
        }
    ]
});

export default SavedRoute;
