/**
 * AIConversation Model
 * AI assistant chat history
 */

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const AIConversation = sequelize.define('AIConversation', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'SET NULL',
        comment: 'Null for anonymous users'
    },
    sessionId: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Session identifier for grouping conversations'
    },
    userMessage: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    aiResponse: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    context: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Additional context (location, route info, etc.)'
    },
    responseTime: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Response time in milliseconds'
    },
    wasHelpful: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        comment: 'User feedback on response quality'
    }
}, {
    tableName: 'ai_conversations',
    timestamps: true,
    indexes: [
        {
            fields: ['user_id'] // Use underscored version
        },
        {
            fields: ['session_id'] // Use underscored version
        },
        {
            fields: ['created_at'] // Use underscored version
        }
    ]
});

export default AIConversation;
