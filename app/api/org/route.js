// app/api/org/route.js
// The current tenant's org record. GET returns it; PATCH updates company info
// and brand theme. Owner-only, and always scoped to the caller's own org so a
// tenant can never read or edit another tenant.

import { NextResponse } from 'next/server'
import { getAdmin } from '@/lib/supabase'
import { getAuth, isOwner } from '@/lib/auth'

const ORG_SELECT = 'id, name, slug, phone, email, logo_url, brand, plan, is_active, created_at'

export async function GET() {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  if (!auth.org) return NextResponse.json({ org: null })
  try {
    const supabase = getAdmin()
    const { data, error } = await supabase.from('haul_orgs').select(ORG_SELECT).eq('id', auth.org).single()
    if (error) return NextResponse.json({ error: 'Could not load workspace' }, { status: 500 })
    return NextResponse.json({ org: data })
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request) {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  if (!isOwner(auth)) return NextResponse.json({ error: 'Owner access required' }, { status: 403 })
  if (!auth.org) return NextResponse.json({ error: 'No workspace on this account' }, { status: 400 })

  try {
    const b = await request.json()
    const update = {}
    if (typeof b.name === 'string') update.name = b.name.trim()
    if ('phone' in b) update.phone = (b.phone || '').trim() || null
    if ('email' in b) update.email = (b.email || '').trim() || null
    if ('logo_url' in b) update.logo_url = b.logo_url || null
    if (b.brand && typeof b.brand === 'object') update.brand = b.brand
    if (Object.keys(update).length === 0) return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })

    const supabase = getAdmin()
    const { data, error } = await supabase.from('haul_orgs').update(update).eq('id', auth.org).select(ORG_SELECT).single()
    if (error) return NextResponse.json({ error: 'Could not save workspace' }, { status: 500 })
    return NextResponse.json({ org: data })
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}