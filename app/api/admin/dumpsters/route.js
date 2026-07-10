// app/api/admin/dumpsters/route.js
// The physical fleet (inventory). Org-scoped. GET/POST/PATCH need a session;
// deleting a box needs an owner.

import { NextResponse } from 'next/server'
import { getAdmin } from '@/lib/supabase'
import { getAuth, isOwner } from '@/lib/auth'

const VALID = ['available', 'out', 'maintenance']

export async function GET() {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  try {
    const supabase = getAdmin()
    let q = supabase.from('haul_dumpsters').select('*').order('label', { ascending: true })
    if (auth.org) q = q.eq('org_id', auth.org)
    const { data, error } = await q
    if (error) throw error
    return NextResponse.json({ dumpsters: data || [] })
  } catch (e) { return NextResponse.json({ error: 'Internal server error' }, { status: 500 }) }
}

export async function POST(request) {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  try {
    const b = await request.json()
    const label = (b.label || '').trim()
    if (!label) return NextResponse.json({ error: 'A label is required' }, { status: 400 })
    const status = VALID.includes(b.status) ? b.status : 'available'
    const supabase = getAdmin()
    const { data, error } = await supabase.from('haul_dumpsters')
      .insert({ label, size: (b.size || '').trim() || null, status, notes: (b.notes || '').trim() || null, org_id: auth.org || null })
      .select('*').single()
    if (error) return NextResponse.json({ error: 'Could not add box' }, { status: 500 })
    return NextResponse.json({ dumpster: data })
  } catch (e) { return NextResponse.json({ error: 'Internal server error' }, { status: 500 }) }
}

export async function PATCH(request) {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  try {
    const b = await request.json()
    if (!b.id) return NextResponse.json({ error: 'Box id required' }, { status: 400 })
    const update = {}
    if (typeof b.label === 'string') update.label = b.label.trim()
    if ('size' in b) update.size = (b.size || '').trim() || null
    if (typeof b.status === 'string') {
      if (!VALID.includes(b.status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
      update.status = b.status
    }
    if ('notes' in b) update.notes = (b.notes || '').trim() || null
    if (Object.keys(update).length === 0) return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
    const supabase = getAdmin()
    let q = supabase.from('haul_dumpsters').update(update).eq('id', b.id)
    if (auth.org) q = q.eq('org_id', auth.org)
    const { data, error } = await q.select('*').single()
    if (error) return NextResponse.json({ error: 'Could not update box' }, { status: 500 })
    return NextResponse.json({ dumpster: data })
  } catch (e) { return NextResponse.json({ error: 'Internal server error' }, { status: 500 }) }
}

export async function DELETE(request) {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  if (!isOwner(auth)) return NextResponse.json({ error: 'Owner access required' }, { status: 403 })
  try {
    const b = await request.json()
    if (!b.id) return NextResponse.json({ error: 'Box id required' }, { status: 400 })
    const supabase = getAdmin()
    let q = supabase.from('haul_dumpsters').delete().eq('id', b.id)
    if (auth.org) q = q.eq('org_id', auth.org)
    const { error } = await q
    if (error) return NextResponse.json({ error: 'Could not delete box' }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e) { return NextResponse.json({ error: 'Internal server error' }, { status: 500 }) }
}