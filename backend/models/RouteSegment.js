/**
 * RouteSegment Model
 * Individual segments of a multi-modal route
 */

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const RouteSegment = sequelize.define('RouteSegment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    multiModalRouteId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Parent multi-modal route ID'
    },
    segmentOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Order in the route sequence (1, 2, 3...)'
    },
    transportRouteId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'transport_routes',
            key: 'id'
        }
    },
    transportType: {
        type: DataTypes.ENUM('jeepney', 'bus', 'tricycle', 'uv_express', 'van', 'walking'),
        allowNull: false
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
        comment: 'Segment distance in kilometers'
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Segment duration in minutes'
    },
    fare: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Segment fare in PHP'
    },
    waitTime: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: 'Expected wait time in minutes'
    },
    transferTime: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: 'Transfer time to next segment in minutes'
    },
    geometry: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Segment route geometry'
    },
    instructions: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Commuter instructions for this segment'
    },
    transferNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Transfer instructions to next segment'
    }
}, {
    tableName: 'route_segments',
    timestamps: true,
    indexes: [
        {
            fields: ['multi_modal_route_id', 'segment_order'] // Use underscored version
        },
        {
            fields: ['transport_route_id'] // Use underscored version
        },
        {
            fields: ['transport_type'] // Use underscored version
        }
    ]
});

export default RouteSegment;
