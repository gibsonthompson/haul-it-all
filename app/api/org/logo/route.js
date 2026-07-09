// app/api/org/logo/route.js
// Upload a tenant logo (base64 data URL in JSON) to the public 'logos' bucket,
// save the URL and derived brand on the org, and return both. Owner-only,
// scoped to the caller's org. Uses the service role, so no storage policy is
// needed for the write; the bucket is public for reads.

import { NextResponse } from 'next/server'
import { getAdmin } from '@/lib/supabase'
import { getAuth, isOwner } from '@/lib/auth'

const EXT = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/webp': 'webp', 'image/svg+xml': 'svg', 'image/gif': 'gif' }

export async function POST(request) {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  if (!isOwner(auth)) return NextResponse.json({ error: 'Owner access required' }, { status: 403 })
  if (!auth.org) return NextResponse.json({ error: 'No workspace on this account' }, { status: 400 })

  try {
    const b = await request.json()
    const dataUrl = b.dataUrl || ''
    const brand = (b.brand && typeof b.brand === 'object') ? b.brand : null
    const m = /^data:([^;]+);base64,(.+)$/.exec(dataUrl)
    if (!m) return NextResponse.json({ error: 'Invalid image data' }, { status: 400 })
    const contentType = m[1]
    const ext = EXT[contentType]
    if (!ext) return NextResponse.json({ error: 'Unsupported image type' }, { status: 400 })

    const buffer = Buffer.from(m[2], 'base64')
    if (buffer.length > 3 * 1024 * 1024) return NextResponse.json({ error: 'Logo must be under 3MB' }, { status: 400 })

    const supabase = getAdmin()
    const path = `${auth.org}/logo-${Date.now()}.${ext}`
    const { error: upErr } = await supabase.storage.from('logos').upload(path, buffer, { contentType, upsert: true })
    if (upErr) {
      console.error('Logo upload error:', upErr)
      return NextResponse.json({ error: 'Could not upload logo', detail: String(upErr.message || upErr) }, { status: 500 })
    }
    const { data: pub } = supabase.storage.from('logos').getPublicUrl(path)
    const logo_url = pub?.publicUrl || null

    const update = { logo_url }
    if (brand) update.brand = brand
    const { data: org, error: orgErr } = await supabase.from('haul_orgs').update(update).eq('id', auth.org)
      .select('id, name, slug, phone, email, logo_url, brand, plan').single()
    if (orgErr) return NextResponse.json({ error: 'Saved logo but could not update workspace' }, { status: 500 })

    return NextResponse.json({ logo_url, org })
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}