import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qigwpfmfxksrdlbuwgcm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_CLRrW54a-oUC7nkbO7XiSA_ztIHkhx3';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
