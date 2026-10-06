import { supabase } from '../config/supabase.js';

export const getOwnerDashboard = async (req, res) => {
  try {
    const { data: chargers, error: cErr } = await supabase
      .from('chargers')
      .select('id, is_active')
      .eq('owner_id', req.userId);

    if (cErr) throw cErr;

    const chargerIds = (chargers || []).map(c => c.id);

    let totalBookings = 0;
    let upcomingBookings = 0;
    let totalEarnings = 0;

    if (chargerIds.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const { data: bookings } = await supabase
        .from('bookings')
        .select('id, amount, status, payment_status, booking_date')
        .in('charger_id', chargerIds);

      if (bookings) {
        totalBookings = bookings.length;
        upcomingBookings = bookings.filter(b => b.booking_date >= today && b.status !== 'cancelled').length;
        totalEarnings = bookings
          .filter(b => b.payment_status === 'successful')
          .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
      }
    }

    res.json({
      success: true,
      data: {
        charger_count: chargers?.length || 0,
        active_charger_count: (chargers || []).filter(c => c.is_active).length,
        total_bookings: totalBookings,
        upcoming_bookings: upcomingBookings,
        total_earnings: totalEarnings
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getOwnerChargers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('chargers')
      .select('*')
      .eq('owner_id', req.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const addCharger = async (req, res) => {
  try {
    const { name, description, address, city, connector_type, charging_type, power_kw, price_per_kwh, operating_hours_start, operating_hours_end } = req.body;

    const { data, error } = await supabase
      .from('chargers')
      .insert({
        owner_id: req.userId,
        name,
        description,
        address,
        city,
        connector_type,
        charging_type,
        power_kw,
        price_per_kwh,
        operating_hours_start: operating_hours_start || '06:00',
        operating_hours_end: operating_hours_end || '22:00',
        is_active: true,
        is_available: true
      })
      .select()
      .single();

    if (error) throw error;

    // Set is_owner = true on profile
    await supabase.from('profiles').update({ is_owner: true }).eq('id', req.userId);

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateCharger = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, address, city, connector_type, charging_type, power_kw, price_per_kwh, operating_hours_start, operating_hours_end, is_available } = req.body;

    const { data, error } = await supabase
      .from('chargers')
      .update({
        name,
        description,
        address,
        city,
        connector_type,
        charging_type,
        power_kw,
        price_per_kwh,
        operating_hours_start,
        operating_hours_end,
        is_available
      })
      .eq('id', id)
      .eq('owner_id', req.userId)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const toggleChargerActive = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: current } = await supabase.from('chargers').select('is_active').eq('id', id).single();
    const newStatus = !current?.is_active;

    const { data, error } = await supabase
      .from('chargers')
      .update({ is_active: newStatus })
      .eq('id', id)
      .eq('owner_id', req.userId)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteCharger = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('chargers')
      .delete()
      .eq('id', id)
      .eq('owner_id', req.userId);

    if (error) throw error;
    res.json({ success: true, message: 'Charger deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getOwnerBookings = async (req, res) => {
  try {
    const { data: myChargers } = await supabase.from('chargers').select('id').eq('owner_id', req.userId);
    const ids = (myChargers || []).map(c => c.id);

    if (ids.length === 0) return res.json({ success: true, data: [] });

    const { data, error } = await supabase
      .from('bookings')
      .select('*, chargers(name), profiles(full_name, phone)')
      .in('charger_id', ids)
      .order('booking_date', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
