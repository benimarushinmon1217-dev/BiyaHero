/**
 * Mock Database Configuration
 * Temporary solution to run backend without MySQL
 * USE ONLY FOR TESTING - NOT FOR PRODUCTION
 */

import dotenv from 'dotenv';

dotenv.config();

// Mock sequelize object
const mockSequelize = {
    authenticate: async () => {
        console.log('⚠️  Using MOCK database (no MySQL required)');
        return Promise.resolve();
    },
    sync: async () => {
        console.log('⚠️  Mock database sync (no actual database)');
        return Promise.resolve();
    }
};

/**
 * Test database connection (mock)
 */
export const testConnection = async () => {
    try {
        await mockSequelize.authenticate();
        console.log('✅ Mock database connection established');
        console.log('⚠️  WARNING: Using mock database - data will not persist!');
        console.log('⚠️  Install MySQL and update backend/server.js to use real database');
        return true;
    } catch (error) {
        console.error('❌ Mock connection failed:', error.message);
        return false;
    }
};

/**
 * Sync all models with database (mock)
 */
export const syncDatabase = async (options = {}) => {
    try {
        await mockSequelize.sync(options);
        console.log('✅ Mock database synchronized');
        return true;
    } catch (error) {
        console.error('❌ Mock database sync failed:', error.message);
        throw error;
    }
};

export default mockSequelize;
