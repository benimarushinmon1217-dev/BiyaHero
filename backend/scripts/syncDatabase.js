import '../models/index.js';
import { closeConnection, syncDatabase } from '../config/database.js';

try {
    await syncDatabase({ alter: process.env.DB_SYNC_ALTER === 'true' });
} catch (error) {
    console.error('Database synchronization failed:', error.message || error.name);
    process.exitCode = 1;
} finally {
    await closeConnection();
}