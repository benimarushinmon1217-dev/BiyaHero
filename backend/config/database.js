/**
 * Database Configuration
 * Sequelize MySQL connection setup with proper error handling
 */

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sslOptions = process.env.DB_SSL === 'true'
  ? {
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
    ...(process.env.DB_SSL_CA
      ? { ca: process.env.DB_SSL_CA.replace(/\\n/g, '\n') }
      : {})
  }
  : undefined;

// Validate required environment variables
const requiredEnvVars = ['DB_NAME', 'DB_USER', 'DB_HOST'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  process.exit(1);
}

// Initialize Sequelize with MySQL connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD || '', // XAMPP default is empty password
  {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    },
    dialectOptions: {
      charset: 'utf8mb4',
      dateStrings: true,
      typeCast: true,
      ...(sslOptions ? { ssl: sslOptions } : {})
    },
    timezone: '+08:00' // Philippine timezone
  }
);

/**
 * Test database connection
 * @returns {Promise<boolean>} True if connection successful
 */
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');
    console.log(`📊 Connected to: ${process.env.DB_NAME} on ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to database:', error.message);
    console.error('💡 Make sure MySQL is running in XAMPP');
    console.error('💡 Check database credentials in .env file');
    return false;
  }
};

/**
 * Sync all models with database
 * Uses alter: true to update existing tables without dropping data
 * @param {Object} options - Sequelize sync options
 */
export const syncDatabase = async (options = {}) => {
  try {
    const syncOptions = {
      alter: process.env.NODE_ENV === 'development', // Only alter in development
      ...options
    };

    await sequelize.sync(syncOptions);

    console.log('✅ Database synchronized successfully');

    if (syncOptions.alter) {
      console.log('📝 Tables updated with alter: true (safe mode)');
    }

    // Log all registered models
    const models = Object.keys(sequelize.models);
    console.log(`📋 Registered models (${models.length}):`, models.join(', '));

  } catch (error) {
    console.error('❌ Database sync failed:', error.message);
    throw error;
  }
};

/**
 * Close database connection
 */
export const closeConnection = async () => {
  try {
    await sequelize.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error closing database connection:', error.message);
  }
};

export default sequelize;
