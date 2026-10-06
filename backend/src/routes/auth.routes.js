import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

router.post('/profile-init', async (req, res) => {
  try {
    const { userId, fullName } = req.body;
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: fullName,
        wallet_balance: 500.00, // Welcome credits
        ev_points: 100,         // Welcome reward points
        created_at: new Date()
      })
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
