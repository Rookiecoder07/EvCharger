import express from 'express';
import { getOwnerDashboard, getOwnerChargers, addCharger, updateCharger, toggleChargerActive, deleteCharger, getOwnerBookings } from '../controllers/owner.controller.js';
import { verifyAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(verifyAuth);

router.get('/dashboard', getOwnerDashboard);
router.get('/chargers', getOwnerChargers);
router.post('/chargers', addCharger);
router.put('/chargers/:id', updateCharger);
router.put('/chargers/:id/toggle', toggleChargerActive);
router.delete('/chargers/:id', deleteCharger);
router.get('/bookings', getOwnerBookings);

export default router;
