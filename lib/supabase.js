// lib/supabase.js
// Server-only Supabase clients. getAdmin() returns a lazily-created service-role
// client (bypasses RLS) used by all admin/auth/org API routes. Lazy so a missing
// env var throws at call time with a clear message instead of at import.

import { createClient } from '@supabase/supabase-js'

let _admin = null

export function getAdmin() {
  if (_admin) return _admin
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Supabase env vars missing (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)')
  }
  _admin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return _admin
}

// Alias some codebases import; same service-role client.
export const getAdminClient = getAdmin