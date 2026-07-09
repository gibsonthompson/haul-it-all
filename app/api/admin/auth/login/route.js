// app/api/auth/login/route.js
// POST { username, password } -> starts a session (httpOnly JWT cookie).

import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getAdmin } from '@/lib/supabase'
import { setSession } from '@/lib/auth'

export async function POST(request) {
  try {
    const b = await request.json().catch(() => ({}))
    const username = (b.username || '').toLowerCase().trim()
    const password = b.password || ''
    if (!username || !password) return NextResponse.json({ error: 'Username and password are required' }, { status: 400 })

    const supabase = getAdmin()
    const { data: user, error } = await supabase.from('haul_users').select('*').eq('username', username).single()
    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: 'Internal server error', detail: String(error.message || error) }, { status: 500 })
    }
    if (!user) return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
    if (user.is_active === false) return NextResponse.json({ error: 'This account has been deactivated' }, { status: 403 })

    const ok = await bcrypt.compare(password, user.password_hash || '')
    if (!ok) return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })

    supabase.from('haul_users').update({ last_login: new Date().toISOString() }).eq('id', user.id).then(() => {}, () => {})
    await setSession(user)

    let org = null
    if (user.org_id) {
      const { data } = await supabase.from('haul_orgs').select('id, name, slug, phone, email, logo_url, brand, plan').eq('id', user.org_id).single()
      org = data || null
    }
    const { password_hash, ...safe } = user
    return NextResponse.json({ user: safe, org })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}