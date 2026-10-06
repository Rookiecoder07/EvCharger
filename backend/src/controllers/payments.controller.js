import { supabase } from '../config/supabase.js';

export const processPayment = async (req, res) => {
  try {
    const { booking_id, amount, payment_method, upi_id } = req.body;

    if (!booking_id || !amount) {
      return res.status(400).json({ success: false, error: 'Missing booking details' });
    }

    const { data: booking, error: bErr } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', booking_id)
      .eq('user_id', req.userId)
      .single();

    if (bErr || !booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    const txnId = `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    if (payment_method === 'wallet') {
      const { data: profile } = await supabase
        .from('profiles')
        .select('wallet_balance, ev_points')
        .eq('id', req.userId)
        .single();

      const currentBalance = Number(profile?.wallet_balance || 0);
      const chargeAmount = Number(amount);

      if (currentBalance < chargeAmount) {
        return res.status(400).json({ success: false, error: 'Insufficient wallet balance' });
      }

      const newBalance = currentBalance - chargeAmount;
      const newPoints = (profile?.ev_points || 0) + 50; // reward points

      // Deduct wallet and add reward points
      await supabase.from('profiles').update({
        wallet_balance: newBalance,
        ev_points: newPoints
      }).eq('id', req.userId);

      // Record transaction
      await supabase.from('wallet_transactions').insert({
        user_id: req.userId,
        type: 'debit',
        category: 'booking_payment',
        amount: chargeAmount,
        description: `Charging slot payment for booking #${booking_id.slice(0, 8)}`,
        reference_id: booking_id,
        balance_after: newBalance
      });
    }

    // Record payment in payments table
    await supabase.from('payments').insert({
      user_id: req.userId,
      booking_id,
      amount,
      payment_method: payment_method || 'upi',
      transaction_id: txnId,
      status: 'successful'
    });

    // Mark booking confirmed & paid
    const { data: updatedBooking, error: upErr } = await supabase
      .from('bookings')
      .update({
        status: 'confirmed',
        payment_status: 'successful'
      })
      .eq('id', booking_id)
      .select()
      .single();

    if (upErr) throw upErr;

    res.json({
      success: true,
      message: 'Payment verified and booking confirmed',
      data: {
        transaction_id: txnId,
        booking: updatedBooking
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
