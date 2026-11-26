/**
 * Jewel Queen — Collector Auth (Facebook + Google SSO) & Cloud Vault Sync via Supabase
 * - Works out-of-the-box in local Guest Collector mode (custom Display Name for Viral Share Cards)
 * - Instantly activates live Facebook & Google OAuth + cross-device Vault Sync + Collectors' Leaderboard
 *   as soon as SUPABASE_CONFIG in js/supabase-config.js is filled with your free Supabase project keys.
 */

import { SUPABASE_CONFIG, isSupabaseConfigured } from './supabase-config.js';

const SUPABASE_CDN = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.4/+esm';
const NAME_STORAGE_KEY = 'jq_collector_name';

export class CollectorAuth {
  constructor({ onStateChange, onCloudMerged }) {
    this.onStateChange = onStateChange;
    this.onCloudMerged = onCloudMerged;
    this.configured = isSupabaseConfigured();
    this.client = null;
    this.user = null;
    this.collectorName = localStorage.getItem(NAME_STORAGE_KEY) || '';
    this.syncStatus = this.configured ? 'connecting' : 'local';
    this._syncTimer = null;
  }

  async init() {
    if (!this.configured) {
      this._emit();
      return;
    }
    try {
      const { createClient } = await import(SUPABASE_CDN);
      this.client = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.publishableKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });

      const { data } = await this.client.auth.getSession();
      this._handleSession(data?.session || null);

      this.client.auth.onAuthStateChange((_event, session) => {
        this._handleSession(session || null);
      });
    } catch (err) {
      console.warn('Supabase client init skipped:', err);
      this.syncStatus = 'local';
      this._emit();
    }
  }

  async _handleSession(session) {
    this.user = session?.user || null;
    if (this.user) {
      const metaName =
        this.user.user_metadata?.full_name ||
        this.user.user_metadata?.name ||
        this.user.email?.split('@')[0] ||
        '';
      if (!this.collectorName && metaName) {
        this.collectorName = metaName.slice(0, 28);
        localStorage.setItem(NAME_STORAGE_KEY, this.collectorName);
      }
      this.syncStatus = 'synced';
      this._emit();
      await this.pullAndMergeCloud();
    } else {
      this.syncStatus = this.configured ? 'signed-out' : 'local';
      this._emit();
    }
  }

  getDisplayName() {
    return (
      this.collectorName ||
      this.user?.user_metadata?.full_name ||
      this.user?.user_metadata?.name ||
      'Private Collector'
    );
  }

  getAvatarUrl() {
    return this.user?.user_metadata?.avatar_url || this.user?.user_metadata?.picture || '';
  }

  setCollectorName(name) {
    this.collectorName = (name || '').trim().slice(0, 28);
    localStorage.setItem(NAME_STORAGE_KEY, this.collectorName);
    this._emit();
  }

  async signInWithProvider(provider) {
    if (!this.configured || !this.client) {
      return { ok: false, reason: 'not-configured' };
    }
    const redirectTo = `${window.location.origin}${window.location.pathname}`;
    const { error } = await this.client.auth.signInWithOAuth({
      provider, // 'facebook' | 'google'
      options: { redirectTo }
    });
    if (error) {
      return { ok: false, reason: error.message };
    }
    return { ok: true };
  }

  async signOut() {
    if (this.client) {
      await this.client.auth.signOut();
    }
    this.user = null;
    this.syncStatus = this.configured ? 'signed-out' : 'local';
    this._emit();
  }

  async pullAndMergeCloud() {
    if (!this.client || !this.user) return;
    try {
      const { data, error } = await this.client
        .from('collector_profiles')
        .select('display_name, best_score, estate_value, owned_count, collection_counts, stage_stars, showcase_ids')
        .eq('id', this.user.id)
        .maybeSingle();

      if (error) {
        console.warn('Cloud pull error:', error.message);
        return;
      }
      if (data && this.onCloudMerged) {
        if (data.display_name && !this.collectorName) {
          this.collectorName = data.display_name;
          localStorage.setItem(NAME_STORAGE_KEY, this.collectorName);
        }
        this.onCloudMerged(data);
      }
    } catch (err) {
      console.warn('Cloud pull skipped:', err);
    }
  }

  scheduleCloudSave(payload) {
    if (!this.client || !this.user) return;
    if (this._syncTimer) clearTimeout(this._syncTimer);
    this._syncTimer = setTimeout(() => this._pushCloud(payload), 900);
  }

  async _pushCloud(payload) {
    if (!this.client || !this.user) return;
    try {
      this.syncStatus = 'syncing';
      this._emit();
      const { error } = await this.client.from('collector_profiles').upsert(
        {
          id: this.user.id,
          display_name: this.getDisplayName(),
          avatar_url: this.getAvatarUrl() || null,
          best_score: payload.bestScore || 0,
          estate_value: payload.estateValue || 0,
          owned_count: payload.ownedCount || 0,
          collection_counts: payload.collectionCounts || {},
          stage_stars: payload.stageStars || {},
          showcase_ids: payload.showcaseIds || [],
          updated_at: new Date().toISOString()
        },
        { onConflict: 'id' }
      );
      this.syncStatus = error ? 'error' : 'synced';
      this._emit();
    } catch {
      this.syncStatus = 'error';
      this._emit();
    }
  }

  async fetchLeaderboard(limit = 12) {
    if (!this.client) return [];
    try {
      const { data, error } = await this.client
        .from('collector_profiles')
        .select('id, display_name, avatar_url, estate_value, owned_count, best_score')
        .order('estate_value', { ascending: false })
        .limit(limit);
      if (error) return [];
      return data || [];
    } catch {
      return [];
    }
  }

  _emit() {
    if (this.onStateChange) {
      this.onStateChange({
        configured: this.configured,
        user: this.user,
        displayName: this.getDisplayName(),
        avatarUrl: this.getAvatarUrl(),
        syncStatus: this.syncStatus
      });
    }
  }
}
