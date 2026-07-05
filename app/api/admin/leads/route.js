// app/api/admin/leads/route.js
// Haul It All leads API. Cloned from the RSA contact route, stripped of the
// waterproofing-specific auto-prospect and auto-job logic (no jobs table yet),
// pointed at haul_leads, using `details` instead of `message`.
//
// GET    list (optional status filter, member scoping via assigned_to)
// POST   manual add (phone-in leads, referrals)
// PATCH  update status / schedule / notes / assignment
// DELETE remove a lead
//
// Multi-tenant: org scoping is dormant. When tenancy turns on, add
// .eq('org_id', orgId) to the queries here.

import { NextResponse } from 'next/server'
import { getAdmin } from '@/lib/supabase'
import { STAGE_KEYS } from '@/lib/pipeline'

// The assigned-user embed, via the FK named in 0002_users.sql.
const LEAD_SELECT = '*, assigned_user:haul_users!haul_leads_assigned_to_fkey(id, name, username)'

export async function GET(request) {
  try {
    const supabase = getAdmin()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const userId = searchParams.get('user_id')
    const userRole = searchParams.get('user_role')

    let query = supabase.from('haul_leads').select(LEAD_SELECT).order('created_at', { ascending: false })
    if (status && status !== 'all') query = query.eq('status', status)
    if (userId && userRole === 'member') query = query.eq('assigned_to', userId)

    const { data, error } = await query
    if (error) {
      // Fallback if the embed cannot resolve (FK missing): return plain rows.
      const { data: plain, error: plainErr } = await supabase.from('haul_leads').select('*').order('created_at', { ascending: false })
      if (plainErr) return NextResponse.json({ error: plainErr.message }, { status: 500 })
      return NextResponse.json({ data: plain })
    }
    return NextResponse.json({ data })
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const supabase = getAdmin()
    const body = await request.json()
    const { name, phone, email, service_type, city, address, details, source, initial_status } = body

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 })
    }

    const status = (initial_status && STAGE_KEYS.includes(initial_status)) ? initial_status : 'new'

    const insertData = {
      name,
      phone,
      email: email || null,
      service_type: service_type || null,
      city: city || null,
      address: address || null,
      details: details || null,
      source: source || 'manual',
      status,
    }

    const { data, error } = await supabase.from('haul_leads').insert([insertData]).select(LEAD_SELECT).single()
    if (error) {
      // Retry without the embed if the FK select fails.
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
  try {
    const supabase = getAdmin()
    const body = await request.json()
    const { id, status, notes, next_follow_up, scheduled_date, scheduled_time, quoted_amount, address, city, close_reason, assigned_to } = body
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

    const { data, error } = await supabase.from('haul_leads').update(updateData).eq('id', id).select(LEAD_SELECT).single()
    if (error) {
      const { data: plain, error: plainErr } = await supabase.from('haul_leads').update(updateData).eq('id', id).select('*').single()
      if (plainErr) return NextResponse.json({ error: plainErr.message }, { status: 500 })
      return NextResponse.json({ success: true, data: plain })
    }
    return NextResponse.json({ success: true, data })
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const supabase = getAdmin()
    const body = await request.json().catch(() => ({}))
    const url = new URL(request.url)
    const id = body.id || url.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing lead ID' }, { status: 400 })

    const { error } = await supabase.from('haul_leads').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}