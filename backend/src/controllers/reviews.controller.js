import { supabase } from '../config/supabase.js';

export const getChargerReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('reviews')
      .select('*, profiles(full_name)')
      .eq('charger_id', id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const addReview = async (req, res) => {
  try {
    const { charger_id, booking_id, rating, comment } = req.body;

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        user_id: req.userId,
        charger_id,
        booking_id,
        rating,
        comment
      })
      .select()
      .single();

    if (error) throw error;

    // Award 10 EV points for review
    const { data: prof } = await supabase.from('profiles').select('ev_points').eq('id', req.userId).single();
    await supabase.from('profiles').update({ ev_points: (prof?.ev_points || 0) + 10 }).eq('id', req.userId);

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getSavedChargers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('saved_chargers')
      .select('*, chargers(*)')
      .eq('user_id', req.userId);

    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const saveCharger = async (req, res) => {
  try {
    const { charger_id } = req.body;
    const { data, error } = await supabase
      .from('saved_chargers')
      .insert({ user_id: req.userId, charger_id })
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const unsaveCharger = async (req, res) => {
  try {
    const { chargerId } = req.params;
    const { error } = await supabase
      .from('saved_chargers')
      .delete()
      .eq('user_id', req.userId)
      .eq('charger_id', chargerId);

    if (error) throw error;
    res.json({ success: true, message: 'Removed from saved' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
