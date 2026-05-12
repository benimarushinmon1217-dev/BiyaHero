/**
 * TransportHub Model
 * Major transfer points and commuter hubs in Batangas
 */

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const TransportHub = sequelize.define('TransportHub', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Hub name (e.g., Lipa Bayan, SM Lipa)'
    },
    displayName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    municipality: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lat: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false
    },
    lng: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false
    },
    hubType: {
        type: DataTypes.ENUM('terminal', 'landmark', 'commercial', 'institutional', 'intersection'),
        allowNull: false,
        comment: 'Type of hub'
    },
    importance: {
        type: DataTypes.INTEGER,
        defaultValue: 5,
        validate: {
            min: 1,
            max: 10
        },
        comment: 'Hub importance for routing (1-10)'
    },
    availableTransport: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Array of available transport types at this hub'
    },
    operatingHours: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Operating hours for the hub'
    },
    facilities: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Available facilities (waiting area, restroom, etc.)'
    },
    averageWaitTime: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Average wait time in minutes'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Additional information about the hub'
    }
}, {
    tableName: 'transport_hubs',
    timestamps: true,
    indexes: [
        {
            fields: ['municipality']
        },
        {
            fields: ['hub_type'] // Use underscored version
        },
        {
            fields: ['importance']
        },
        {
            fields: ['is_active'] // Use underscored version
        }
    ]
});

export default TransportHub;
