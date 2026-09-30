import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const SavedPlace = sequelize.define('SavedPlace', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
    },
    name: {
        type: DataTypes.STRING(120),
        allowNull: false,
        validate: { notEmpty: true, len: [1, 120] }
    },
    label: {
        type: DataTypes.ENUM('home', 'work', 'school', 'favorite', 'custom'),
        allowNull: false,
        defaultValue: 'favorite'
    },
    lat: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false,
        validate: { min: -90, max: 90 }
    },
    lng: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false,
        validate: { min: -180, max: 180 }
    },
    formattedAddress: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    barangay: {
        type: DataTypes.STRING(120),
        allowNull: true
    },
    municipality: {
        type: DataTypes.STRING(120),
        allowNull: false
    },
    province: {
        type: DataTypes.STRING(120),
        allowNull: false,
        defaultValue: 'Batangas'
    }
}, {
    tableName: 'saved_places',
    timestamps: true,
    indexes: [
        { fields: ['user_id'] },
        { fields: ['user_id', 'label'] }
    ]
});

export default SavedPlace;
