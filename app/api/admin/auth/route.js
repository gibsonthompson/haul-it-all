// app/api/admin/auth/route.js
// Admin login. POST { username, password } -> { user } on success.
// Verifies bcrypt password against haul_users, blocks inactive accounts,
// stamps last_login, and returns the user WITHOUT the password hash. Admins
// carry the full permission set so the client gate resolves correctly.

import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getAdmin } from '@/lib/supabase'

const ADMIN_PERMISSIONS = {
  dashboard: true,
  leads: true,
  calendar: true,
  jobs: true,
  dumpsters: true,
  users: true,
  sms: true,
  delete_leads: true,
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}))
    const username = (body.username || '').toLowerCase().trim()
    const password = body.password || ''

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 })
    }

    const supabase = getAdmin()

    const { data: user, error } = await supabase
      .from('haul_users')
      .select('*')
      .eq('username', username)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Auth lookup error:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
    if (!user) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
    }
    if (user.is_active === false) {
      return NextResponse.json({ error: 'This account has been deactivated' }, { status: 403 })
    }

    const ok = await bcrypt.compare(password, user.password_hash || '')
    if (!ok) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
    }

    // Best-effort last_login stamp; never block login on it.
    supabase.from('haul_users').update({ last_login: new Date().toISOString() }).eq('id', user.id).then(() => {}, () => {})

    const safeUser = {
      id: user.id,
      username: user.username,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      permissions: user.role === 'admin' ? ADMIN_PERMISSIONS : (user.permissions || {}),
    }

    return NextResponse.json({ user: safeUser })
  } catch (err) {
    console.error('Auth error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}