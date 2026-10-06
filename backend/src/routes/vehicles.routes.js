import express from 'express';
import { getVehicles, addVehicle, deleteVehicle } from '../controllers/vehicles.controller.js';
import { verifyAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', verifyAuth, getVehicles);
router.post('/', verifyAuth, addVehicle);
router.delete('/:id', verifyAuth, deleteVehicle);

export default router;
