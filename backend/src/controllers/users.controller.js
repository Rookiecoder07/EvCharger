import { supabase } from '../config/supabase.js';

export const getProfile = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    res.json({ success: true, data: data || { id: req.userId } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { full_name, phone, location, avatar_url, preferred_connector, min_charging_power, max_price_per_kwh } = req.body;
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: req.userId,
        full_name,
        phone,
        location,
        avatar_url,
        preferred_connector,
        min_charging_power,
        max_price_per_kwh,
        updated_at: new Date()
      })
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
