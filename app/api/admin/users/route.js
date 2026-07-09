// app/api/admin/users/route.js
// Team management, MULTI-TENANT. Every operation is scoped to the caller's org
// from the session, so an owner only ever sees and manages their own team.
// GET requires a session; mutations require an owner (admin or super_admin).
// Passwords are bcrypt-hashed here and never returned.

import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getAdmin } from '@/lib/supabase'
import { getAuth, isOwner } from '@/lib/auth'

const SAFE = 'id, username, name, phone, email, role, permissions, is_active, last_login, created_at, org_id'
const VALID_ROLES = ['admin', 'member'] // super_admin is platform-only, not assignable via the API

const clean = (u) => (u || '').toLowerCase().trim()

export async function GET() {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  try {
    const supabase = getAdmin()
    let q = supabase.from('haul_users').select(SAFE).order('created_at', { ascending: true })
    if (auth.org) q = q.eq('org_id', auth.org)
    const { data, error } = await q
    if (error) throw error
    return NextResponse.json({ users: data || [] })
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
    const username = clean(b.username)
    const password = b.password || ''
    const role = VALID_ROLES.includes(b.role) ? b.role : 'member'
    const phone = (b.phone || '').trim() || null
    const email = (b.email || '').trim() || null
    const permissions = (b.permissions && typeof b.permissions === 'object') ? b.permissions : {}

    if (!name || !username || !password) return NextResponse.json({ error: 'Name, username, and password are required' }, { status: 400 })
    if (password.length < 8) return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    if (!/^[a-z0-9._-]+$/.test(username)) return NextResponse.json({ error: 'Username can use letters, numbers, dots, dashes, and underscores only' }, { status: 400 })

    const supabase = getAdmin()
    const password_hash = await bcrypt.hash(password, 10)
    const { data, error } = await supabase.from('haul_users').insert({
      username, name, phone, email, password_hash, role,
      permissions: role === 'admin' ? {} : permissions, is_active: true, org_id: auth.org || null,
    }).select(SAFE).single()

    if (error) {
      if (error.code === '23505') return NextResponse.json({ error: 'That username is taken' }, { status: 409 })
      return NextResponse.json({ error: 'Could not create user' }, { status: 500 })
    }
    return NextResponse.json({ user: data })
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
    if (!id) return NextResponse.json({ error: 'User id required' }, { status: 400 })
    const isSelf = id === auth.uid

    const update = {}
    if (typeof b.name === 'string') update.name = b.name.trim()
    if ('phone' in b) update.phone = (b.phone || '').trim() || null
    if ('email' in b) update.email = (b.email || '').trim() || null
    if (typeof b.role === 'string') {
      if (!VALID_ROLES.includes(b.role)) return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
      if (isSelf && b.role !== 'admin') return NextResponse.json({ error: 'You cannot change your own role' }, { status: 400 })
      update.role = b.role
    }
    if (b.permissions && typeof b.permissions === 'object') update.permissions = b.permissions
    if (typeof b.is_active === 'boolean') {
      if (isSelf && b.is_active === false) return NextResponse.json({ error: 'You cannot deactivate your own account' }, { status: 400 })
      update.is_active = b.is_active
    }
    if (b.password) {
      if (b.password.length < 8) return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
      update.password_hash = await bcrypt.hash(b.password, 10)
    }
    if (Object.keys(update).length === 0) return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })

    const supabase = getAdmin()
    let q = supabase.from('haul_users').update(update).eq('id', id)
    if (auth.org) q = q.eq('org_id', auth.org)  // cannot edit another org's user
    const { data, error } = await q.select(SAFE).single()
    if (error) return NextResponse.json({ error: 'Could not update user' }, { status: 500 })
    return NextResponse.json({ user: data })
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
    if (!id) return NextResponse.json({ error: 'User id required' }, { status: 400 })
    if (id === auth.uid) return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 })

    const supabase = getAdmin()
    let q = supabase.from('haul_users').delete().eq('id', id)
    if (auth.org) q = q.eq('org_id', auth.org)
    const { error } = await q
    if (error) return NextResponse.json({ error: 'Could not delete user' }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}