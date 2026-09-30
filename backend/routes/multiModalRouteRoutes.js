/**
 * Multi-Modal Route Routes
 * API endpoints for realistic commuter routing
 */

import express from 'express';
import {
    getMultiModalRoutes,
    getRoutePlan,
    calculateSegmentFareEstimate,
    getTransportHubs,
    getJeepneyRoutes,
    getRouteTags,
    getTransportTypes,
    getPopularRoutes
} from '../controllers/multiModalRouteController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes - Realistic commuter routing
router.post('/multi-modal', authenticate, getMultiModalRoutes);
router.post('/plan', authenticate, getRoutePlan);
router.post('/calculate-segment-fare', authenticate, calculateSegmentFareEstimate);
router.get('/transport-hubs', getTransportHubs);
router.get('/jeepney-routes', getJeepneyRoutes);
router.get('/route-tags', getRouteTags);
router.get('/transport-types', getTransportTypes);
router.get('/popular', getPopularRoutes);

export default router;
