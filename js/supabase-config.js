/**
 * Supabase Public Client Configuration (safe for static GitHub Pages frontend).
 * NEVER place a service_role or secret key here — ONLY your project's URL and
 * Publishable (or anon) public key from Supabase Dashboard -> Project Settings -> API.
 *
 * Leave blank to run seamlessly in local Collector Profile mode until configured.
 */

export const SUPABASE_CONFIG = {
  url: '',
  publishableKey: ''
};

export function isSupabaseConfigured() {
  return Boolean(SUPABASE_CONFIG.url && SUPABASE_CONFIG.publishableKey);
}
