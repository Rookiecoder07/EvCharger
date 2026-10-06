import { supabase } from '../config/supabase.js';

export const createBooking = async (req, res) => {
  try {
    const { charger_id, vehicle_id, booking_date, start_time, end_time, duration_minutes, estimated_kwh, amount } = req.body;

    if (!charger_id || !booking_date || !start_time || !end_time || !amount) {
      return res.status(400).json({ success: false, error: 'Missing required booking fields' });
    }

    // 1. Critical Server-Side Double-Booking Check
    const { data: conflicts, error: conflictErr } = await supabase
      .from('bookings')
      .select('id, start_time, end_time')
      .eq('charger_id', charger_id)
      .eq('booking_date', booking_date)
      .neq('status', 'cancelled')
      .lt('start_time', end_time)
      .gt('end_time', start_time);

    if (conflictErr) throw conflictErr;

    if (conflicts && conflicts.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Sorry, this charging slot is no longer available. Please select another time window.'
      });
    }

    // 2. Create pending booking record
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        user_id: req.userId,
        charger_id,
        vehicle_id,
        booking_date,
        start_time,
        end_time,
        duration_minutes,
        estimated_kwh,
        amount,
        status: 'pending',
        payment_status: 'pending'
      })
      .select('*, chargers(name, address, city, price_per_kwh)')
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getBookings = async (req, res) => {
  try {
    const { upcoming } = req.query;
    const today = new Date().toISOString().split('T')[0];

    let query = supabase
      .from('bookings')
      .select('*, chargers(name, address, city, power_kw, connector_type)')
      .eq('user_id', req.userId);

    if (upcoming === 'true') {
      query = query.gte('booking_date', today).neq('status', 'cancelled');
    } else if (upcoming === 'false') {
      query = query.or(`booking_date.lt.${today},status.eq.cancelled,status.eq.completed`);
    }

    const { data, error } = await query.order('booking_date', { ascending: false }).order('start_time', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('bookings')
      .select('*, chargers(name, address, city, power_kw, price_per_kwh)')
      .eq('id', id)
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    // Get current booking
    const { data: booking, error: bErr } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.userId)
      .single();

    if (bErr || !booking) return res.status(404).json({ success: false, error: 'Booking not found' });
    if (booking.status === 'cancelled') return res.status(400).json({ success: false, error: 'Already cancelled' });

    // Mark cancelled
    const { error: updErr } = await supabase
      .from('bookings')
      .update({ status: 'cancelled', payment_status: 'refunded' })
      .eq('id', id);

    if (updErr) throw updErr;

    // Refund wallet if payment was successful
    if (booking.payment_status === 'successful') {
      const { data: prof } = await supabase.from('profiles').select('wallet_balance').eq('id', req.userId).single();
      const newBal = (Number(prof?.wallet_balance || 0) + Number(booking.amount));

      await supabase.from('profiles').update({ wallet_balance: newBal }).eq('id', req.userId);
      await supabase.from('wallet_transactions').insert({
        user_id: req.userId,
        type: 'credit',
        category: 'refund',
        amount: booking.amount,
        description: `Refund for cancelled booking #${id.slice(0, 8)}`,
        balance_after: newBal
      });
    }

    res.json({ success: true, message: 'Booking cancelled and refunded successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
