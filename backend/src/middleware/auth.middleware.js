import { supabase } from '../config/supabase.js';

export const verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Invalid or expired session' });
    }

    req.user = user;
    req.userId = user.id;
    next();
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Internal auth verification error' });
  }
};
