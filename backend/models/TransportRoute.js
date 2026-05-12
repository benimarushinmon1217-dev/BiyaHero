/**
 * TransportRoute Model
 * Actual jeepney, bus, and tricycle routes in Batangas
 */

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const TransportRoute = sequelize.define('TransportRoute', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    routeName: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Route name (e.g., "Lipa-Batangas", "Antipolo-Bayan")'
    },
    transportType: {
        type: DataTypes.ENUM('jeepney', 'bus', 'tricycle', 'uv_express', 'van', 'walking'),
        allowNull: false
    },
    originHubId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'transport_hubs',
            key: 'id'
        }
    },
    destinationHubId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'transport_hubs',
            key: 'id'
        }
    },
    originName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    destinationName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    distance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Distance in kilometers'
    },
    estimatedDuration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Duration in minutes'
    },
    baseFare: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Base fare in PHP'
    },
    farePerKm: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Additional fare per km'
    },
    routeGeometry: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'GeoJSON route geometry'
    },
    intermediateStops: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        comment: 'Array of intermediate stops'
    },
    operatingHours: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Operating schedule'
    },
    frequency: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Average frequency in minutes'
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Vehicle capacity'
    },
    comfortLevel: {
        type: DataTypes.ENUM('basic', 'standard', 'comfortable', 'premium'),
        defaultValue: 'standard'
    },
    reliability: {
        type: DataTypes.INTEGER,
        defaultValue: 5,
        validate: {
            min: 1,
            max: 10
        },
        comment: 'Reliability score (1-10)'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Route-specific notes and tips'
    }
}, {
    tableName: 'transport_routes',
    timestamps: true,
    indexes: [
        {
            fields: ['transport_type'] // Use underscored version
        },
        {
            fields: ['origin_hub_id'] // Use underscored version
        },
        {
            fields: ['destination_hub_id'] // Use underscored version
        },
        {
            fields: ['is_active'] // Use underscored version
        }
    ]
});

export default TransportRoute;
