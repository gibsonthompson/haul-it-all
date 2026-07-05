// app/api/admin/auth/route.js
// Admin login. The admin layout POSTs { username, password } here.
// Verifies bcrypt against haul_users, stamps last_login, and returns the
// user (hash stripped). Admins get the full permission set built from the
// Haul permission keys. org_id rides along for future multi-tenant scoping.

import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getAdmin } from '@/lib/supabase'

// Full admin permission set, built from the Haul permission keys.
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
    const { username, password } = await request.json()
    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 })
    }

    const supabase = getAdmin()

    const { data: user, error } = await supabase
      .from('haul_users')
      .select('id, username, name, phone, email, password_hash, role, permissions, is_active, org_id')
      .eq('username', username.toLowerCase().trim())
      .single()

    if (error || !user) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
    }
    if (!user.is_active) {
      return NextResponse.json({ error: 'Account is disabled. Contact your admin.' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
    }

    await supabase.from('haul_users').update({ last_login: new Date().toISOString() }).eq('id', user.id)

    const { password_hash, ...safeUser } = user
    if (safeUser.role === 'admin') {
      safeUser.permissions = { ...ADMIN_PERMISSIONS }
    }

    return NextResponse.json({ user: safeUser })
  } catch (err) {
    console.error('Auth error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}