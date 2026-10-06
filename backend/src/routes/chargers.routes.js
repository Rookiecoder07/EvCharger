import express from 'express';
import { getChargers, getChargerById } from '../controllers/chargers.controller.js';

const router = express.Router();

router.get('/', getChargers);
router.get('/:id', getChargerById);

export default router;
