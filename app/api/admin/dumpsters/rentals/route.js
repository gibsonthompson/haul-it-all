// app/api/admin/dumpsters/rentals/route.js
// Rentals ledger. Org-scoped. Marking a rental delivered/picked_up/cancelled
// flips the linked box's status (out <-> available) so the fleet view always
// reflects reality. GET/POST/PATCH need a session; delete needs an owner.

import { NextResponse } from 'next/server'
import { getAdmin } from '@/lib/supabase'
import { getAuth, isOwner } from '@/lib/auth'

const VALID = ['scheduled', 'delivered', 'picked_up', 'cancelled']
const REL = '*, dumpster:haul_dumpsters(id, label, size, status)'

// Keep a box's status in sync with its rental's status.
async function syncBox(supabase, org, dumpster_id, rentalStatus) {
  if (!dumpster_id) return
  let boxStatus = null
  if (rentalStatus === 'delivered') boxStatus = 'out'
  else if (rentalStatus === 'picked_up' || rentalStatus === 'cancelled') boxStatus = 'available'
  if (!boxStatus) return
  let q = supabase.from('haul_dumpsters').update({ status: boxStatus }).eq('id', dumpster_id)
  if (org) q = q.eq('org_id', org)
  await q
}

export async function GET() {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  try {
    const supabase = getAdmin()
    let q = supabase.from('haul_dumpster_rentals').select(REL).order('created_at', { ascending: false })
    if (auth.org) q = q.eq('org_id', auth.org)
    const { data, error } = await q
    if (error) {
      let q2 = supabase.from('haul_dumpster_rentals').select('*').order('created_at', { ascending: false })
      if (auth.org) q2 = q2.eq('org_id', auth.org)
      const { data: plain, error: e2 } = await q2
      if (e2) return NextResponse.json({ error: e2.message }, { status: 500 })
      return NextResponse.json({ rentals: plain || [] })
    }
    return NextResponse.json({ rentals: data || [] })
  } catch (e) { return NextResponse.json({ error: 'Internal server error' }, { status: 500 }) }
}

export async function POST(request) {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  try {
    const b = await request.json()
    const customer_name = (b.customer_name || '').trim()
    if (!customer_name) return NextResponse.json({ error: 'Customer name is required' }, { status: 400 })
    const status = VALID.includes(b.status) ? b.status : 'scheduled'
    const insert = {
      org_id: auth.org || null,
      dumpster_id: b.dumpster_id || null,
      lead_id: b.lead_id || null,
      customer_name,
      phone: (b.phone || '').trim() || null,
      address: (b.address || '').trim() || null,
      size: (b.size || '').trim() || null,
      dropoff_date: b.dropoff_date || null,
      pickup_date: b.pickup_date || null,
      price: (b.price === '' || b.price === undefined || b.price === null) ? null : Number(b.price),
      status,
      notes: (b.notes || '').trim() || null,
    }
    const supabase = getAdmin()
    const { data, error } = await supabase.from('haul_dumpster_rentals').insert(insert).select(REL).single()
    if (error) {
      const { data: plain, error: e2 } = await supabase.from('haul_dumpster_rentals').insert(insert).select('*').single()
      if (e2) return NextResponse.json({ error: e2.message }, { status: 500 })
      await syncBox(supabase, auth.org, insert.dumpster_id, status)
      return NextResponse.json({ rental: plain })
    }
    await syncBox(supabase, auth.org, insert.dumpster_id, status)
    return NextResponse.json({ rental: data })
  } catch (e) { return NextResponse.json({ error: 'Internal server error' }, { status: 500 }) }
}

export async function PATCH(request) {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  try {
    const b = await request.json()
    if (!b.id) return NextResponse.json({ error: 'Rental id required' }, { status: 400 })
    const update = {}
    for (const f of ['customer_name', 'phone', 'address', 'size', 'dropoff_date', 'pickup_date', 'notes']) {
      if (f in b) update[f] = (typeof b[f] === 'string' ? b[f].trim() : b[f]) || null
    }
    if ('dumpster_id' in b) update.dumpster_id = b.dumpster_id || null
    if ('price' in b) update.price = (b.price === '' || b.price === null) ? null : Number(b.price)
    if (typeof b.status === 'string') {
      if (!VALID.includes(b.status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
      update.status = b.status
    }
    if (Object.keys(update).length === 0) return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })

    const supabase = getAdmin()
    let q = supabase.from('haul_dumpster_rentals').update(update).eq('id', b.id)
    if (auth.org) q = q.eq('org_id', auth.org)
    const { data, error } = await q.select(REL).single()
    if (error) {
      let q2 = supabase.from('haul_dumpster_rentals').update(update).eq('id', b.id)
      if (auth.org) q2 = q2.eq('org_id', auth.org)
      const { data: plain, error: e2 } = await q2.select('*').single()
      if (e2) return NextResponse.json({ error: e2.message }, { status: 500 })
      if (update.status) await syncBox(supabase, auth.org, plain?.dumpster_id, update.status)
      return NextResponse.json({ rental: plain })
    }
    if (update.status) await syncBox(supabase, auth.org, data?.dumpster_id, update.status)
    return NextResponse.json({ rental: data })
  } catch (e) { return NextResponse.json({ error: 'Internal server error' }, { status: 500 }) }
}

export async function DELETE(request) {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  if (!isOwner(auth)) return NextResponse.json({ error: 'Owner access required' }, { status: 403 })
  try {
    const b = await request.json()
    if (!b.id) return NextResponse.json({ error: 'Rental id required' }, { status: 400 })
    const supabase = getAdmin()
    let q = supabase.from('haul_dumpster_rentals').delete().eq('id', b.id)
    if (auth.org) q = q.eq('org_id', auth.org)
    const { error } = await q
    if (error) return NextResponse.json({ error: 'Could not delete rental' }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e) { return NextResponse.json({ error: 'Internal server error' }, { status: 500 }) }
}