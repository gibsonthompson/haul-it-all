// app/api/admin/signup/route.js
// Bootstrap the FIRST admin. This route only works while haul_users is empty:
// GET reports whether setup is still available, POST creates the first admin
// and then the route locks itself (any later POST returns 403). After setup,
// all further users are created by an admin from the Users page.
//
// This is deliberately not open registration. It exists once, to stand up the
// initial account, so there is no chicken-and-egg (no user to log in as, no way
// to create one). org_id is left null (single tenant today).

import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getAdmin } from '@/lib/supabase'

async function userCount(supabase) {
  const { count, error } = await supabase
    .from('haul_users')
    .select('*', { count: 'exact', head: true })
  if (error) throw error
  return count || 0
}

// GET -> { available: boolean }  (true while no users exist yet)
export async function GET() {
  try {
    const supabase = getAdmin()
    const count = await userCount(supabase)
    return NextResponse.json({ available: count === 0 })
  } catch (err) {
    console.error('Signup availability error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST { name, username, password } -> creates the first admin, then locks.
export async function POST(request) {
  try {
    const body = await request.json()
    const name = (body.name || '').trim()
    const username = (body.username || '').toLowerCase().trim()
    const password = body.password || ''
    const phone = (body.phone || '').trim() || null
    const email = (body.email || '').trim() || null

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

    // Gate: only allowed while there are zero users.
    const count = await userCount(supabase)
    if (count > 0) {
      return NextResponse.json({ error: 'Setup is already complete. Please sign in.' }, { status: 403 })
    }

    const password_hash = await bcrypt.hash(password, 10)

    const { data, error } = await supabase
      .from('haul_users')
      .insert({
        username, name, phone, email, password_hash,
        role: 'admin', permissions: {}, is_active: true,
      })
      .select('id, username, name, phone, email, role, is_active')
      .single()

    if (error) {
      // 23505 = unique violation (race between check and insert)
      if (error.code === '23505') {
        return NextResponse.json({ error: 'That username is taken' }, { status: 409 })
      }
      console.error('Signup insert error:', error)
      return NextResponse.json({ error: 'Could not create account' }, { status: 500 })
    }

    return NextResponse.json({ user: data })
  } catch (err) {
    console.error('Signup error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}