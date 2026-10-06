import express from 'express';
import { processPayment } from '../controllers/payments.controller.js';
import { verifyAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/process', verifyAuth, processPayment);

export default router;
