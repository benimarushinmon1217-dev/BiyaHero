/**
 * TripHistory Model
 * Records of completed trips
 */

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const TripHistory = sequelize.define('TripHistory', {
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
    originName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    originLat: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true
    },
    originLng: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true
    },
    destinationName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    destinationLat: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true
    },
    destinationLng: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true
    },
    distance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Distance in kilometers'
    },
    fare: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Actual fare paid in PHP'
    },
    baselineFare: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: { min: 0 }
    },
    originMunicipality: {
        type: DataTypes.STRING(120),
        allowNull: true
    },
    destinationMunicipality: {
        type: DataTypes.STRING(120),
        allowNull: true
    },
    routeId: {
        type: DataTypes.STRING(120),
        allowNull: true
    },
    segments: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    },
    transfers: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 }
    },
    source: {
        type: DataTypes.ENUM('route', 'expense'),
        allowNull: false,
        defaultValue: 'route'
    },
    passengerType: {
        type: DataTypes.ENUM('regular', 'student', 'senior', 'pwd'),
        allowNull: false
    },
    transportType: {
        type: DataTypes.STRING,
        allowNull: true
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Trip duration in minutes'
    },
    tripDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1,
            max: 5
        }
    },
    feedback: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'trip_history',
    timestamps: true,
    indexes: [
        {
            fields: ['user_id'] // Use underscored version
        },
        {
            fields: ['trip_date'] // Use underscored version
        },
        {
            fields: ['user_id', 'trip_date'] // Use underscored version
        }
    ]
});

export default TripHistory;
