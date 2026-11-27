/**
 * Supabase Public Client Configuration (safe for static GitHub Pages frontend).
 * Uses the modern Publishable Key (NEVER service_role or secret keys).
 * Project: jewel-queen (pxohihigptyrsfvvowwa, us-west-1)
 */

export const SUPABASE_CONFIG = {
  url: 'https://pxohihigptyrsfvvowwa.supabase.co',
  publishableKey: 'sb_publishable_26rltASPjySMfSkc_1RRAw_vbC6TbIh'
};

export function isSupabaseConfigured() {
  return Boolean(SUPABASE_CONFIG.url && SUPABASE_CONFIG.publishableKey);
}
