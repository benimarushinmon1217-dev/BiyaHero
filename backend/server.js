/**
 * Server Entry Point
 * Starts the Express server and initializes database
 */

import app from './app.js';
import { testConnection, syncDatabase } from './config/database.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

/**
 * Start server
 */
const startServer = async () => {
    try {
        // Test database connection
        console.log('🔄 Testing database connection...');
        const isConnected = await testConnection();

        if (!isConnected) {
            console.error('❌ Failed to connect to database');
            process.exit(1);
        }

        // Sync database models
        console.log('🔄 Synchronizing database models...');
        await syncDatabase({ alter: process.env.DB_SYNC_ALTER === 'true' });

        // Start Express server
        app.listen(PORT, '0.0.0.0', () => {
            console.log('');
            console.log('========================================');
            console.log('🚀 BiyaHero API Server Started');
            console.log('========================================');
            console.log(`📡 Server listening on 0.0.0.0:${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`💚 Health check: http://localhost:${PORT}/health`);
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
