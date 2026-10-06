import express from 'express';
import { getChargerReviews, addReview, getSavedChargers, saveCharger, unsaveCharger } from '../controllers/reviews.controller.js';
import { verifyAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/charger/:id', getChargerReviews);
router.post('/', verifyAuth, addReview);

export default router;
