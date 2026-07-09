// app/api/admin/recipients/route.js
// New-lead SMS alert recipients, MULTI-TENANT. Scoped to the caller's org.
// GET needs a session; mutations need an owner.

import { NextResponse } from 'next/server'
import { getAdmin } from '@/lib/supabase'
import { getAuth, isOwner } from '@/lib/auth'

export async function GET() {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  try {
    const supabase = getAdmin()
    let q = supabase.from('haul_notification_recipients').select('*').order('created_at', { ascending: true })
    if (auth.org) q = q.eq('org_id', auth.org)
    const { data, error } = await q
    if (error) throw error
    return NextResponse.json({ recipients: data || [] })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  if (!isOwner(auth)) return NextResponse.json({ error: 'Owner access required' }, { status: 403 })
  try {
    const b = await request.json()
    const name = (b.name || '').trim()
    const phone = (b.phone || '').trim()
    if (!name || !phone) return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 })
    const supabase = getAdmin()
    const { data, error } = await supabase.from('haul_notification_recipients')
      .insert({ name, phone, enabled: true, org_id: auth.org || null }).select('*').single()
    if (error) return NextResponse.json({ error: 'Could not add recipient' }, { status: 500 })
    return NextResponse.json({ recipient: data })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request) {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  if (!isOwner(auth)) return NextResponse.json({ error: 'Owner access required' }, { status: 403 })
  try {
    const b = await request.json()
    const id = b.id
    if (!id) return NextResponse.json({ error: 'Recipient id required' }, { status: 400 })
    const update = {}
    if (typeof b.name === 'string') update.name = b.name.trim()
    if (typeof b.phone === 'string') update.phone = b.phone.trim()
    if (typeof b.enabled === 'boolean') update.enabled = b.enabled
    if (Object.keys(update).length === 0) return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
    const supabase = getAdmin()
    let q = supabase.from('haul_notification_recipients').update(update).eq('id', id)
    if (auth.org) q = q.eq('org_id', auth.org)
    const { data, error } = await q.select('*').single()
    if (error) return NextResponse.json({ error: 'Could not update recipient' }, { status: 500 })
    return NextResponse.json({ recipient: data })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request) {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  if (!isOwner(auth)) return NextResponse.json({ error: 'Owner access required' }, { status: 403 })
  try {
    const b = await request.json()
    const id = b.id
    if (!id) return NextResponse.json({ error: 'Recipient id required' }, { status: 400 })
    const supabase = getAdmin()
    let q = supabase.from('haul_notification_recipients').delete().eq('id', id)
    if (auth.org) q = q.eq('org_id', auth.org)
    const { error } = await q
    if (error) return NextResponse.json({ error: 'Could not remove recipient' }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}