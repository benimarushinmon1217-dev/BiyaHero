/**
 * Mock Server Entry Point
 * Starts the Express server WITHOUT MySQL database
 * USE THIS TEMPORARILY until you install MySQL
 */

import app from './app.js';
import { testConnection, syncDatabase } from './config/database.mock.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

/**
 * Start server with mock database
 */
const startServer = async () => {
    try {
        console.log('');
        console.log('========================================');
        console.log('⚠️  STARTING IN MOCK MODE');
        console.log('========================================');

        // Test mock database connection
        console.log('🔄 Testing mock database connection...');
        const isConnected = await testConnection();

        if (!isConnected) {
            console.error('❌ Failed to initialize mock database');
            process.exit(1);
        }

        // Sync mock database
        console.log('🔄 Synchronizing mock database...');
        await syncDatabase({ alter: true });

        // Start Express server
        app.listen(PORT, () => {
            console.log('');
            console.log('========================================');
            console.log('🚀 BiyaHero API Server Started (MOCK MODE)');
            console.log('========================================');
            console.log(`📡 Server running on port ${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔗 API URL: http://localhost:${PORT}/api/${process.env.API_VERSION || 'v1'}`);
            console.log(`💚 Health check: http://localhost:${PORT}/health`);
            console.log('');
            console.log('⚠️  WARNING: Using MOCK database');
            console.log('⚠️  Data will NOT persist between restarts');
            console.log('⚠️  Install MySQL for production use');
            console.log('========================================');
            console.log('');
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Promise Rejection:', err.message);
    process.exit(1);
});

// Start the server
startServer();
