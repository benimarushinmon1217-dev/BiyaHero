/**
 * Express Application Setup
 * Main application configuration
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import middleware
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import multiModalRouteRoutes from './routes/multiModalRouteRoutes.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration - Allow multiple origins for development
const allowedOrigins = [
    'http://localhost:5173',  // Vite default
    'http://localhost:3000',  // Vite config port
    'http://localhost:3001',  // Alternative port
    'http://localhost:5174',  // Vite alternative
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman, curl)
        if (!origin) return callback(null, true);

        // Check if origin is in allowed list
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
});
app.use('/api/', limiter);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Health check route
app.get('/health', async (req, res) => {
    const startTime = Date.now();

    // Check database connection
    let dbStatus = 'disconnected';
    let dbMessage = 'Database not configured';

    try {
        // Try to import sequelize if it exists
        const { default: sequelize } = await import('./config/database.js').catch(() => ({ default: null }));

        if (sequelize) {
            await sequelize.authenticate();
            dbStatus = 'connected';
            dbMessage = 'Database connection successful';
        }
    } catch (error) {
        dbStatus = 'error';
        dbMessage = error.message;
    }

    const responseTime = Date.now() - startTime;

    res.json({
        success: true,
        status: 'healthy',
        message: 'BiyaHero API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime(),
        database: {
            status: dbStatus,
            message: dbMessage
        },
        server: {
            port: process.env.PORT || 5000,
            nodeVersion: process.version,
            platform: process.platform
        },
        responseTime: `${responseTime}ms`
    });
});

// API routes
const API_VERSION = process.env.API_VERSION || 'v1';
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/routes`, multiModalRouteRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

export default app;
