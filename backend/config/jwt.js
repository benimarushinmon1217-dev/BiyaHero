/**
 * JWT Configuration
 * Token generation and verification settings
 */

import dotenv from 'dotenv';
import { randomBytes } from 'node:crypto';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const getSecret = (name) => {
    const secret = process.env[name];

    if (secret) {
        if (isProduction && (secret.length < 32 || /^(your_|default_|change_me)/i.test(secret))) {
            throw new Error(`${name} must be a strong, non-placeholder secret in production`);
        }
        return secret;
    }

    if (isProduction) {
        throw new Error(`${name} must be configured in production`);
    }

    return randomBytes(32).toString('hex');
};

export const jwtConfig = {
    secret: getSecret('JWT_SECRET'),
    refreshSecret: getSecret('JWT_REFRESH_SECRET'),
    expiresIn: process.env.JWT_EXPIRE || '7d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
    algorithm: 'HS256'
};

export default jwtConfig;
