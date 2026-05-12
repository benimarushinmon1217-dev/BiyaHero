/**
 * Validation Middleware
 * Request validation using express-validator
 */

import { validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiError.js';

/**
 * Validate request and return errors if any
 */
export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => ({
            field: err.path,
            message: err.msg
        }));

        throw new ApiError(400, 'Validation failed', errorMessages);
    }

    next();
};

export default validate;
