import { supabase } from '../config/supabase.js';

export const getVehicles = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const addVehicle = async (req, res) => {
  try {
    const { brand, model, battery_capacity_kwh, connector_type, registration_number } = req.body;
    const { data, error } = await supabase
      .from('vehicles')
      .insert({
        user_id: req.userId,
        brand,
        model,
        battery_capacity_kwh,
        connector_type,
        registration_number
      })
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id)
      .eq('user_id', req.userId);

    if (error) throw error;
    res.json({ success: true, message: 'Vehicle removed' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
