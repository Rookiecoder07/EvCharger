import express from 'express';
import { getWallet, addMoney } from '../controllers/wallet.controller.js';
import { verifyAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', verifyAuth, getWallet);
router.post('/add-money', verifyAuth, addMoney);

export default router;
