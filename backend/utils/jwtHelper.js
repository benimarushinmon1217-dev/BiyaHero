/**
 * JWT Helper Functions
 * Token generation and verification utilities
 */

import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.js';

/**
 * Generate access token
 */
export const generateAccessToken = (userId) => {
    return jwt.sign(
        { id: userId },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn }
    );
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = (userId) => {
    return jwt.sign(
        { id: userId },
        jwtConfig.refreshSecret,
        { expiresIn: jwtConfig.refreshExpiresIn }
    );
};

/**
 * Generate both tokens
 */
export const generateTokens = (userId) => {
    return {
        accessToken: generateAccessToken(userId),
        refreshToken: generateRefreshToken(userId)
    };
};

/**
 * Verify access token
 */
export const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, jwtConfig.secret);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, jwtConfig.refreshSecret);
    } catch (error) {
        throw new Error('Invalid or expired refresh token');
    }
};

export default {
    generateAccessToken,
    generateRefreshToken,
    generateTokens,
    verifyAccessToken,
    verifyRefreshToken
};
