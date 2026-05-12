/**
 * Authentication Validation Schemas
 * Input validation for auth routes
 */

import { body } from 'express-validator';

export const registerValidation = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),

    body('firstName')
        .trim()
        .notEmpty()
        .withMessage('First name is required')
        .isLength({ min: 2 })
        .withMessage('First name must be at least 2 characters'),

    body('lastName')
        .trim()
        .notEmpty()
        .withMessage('Last name is required')
        .isLength({ min: 2 })
        .withMessage('Last name must be at least 2 characters'),

    body('phoneNumber')
        .optional()
        .matches(/^[0-9+\-\s()]*$/)
        .withMessage('Invalid phone number format'),

    body('passengerType')
        .optional()
        .isIn(['regular', 'student', 'senior', 'pwd'])
        .withMessage('Invalid passenger type')
];

export const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

export const updateProfileValidation = [
    body('firstName')
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage('First name must be at least 2 characters'),

    body('lastName')
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage('Last name must be at least 2 characters'),

    body('phoneNumber')
        .optional()
        .matches(/^[0-9+\-\s()]*$/)
        .withMessage('Invalid phone number format'),

    body('passengerType')
        .optional()
        .isIn(['regular', 'student', 'senior', 'pwd'])
        .withMessage('Invalid passenger type')
];

export default {
    registerValidation,
    loginValidation,
    updateProfileValidation
};
