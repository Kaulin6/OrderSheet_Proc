// ============================================
// Supabase Client Initialization
// ============================================

const SUPABASE_CONFIGURED = CONFIG.SUPABASE_URL !== 'https://YOUR_PROJECT.supabase.co'
  && CONFIG.SUPABASE_ANON_KEY !== 'YOUR_ANON_KEY';

const db = SUPABASE_CONFIGURED && window.supabase
  ? window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY)
  : null;

if (!db) {
  console.info('Supabase not configured — running with local data.');
}
