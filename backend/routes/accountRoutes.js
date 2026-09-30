import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
    createSavedPlace,
    createTrip,
    deleteSavedPlace,
    deleteTrip,
    getAchievements,
    getAssistantSuggestionsForLocation,
    getPlace,
    getPlaces,
    getProfile,
    getSavedPlaces,
    getTrips,
    updatePreferences,
    updateSavedPlace,
    updateTrip,
    respondToAssistant
} from '../controllers/accountController.js';

const router = express.Router();
router.use(authenticate);

router.get('/users/me', getProfile);
router.put('/users/me/preferences', updatePreferences);
router.get('/users/me/achievements', getAchievements);
router.post('/assistant/respond', respondToAssistant);
router.post('/assistant/suggestions', getAssistantSuggestionsForLocation);
router.get('/saved-places', getSavedPlaces);
router.post('/saved-places', createSavedPlace);
router.put('/saved-places/:id', updateSavedPlace);
router.delete('/saved-places/:id', deleteSavedPlace);
router.get('/trips', getTrips);
router.post('/trips', createTrip);
router.put('/trips/:id', updateTrip);
router.delete('/trips/:id', deleteTrip);
router.get('/places', getPlaces);
router.get('/places/:id', getPlace);

export default router;
