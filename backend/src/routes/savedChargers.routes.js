import express from 'express';
import { getSavedChargers, saveCharger, unsaveCharger } from '../controllers/reviews.controller.js';
import { verifyAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(verifyAuth);

router.get('/', getSavedChargers);
router.post('/', saveCharger);
router.delete('/:chargerId', unsaveCharger);

export default router;
