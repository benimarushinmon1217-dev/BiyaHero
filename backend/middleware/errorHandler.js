/**
 * Error Handling Middleware
 * Centralized error handling for the application
 */

import { ApiError } from '../utils/ApiError.js';

/**
 * Global error handler
 */
export const errorHandler = (err, req, res, next) => {
    const originalError = err;
    let error = err;

    // Convert non-ApiError errors to ApiError
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = statusCode >= 500 ? 'Internal Server Error' : error.message || 'Request failed';
        error = new ApiError(statusCode, message, error.stack);
    }

    if (error.statusCode >= 500 || process.env.NODE_ENV === 'development') {
        console.error('Error:', {
            method: req.method,
            path: req.originalUrl,
            message: originalError.message,
            statusCode: error.statusCode,
            stack: originalError.stack
        });
    }

    // Send error response
    res.status(error.statusCode).json({
        success: false,
        error: {
            message: error.message,
            statusCode: error.statusCode
        }
    });
};

/**
 * Handle 404 errors
 */
export const notFound = (req, res, next) => {
    const error = new ApiError(404, `Route ${req.originalUrl} not found`);
    next(error);
};

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

export default {
    errorHandler,
    notFound,
    asyncHandler
};
