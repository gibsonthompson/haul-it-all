// lib/admin-auth.js
// Verify that a request comes from an authenticated Haul admin user.
//
// Usage in any admin API route:
//   import { verifyAdmin } from '@/lib/admin-auth'
//
//   export async function GET(request) {
//     const auth = await verifyAdmin(request)
//     if (auth.error) return auth.error
//     // auth.user is the verified user, auth.orgId is their tenant scope
//   }
//
// Reads the x-admin-user-id header or the admin_user_id query param.
// Soft-allows a missing auth header for back-compat (returns
// { user: null, authenticated: false }) so existing calls keep working
// during migration.
//
// Multi-tenant note: orgId is returned on every call. Today it is a dormant
// scope (haul_leads.org_id and friends are nullable and unfiltered), so the
// value simply rides along. When we turn on tenancy, routes flip from
// unscoped to `.eq('org_id', auth.orgId)` with no signature change here.

import { getAdmin } from '@/lib/supabase'

export async function verifyAdmin(request) {
  const { NextResponse } = await import('next/server')

  const headerUserId = request.headers.get('x-admin-user-id')
  const url = new URL(request.url)
  const queryUserId = url.searchParams.get('admin_user_id')
  const userId = headerUserId || queryUserId

  if (!userId) {
    // Back-compat: allow unauthenticated calls through with no user.
    return { user: null, authenticated: false, isAdmin: false, orgId: null }
  }

  try {
    const supabase = getAdmin()
    const { data: user, error } = await supabase
      .from('haul_users')
      .select('id, username, name, role, is_active, permissions, org_id')
      .eq('id', userId)
      .single()

    if (error || !user) {
      return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), user: null }
    }

    if (!user.is_active) {
      return { error: NextResponse.json({ error: 'Account disabled' }, { status: 401 }), user: null }
    }

    const orgId = user.org_id || null

    if (user.role !== 'admin') {
      return { user, authenticated: true, isAdmin: false, orgId }
    }

    return { user, authenticated: true, isAdmin: true, orgId }
  } catch (e) {
    return { error: NextResponse.json({ error: 'Auth verification failed' }, { status: 500 }), user: null }
  }
}