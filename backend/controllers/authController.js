/**
 * Authentication Controller
 * Handles user registration, login, and authentication
 */

import { User } from '../models/index.js';
import { generateTokens } from '../utils/jwtHelper.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register new user
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
    const { email, password, firstName, lastName, phoneNumber, passengerType } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new ApiError(400, 'Email already registered');
    }

    // Create user
    const user = await User.create({
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        passengerType: passengerType || 'regular'
    });

    // Generate tokens
    const tokens = generateTokens(user.id);

    // Return user data and tokens
    ApiResponse.created(res, {
        user: user.toJSON(),
        ...tokens
    }, 'Registration successful');
});

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new ApiError(401, 'Invalid credentials');
    }

    // Check if account is active
    if (!user.isActive) {
        throw new ApiError(401, 'Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid credentials');
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Generate tokens
    const tokens = generateTokens(user.id);

    // Return user data and tokens
    ApiResponse.success(res, {
        user: user.toJSON(),
        ...tokens
    }, 'Login successful');
});

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.userId);

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    ApiResponse.success(res, { user: user.toJSON() });
});

/**
 * @route   PUT /api/v1/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
    const { firstName, lastName, phoneNumber, passengerType } = req.body;

    const user = await User.findByPk(req.userId);

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    // Update user
    await user.update({
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phoneNumber && { phoneNumber }),
        ...(passengerType && { passengerType })
    });

    ApiResponse.success(res, { user: user.toJSON() }, 'Profile updated successfully');
});

/**
 * @route   POST /api/v1/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
        throw new ApiError(401, 'Current password is incorrect');
    }

    // Update password
    await user.update({ password: newPassword });

    ApiResponse.success(res, null, 'Password changed successfully');
});

export default {
    register,
    login,
    getMe,
    updateProfile,
    changePassword
};
