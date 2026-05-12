/**
 * Authentication Routes
 */

import express from 'express';
import {
    register,
    login,
    getMe,
    updateProfile,
    changePassword
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';
import {
    registerValidation,
    loginValidation,
    updateProfileValidation
} from '../validations/authValidation.js';

const router = express.Router();

// Public routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);

// Protected routes
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfileValidation, validate, updateProfile);
router.post('/change-password', authenticate, changePassword);

export default router;
