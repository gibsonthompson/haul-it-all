// lib/auth.js
// Session auth for the multi-tenant admin. Matches your rocket-solutions /
// VoiceAI pattern: bcrypt password_hash in the users table, JWT for the
// session. The JWT rides in an httpOnly cookie (not localStorage), so it is
// not exposed to XSS and is sent automatically with every request.
//
// The signing secret uses JWT_SECRET if set, otherwise falls back to the
// service-role key (already present, genuinely secret) so there is no extra
// env var to configure. Set a dedicated JWT_SECRET in production if you want
// to rotate sessions independently of the DB key.

import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const SECRET = process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || 'haul-dev-insecure-secret'
const COOKIE = 'haul_session'
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

// Build the JWT payload from a user row. org is null for super_admin.
export function signSession(user) {
  return jwt.sign(
    { uid: user.id, org: user.org_id || null, role: user.role, name: user.name },
    SECRET,
    { expiresIn: '7d' }
  )
}

export function verifySession(token) {
  try { return jwt.verify(token, SECRET) } catch { return null }
}

// Read + verify the session from the request cookie. Returns the payload
// { uid, org, role, name } or null. Use in Route Handlers.
export async function getAuth() {
  const store = await cookies()
  const token = store.get(COOKIE)?.value
  if (!token) return null
  return verifySession(token)
}

export async function setSession(user) {
  const store = await cookies()
  store.set(COOKIE, signSession(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  })
}

export async function clearSession() {
  const store = await cookies()
  store.set(COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 })
}

// Role helpers. admin = org owner, super_admin = platform, member = staff.
export const isOwner = (auth) => auth && (auth.role === 'admin' || auth.role === 'super_admin')
export const isPlatform = (auth) => auth && auth.role === 'super_admin'