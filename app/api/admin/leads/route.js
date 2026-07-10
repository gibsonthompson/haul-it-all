// app/api/admin/leads/route.js
// Leads API, now MULTI-TENANT. Every query is scoped to the caller's org from
// the session (getAuth), so a tenant only ever sees or edits its own leads.
// Members are further scoped to leads assigned to them.
//
// GET    list (status filter; members see only their assigned leads)
// POST   manual add (phone-in leads, referrals) -> stamped with the org
// PATCH  update status / schedule / notes / assignment (own org only)
// DELETE remove a lead (own org only)

import { NextResponse } from 'next/server'
import { getAdmin } from '@/lib/supabase'
import { getAuth } from '@/lib/auth'
import { STAGE_KEYS } from '@/lib/pipeline'

const LEAD_SELECT = '*, assigned_user:haul_users!haul_leads_assigned_to_fkey(id, name, username)'

export async function GET(request) {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  try {
    const supabase = getAdmin()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let query = supabase.from('haul_leads').select(LEAD_SELECT).order('created_at', { ascending: false })
    if (auth.org) query = query.eq('org_id', auth.org)
    if (status && status !== 'all') query = query.eq('status', status)
    // Members only see leads assigned to them.
    if (auth.role === 'member') query = query.eq('assigned_to', auth.uid)

    const { data, error } = await query
    if (error) {
      let plainQ = supabase.from('haul_leads').select('*').order('created_at', { ascending: false })
      if (auth.org) plainQ = plainQ.eq('org_id', auth.org)
      if (status && status !== 'all') plainQ = plainQ.eq('status', status)
      if (auth.role === 'member') plainQ = plainQ.eq('assigned_to', auth.uid)
      const { data: plain, error: plainErr } = await plainQ
      if (plainErr) return NextResponse.json({ error: plainErr.message }, { status: 500 })
      return NextResponse.json({ data: plain })
    }
    return NextResponse.json({ data })
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  try {
    const supabase = getAdmin()
    const body = await request.json()
    const { name, phone, email, service_type, city, address, details, source, initial_status } = body
    if (!name || !phone) return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 })

    const status = (initial_status && STAGE_KEYS.includes(initial_status)) ? initial_status : 'new'
    const insertData = {
      name, phone, email: email || null, service_type: service_type || null,
      city: city || null, address: address || null, details: details || null,
      source: source || 'manual', status, org_id: auth.org || null,
    }

    const { data, error } = await supabase.from('haul_leads').insert([insertData]).select(LEAD_SELECT).single()
    if (error) {
      const { data: plain, error: plainErr } = await supabase.from('haul_leads').insert([insertData]).select('*').single()
      if (plainErr) return NextResponse.json({ error: plainErr.message }, { status: 500 })
      return NextResponse.json({ success: true, data: plain })
    }
    return NextResponse.json({ success: true, data })
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request) {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  try {
    const supabase = getAdmin()
    const body = await request.json()
    const { id, status, notes, next_follow_up, scheduled_date, scheduled_time, quoted_amount, address, city, close_reason, assigned_to, payment_status, amount_collected, completed_at } = body
    if (!id) return NextResponse.json({ error: 'Missing lead ID' }, { status: 400 })

    const updateData = {}
    if (status) updateData.status = status
    if (notes !== undefined) updateData.notes = notes
    if (next_follow_up !== undefined) updateData.next_follow_up = next_follow_up
    if (scheduled_date !== undefined) updateData.scheduled_date = scheduled_date
    if (scheduled_time !== undefined) updateData.scheduled_time = scheduled_time
    if (quoted_amount !== undefined) updateData.quoted_amount = quoted_amount
    if (address !== undefined) updateData.address = address
    if (city !== undefined) updateData.city = city
    if (close_reason !== undefined) updateData.close_reason = close_reason
    if (assigned_to !== undefined) updateData.assigned_to = assigned_to || null
    if (payment_status !== undefined) updateData.payment_status = payment_status
    if (amount_collected !== undefined) updateData.amount_collected = amount_collected
    if (completed_at !== undefined) updateData.completed_at = completed_at

    let q = supabase.from('haul_leads').update(updateData).eq('id', id)
    if (auth.org) q = q.eq('org_id', auth.org)  // cannot touch another org's lead
    const { data, error } = await q.select(LEAD_SELECT).single()
    if (error) {
      let q2 = supabase.from('haul_leads').update(updateData).eq('id', id)
      if (auth.org) q2 = q2.eq('org_id', auth.org)
      const { data: plain, error: plainErr } = await q2.select('*').single()
      if (plainErr) return NextResponse.json({ error: plainErr.message }, { status: 500 })
      return NextResponse.json({ success: true, data: plain })
    }
    return NextResponse.json({ success: true, data })
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request) {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  try {
    const supabase = getAdmin()
    const body = await request.json().catch(() => ({}))
    const url = new URL(request.url)
    const id = body.id || url.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing lead ID' }, { status: 400 })

    let q = supabase.from('haul_leads').delete().eq('id', id)
    if (auth.org) q = q.eq('org_id', auth.org)
    const { error } = await q
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}