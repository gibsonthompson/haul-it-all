// app/api/auth/me/route.js
// Returns the current { user, org } from the session cookie, or 401. The admin
// shell calls this on load to decide authenticated vs login, and to theme the
// UI from the org's brand.

import { NextResponse } from 'next/server'
import { getAdmin } from '@/lib/supabase'
import { getAuth, clearSession } from '@/lib/auth'

const SAFE = 'id, username, name, phone, email, role, permissions, is_active, org_id'

export async function GET() {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  try {
    const supabase = getAdmin()
    const { data: user, error } = await supabase.from('haul_users').select(SAFE).eq('id', auth.uid).single()
    if (error || !user || user.is_active === false) {
      await clearSession()
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    let org = null
    if (user.org_id) {
      const { data } = await supabase.from('haul_orgs').select('id, name, slug, phone, email, logo_url, brand, plan').eq('id', user.org_id).single()
      org = data || null
    }
    return NextResponse.json({ user, org })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}