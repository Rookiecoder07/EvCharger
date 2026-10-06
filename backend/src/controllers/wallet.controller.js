import { supabase } from '../config/supabase.js';

export const getWallet = async (req, res) => {
  try {
    const { data: profile, error: pErr } = await supabase
      .from('profiles')
      .select('wallet_balance, ev_points')
      .eq('id', req.userId)
      .single();

    if (pErr) throw pErr;

    const { data: transactions, error: tErr } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (tErr) throw tErr;

    res.json({
      success: true,
      data: {
        balance: profile?.wallet_balance || 0,
        ev_points: profile?.ev_points || 0,
        transactions: transactions || []
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const addMoney = async (req, res) => {
  try {
    const { amount } = req.body;
    const addVal = Number(amount);

    if (!addVal || addVal <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid deposit amount' });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('wallet_balance')
      .eq('id', req.userId)
      .single();

    const currentBalance = Number(profile?.wallet_balance || 0);
    const newBalance = currentBalance + addVal;

    await supabase.from('profiles').update({ wallet_balance: newBalance }).eq('id', req.userId);

    await supabase.from('wallet_transactions').insert({
      user_id: req.userId,
      type: 'credit',
      category: 'top_up',
      amount: addVal,
      description: `Wallet top-up deposit`,
      balance_after: newBalance
    });

    res.json({
      success: true,
      message: `Successfully credited ₹${addVal} to wallet`,
      data: { wallet_balance: newBalance }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
