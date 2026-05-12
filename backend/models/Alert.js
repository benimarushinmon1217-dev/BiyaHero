/**
 * Alert Model
 * Traffic alerts, road closures, and notifications
 */

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Alert = sequelize.define('Alert', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('traffic', 'closure', 'weather', 'service', 'emergency'),
        allowNull: false
    },
    severity: {
        type: DataTypes.ENUM('info', 'warning', 'danger', 'success'),
        defaultValue: 'info'
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Affected location or route'
    },
    municipality: {
        type: DataTypes.STRING,
        allowNull: true
    },
    lat: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true
    },
    lng: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Null for indefinite alerts'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    affectedRoutes: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Array of affected route IDs or names'
    },
    source: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Source of the alert (admin, system, external)'
    }
}, {
    tableName: 'alerts',
    timestamps: true,
    indexes: [
        {
            fields: ['is_active'] // Use underscored version
        },
        {
            fields: ['type']
        },
        {
            fields: ['severity']
        },
        {
            fields: ['start_date', 'end_date'] // Use underscored version
        }
    ]
});

export default Alert;
