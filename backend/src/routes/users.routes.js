import express from 'express';
import { getProfile, updateProfile } from '../controllers/users.controller.js';
import { verifyAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/profile', verifyAuth, getProfile);
router.put('/profile', verifyAuth, updateProfile);

export default router;
