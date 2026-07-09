// app/api/admin/users/route.js
// Team member management. GET is soft (no auth header required) so the lead
// detail assignee dropdown keeps working header-less. Mutations require an
// admin: the caller sends x-admin-user-id, verifyAdmin confirms role + active.
//
// Passwords are bcrypt-hashed here and never returned. Deleting a user relies
// on the haul_leads.assigned_to FK (on delete set null), so their leads survive
// unassigned rather than erroring.

import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getAdmin } from '@/lib/supabase'
import { verifyAdmin } from '@/lib/admin-auth'

const SAFE_COLUMNS = 'id, username, name, phone, email, role, permissions, is_active, last_login, created_at'
const VALID_ROLES = ['admin', 'member']

function cleanUsername(u) {
  return (u || '').toLowerCase().trim()
}

// GET -> { users: [...] }  (soft; no password hashes)
export async function GET() {
  try {
    const supabase = getAdmin()
    const { data, error } = await supabase
      .from('haul_users')
      .select(SAFE_COLUMNS)
      .order('created_at', { ascending: true })
    if (error) throw error
    return NextResponse.json({ users: data || [] })
  } catch (err) {
    console.error('Users GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST { name, username, password, role, permissions, phone, email } -> create
export async function POST(request) {
  const auth = await verifyAdmin(request)
  if (auth.error) return auth.error
  if (!auth.isAdmin) return NextResponse.json({ error: 'Admin access required' }, { status: 403 })

  try {
    const body = await request.json()
    const name = (body.name || '').trim()
    const username = cleanUsername(body.username)
    const password = body.password || ''
    const role = VALID_ROLES.includes(body.role) ? body.role : 'member'
    const phone = (body.phone || '').trim() || null
    const email = (body.email || '').trim() || null
    const permissions = (body.permissions && typeof body.permissions === 'object') ? body.permissions : {}

    if (!name || !username || !password) {
      return NextResponse.json({ error: 'Name, username, and password are required' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }
    if (!/^[a-z0-9._-]+$/.test(username)) {
      return NextResponse.json({ error: 'Username can use letters, numbers, dots, dashes, and underscores only' }, { status: 400 })
    }

    const supabase = getAdmin()
    const password_hash = await bcrypt.hash(password, 10)

    const { data, error } = await supabase
      .from('haul_users')
      .insert({
        username, name, phone, email, password_hash, role,
        // Admins get the full set at login regardless, so only members carry perms.
        permissions: role === 'admin' ? {} : permissions,
        is_active: true,
        org_id: auth.orgId || null,
      })
      .select(SAFE_COLUMNS)
      .single()

    if (error) {
      if (error.code === '23505') return NextResponse.json({ error: 'That username is taken' }, { status: 409 })
      console.error('Users POST error:', error)
      return NextResponse.json({ error: 'Could not create user' }, { status: 500 })
    }

    return NextResponse.json({ user: data })
  } catch (err) {
    console.error('Users POST error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH { id, name?, phone?, email?, role?, permissions?, is_active?, password? }
export async function PATCH(request) {
  const auth = await verifyAdmin(request)
  if (auth.error) return auth.error
  if (!auth.isAdmin) return NextResponse.json({ error: 'Admin access required' }, { status: 403 })

  try {
    const body = await request.json()
    const id = body.id
    if (!id) return NextResponse.json({ error: 'User id required' }, { status: 400 })

    const isSelf = id === auth.user.id
    const update = {}

    if (typeof body.name === 'string') update.name = body.name.trim()
    if ('phone' in body) update.phone = (body.phone || '').trim() || null
    if ('email' in body) update.email = (body.email || '').trim() || null

    if (typeof body.role === 'string') {
      if (!VALID_ROLES.includes(body.role)) return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
      // Lockout guard: an admin cannot demote themselves (would strip their own access).
      if (isSelf && body.role !== 'admin') {
        return NextResponse.json({ error: 'You cannot change your own role' }, { status: 400 })
      }
      update.role = body.role
    }

    if (body.permissions && typeof body.permissions === 'object') {
      update.permissions = body.permissions
    }

    if (typeof body.is_active === 'boolean') {
      // Lockout guard: an admin cannot deactivate themselves.
      if (isSelf && body.is_active === false) {
        return NextResponse.json({ error: 'You cannot deactivate your own account' }, { status: 400 })
      }
      update.is_active = body.is_active
    }

    if (body.password) {
      if (body.password.length < 8) {
        return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
      }
      update.password_hash = await bcrypt.hash(body.password, 10)
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
    }

    const supabase = getAdmin()
    const { data, error } = await supabase
      .from('haul_users')
      .update(update)
      .eq('id', id)
      .select(SAFE_COLUMNS)
      .single()

    if (error) {
      console.error('Users PATCH error:', error)
      return NextResponse.json({ error: 'Could not update user' }, { status: 500 })
    }

    return NextResponse.json({ user: data })
  } catch (err) {
    console.error('Users PATCH error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE { id } -> hard delete. Their lead assignments null out via the FK.
export async function DELETE(request) {
  const auth = await verifyAdmin(request)
  if (auth.error) return auth.error
  if (!auth.isAdmin) return NextResponse.json({ error: 'Admin access required' }, { status: 403 })

  try {
    const body = await request.json()
    const id = body.id
    if (!id) return NextResponse.json({ error: 'User id required' }, { status: 400 })
    if (id === auth.user.id) {
      return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 })
    }

    const supabase = getAdmin()
    const { error } = await supabase.from('haul_users').delete().eq('id', id)
    if (error) {
      console.error('Users DELETE error:', error)
      return NextResponse.json({ error: 'Could not delete user' }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Users DELETE error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}