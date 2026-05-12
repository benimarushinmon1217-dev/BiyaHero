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
        allowNull: false,
        comment: 'Distance in kilometers'
    },
    fare: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Actual fare paid in PHP'
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
