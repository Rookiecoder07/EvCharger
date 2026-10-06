import express from 'express';
import { createBooking, getBookings, getBookingById, cancelBooking } from '../controllers/bookings.controller.js';
import { verifyAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', verifyAuth, createBooking);
router.get('/', verifyAuth, getBookings);
router.get('/:id', verifyAuth, getBookingById);
router.put('/:id/cancel', verifyAuth, cancelBooking);

export default router;
