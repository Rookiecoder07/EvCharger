import { supabase } from '../config/supabase.js';

export const getChargers = async (req, res) => {
  try {
    const { location, connector_type, charging_type, available_only } = req.query;

    let query = supabase.from('chargers').select('*, profiles(full_name)').eq('is_active', true);

    if (location) {
      query = query.or(`city.ilike.%${location}%,address.ilike.%${location}%,name.ilike.%${location}%`);
    }

    if (connector_type && connector_type !== 'any') {
      query = query.eq('connector_type', connector_type);
    }

    if (charging_type && charging_type !== 'any') {
      query = query.eq('charging_type', charging_type);
    }

    if (available_only === 'true') {
      query = query.eq('is_available', true);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getChargerById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('chargers')
      .select('*, profiles(full_name, phone)')
      .eq('id', id)
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
