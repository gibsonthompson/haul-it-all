// app/api/auth/signup/route.js
// Public tenant signup. Creates an org (the company) + its owner user, then
// starts a session. This is how a junk-removal business onboards onto the
// platform, the same shape as an agency signing up on Tapstack.

import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getAdmin } from '@/lib/supabase'
import { setSession } from '@/lib/auth'

const SAFE = 'id, username, name, phone, email, role, permissions, is_active, org_id'

function slugify(s) {
  return (s || 'company').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'company'
}
function rand(n) { return Math.random().toString(36).slice(2, 2 + n) }

export async function POST(request) {
  try {
    const b = await request.json()
    const company = (b.company || '').trim()
    const name = (b.name || '').trim()
    const username = (b.username || '').toLowerCase().trim()
    const password = b.password || ''
    const phone = (b.phone || '').trim() || null
    const email = (b.email || '').trim() || null
    const brand = (b.brand && typeof b.brand === 'object') ? b.brand : {}
    const logo_url = (b.logo_url || '').trim() || null

    if (!company || !name || !username || !password) {
      return NextResponse.json({ error: 'Company, your name, username, and password are required' }, { status: 400 })
    }
    if (password.length < 8) return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    if (!/^[a-z0-9._-]+$/.test(username)) {
      return NextResponse.json({ error: 'Username can use letters, numbers, dots, dashes, and underscores only' }, { status: 400 })
    }

    const supabase = getAdmin()

    // create the org (tenant) with a unique slug
    const slug = `${slugify(company)}-${rand(4)}`
    const { data: org, error: orgErr } = await supabase
      .from('haul_orgs')
      .insert({ name: company, slug, phone, email, brand, logo_url })
      .select('id, name, slug, phone, email, logo_url, brand, plan')
      .single()
    if (orgErr) {
      console.error('Signup org error:', orgErr)
      return NextResponse.json({ error: 'Could not create your workspace', detail: String(orgErr.message || orgErr) }, { status: 500 })
    }

    const password_hash = await bcrypt.hash(password, 10)
    const { data: user, error: userErr } = await supabase
      .from('haul_users')
      .insert({ username, name, phone, email, password_hash, role: 'admin', permissions: {}, is_active: true, org_id: org.id })
      .select(SAFE)
      .single()
    if (userErr) {
      // roll back the org so a taken username does not leave an orphan tenant
      await supabase.from('haul_orgs').delete().eq('id', org.id)
      if (userErr.code === '23505') return NextResponse.json({ error: 'That username is taken' }, { status: 409 })
      console.error('Signup user error:', userErr)
      return NextResponse.json({ error: 'Could not create your account' }, { status: 500 })
    }

    await setSession(user)
    return NextResponse.json({ user, org })
  } catch (err) {
    console.error('Signup error:', err)
    return NextResponse.json({ error: 'Internal server error', detail: String(err?.message || err) }, { status: 500 })
  }
}