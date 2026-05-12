/**
 * Multi-Modal Route Routes
 * API endpoints for realistic commuter routing
 */

import express from 'express';
import {
    getMultiModalRoutes,
    getTransportHubs,
    getJeepneyRoutes,
    getRouteTags,
    getTransportTypes
} from '../controllers/multiModalRouteController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes - Realistic commuter routing
router.post('/multi-modal', optionalAuth, getMultiModalRoutes);
router.get('/transport-hubs', getTransportHubs);
router.get('/jeepney-routes', getJeepneyRoutes);
router.get('/route-tags', getRouteTags);
router.get('/transport-types', getTransportTypes);

export default router;
