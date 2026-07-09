'use client'

// app/admin-setup/page.jsx
// One-time setup: create the first admin. Lives OUTSIDE /admin so the admin
// layout's login gate does not swallow it. If setup is already done (any user
// exists), it sends you to the sign-in screen instead. On success it logs the
// new admin in and drops them into the dashboard.

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function AdminSetupPage() {
  const router = useRouter()
  const [available, setAvailable] = useState(null) // null=checking, true, false
  const [form, setForm] = useState({ name: '', username: '', password: '', confirm: '', phone: '', email: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let alive = true
    fetch('/api/admin/signup')
      .then(r => r.json())
      .then(d => { if (alive) setAvailable(!!d.available) })
      .catch(() => { if (alive) setAvailable(false) })
    return () => { alive = false }
  }, [])

  const set = (k) => (e) => { setForm(p => ({ ...p, [k]: e.target.value })); setError('') }

  const valid = form.name.trim() && form.username.trim() && form.password.length >= 8 && form.password === form.confirm

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!valid) {
      if (form.password.length < 8) setError('Password must be at least 8 characters')
      else if (form.password !== form.confirm) setError('Passwords do not match')
      return
    }
    setSubmitting(true); setError('')
    try {
      const r = await fetch('/api/admin/signup', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(), username: form.username.trim().toLowerCase(),
          password: form.password, phone: form.phone.trim(), email: form.email.trim(),
        }),
      })
      const data = await r.json()
      if (!r.ok) { setError(data.error || 'Could not create account'); setSubmitting(false); return }

      // Auto sign-in with the credentials just created.
      const loginRes = await fetch('/api/admin/auth', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username.trim().toLowerCase(), password: form.password }),
      })
      const loginData = await loginRes.json()
      if (loginRes.ok && loginData.user) {
        localStorage.setItem('haul_admin_user', JSON.stringify(loginData.user))
        router.push('/admin')
      } else {
        // Account exists; just send them to sign in.
        router.push('/admin')
      }
    } catch (err) {
      setError('Connection error'); setSubmitting(false)
    }
  }

  return (
    <div className="haul-admin min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--admin-bg)', fontFamily: 'var(--font-hanken)' }}>
      <div className="w-full max-w-sm rounded-3xl border-[3px] border-[var(--admin-ink)] bg-white p-6 sm:p-8">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex flex-col items-center gap-3">
            <span className="inline-flex items-center justify-center overflow-hidden rounded-2xl" style={{ width: 64, height: 64, background: 'var(--admin-accent)' }}>
              <Image src="/bear.png" alt="Haul It All" width={64} height={64} className="h-full w-full object-cover" />
            </span>
            <span style={{ fontFamily: 'var(--font-anton)' }} className="text-3xl uppercase tracking-tight text-[var(--admin-ink)]">Haul It All</span>
          </div>
          <p className="text-sm text-[var(--admin-ink-faint)]">
            {available === false ? 'Setup is already complete' : 'Create your admin account'}
          </p>
        </div>

        {available === null && (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 rounded-full animate-spin" style={{ border: '3px solid var(--admin-primary)', borderTopColor: 'transparent' }} />
          </div>
        )}

        {available === false && (
          <div className="text-center">
            <p className="text-sm mb-6 text-[var(--admin-ink-soft)]">This workspace already has an admin. Head to the sign-in screen to log in.</p>
            <Link href="/admin" className="block w-full py-3.5 rounded-xl font-extrabold text-white transition-all active:scale-[0.98]" style={{ background: 'var(--admin-primary)' }}>
              Go to sign in
            </Link>
          </div>
        )}

        {available === true && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Your name *">
              <input type="text" value={form.name} onChange={set('name')} placeholder="Gibson" autoFocus style={{ fontSize: '16px' }} className={inputCls} />
            </Field>
            <Field label="Username *">
              <input type="text" value={form.username} onChange={set('username')} placeholder="gibson" autoCapitalize="none" autoComplete="username" style={{ fontSize: '16px' }} className={inputCls} />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Phone">
                <input type="tel" value={form.phone} onChange={set('phone')} placeholder="Optional" style={{ fontSize: '16px' }} className={inputCls} />
              </Field>
              <Field label="Email">
                <input type="email" value={form.email} onChange={set('email')} placeholder="Optional" style={{ fontSize: '16px' }} className={inputCls} />
              </Field>
            </div>
            <Field label="Password *">
              <input type="password" value={form.password} onChange={set('password')} placeholder="At least 8 characters" autoComplete="new-password" style={{ fontSize: '16px' }} className={inputCls} />
            </Field>
            <Field label="Confirm password *">
              <input type="password" value={form.confirm} onChange={set('confirm')} placeholder="Re-enter password" autoComplete="new-password" style={{ fontSize: '16px' }} className={inputCls} />
            </Field>
            {error && <p className="text-red-500 text-sm text-center font-semibold">{error}</p>}
            <button type="submit" disabled={submitting || !valid}
              className="w-full py-3.5 rounded-xl font-extrabold text-white transition-all disabled:opacity-40 active:scale-[0.98]"
              style={{ background: 'var(--admin-primary)' }}>
              {submitting ? 'Creating...' : 'Create admin & sign in'}
            </button>
            <Link href="/" className="block text-center text-sm text-[var(--admin-ink-soft)] hover:text-[var(--admin-primary)] transition-colors">Back to website</Link>
          </form>
        )}
      </div>

      <style jsx global>{`
        .haul-admin {
          --admin-primary: #2c7a1a;
          --admin-primary-soft: rgba(44, 122, 26, 0.08);
          --admin-accent: #7fd957;
          --admin-bg: #f5f1e6;
          --admin-line: #e6dfce;
          --admin-ink: #121110;
          --admin-ink-soft: #47443c;
          --admin-ink-faint: #8a857a;
        }
      `}</style>
    </div>
  )
}

const inputCls = 'w-full px-4 py-3 rounded-xl border-2 border-[var(--admin-line)] text-sm text-[var(--admin-ink)] outline-none transition-all focus:border-[var(--admin-primary)]'

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest font-bold mb-1.5 text-[var(--admin-ink-faint)]">{label}</label>
      {children}
    </div>
  )
}