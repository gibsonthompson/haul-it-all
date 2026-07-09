'use client'

// app/signup/page.jsx
// Public tenant onboarding. A junk-removal company creates its workspace, and
// the moment they drop in a logo, the whole page re-themes to their brand,
// live. On submit we create the org + owner, upload the logo, and drop them
// into their freshly-branded admin.

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { extractDominantColor, deriveBrand, brandToCssVars, DEFAULT_BRAND } from '@/lib/brand'

export default function SignupPage() {
  const router = useRouter()
  const fileRef = useRef(null)
  const [form, setForm] = useState({ company: '', name: '', username: '', password: '', phone: '', email: '' })
  const [brand, setBrand] = useState(DEFAULT_BRAND)
  const [logo, setLogo] = useState(null) // { dataUrl, name }
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const set = (k) => (e) => { setForm(p => ({ ...p, [k]: e.target.value })); setError('') }

  const onLogo = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 3 * 1024 * 1024) { setError('Logo must be under 3MB'); return }
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result
      const img = new Image()
      img.onload = () => {
        try { setBrand(deriveBrand(extractDominantColor(img))) } catch { setBrand(DEFAULT_BRAND) }
        setLogo({ dataUrl, name: file.name })
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  }

  const valid = form.company.trim() && form.name.trim() && form.username.trim() && form.password.length >= 8

  const submit = async (e) => {
    e.preventDefault()
    if (!valid) { setError(form.password.length < 8 ? 'Password must be at least 8 characters' : 'Fill in the required fields'); return }
    setSubmitting(true); setError('')
    try {
      const r = await fetch('/api/auth/signup', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: form.company.trim(), name: form.name.trim(),
          username: form.username.trim().toLowerCase(), password: form.password,
          phone: form.phone.trim(), email: form.email.trim(), brand,
        }),
      })
      const data = await r.json()
      if (!r.ok) { setError(data.error || 'Could not create your workspace'); setSubmitting(false); return }

      // Upload the logo now that we have a session.
      if (logo?.dataUrl) {
        await fetch('/api/org/logo', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dataUrl: logo.dataUrl, brand }),
        }).catch(() => {})
      }
      router.push('/admin')
    } catch (err) {
      setError('Connection error'); setSubmitting(false)
    }
  }

  return (
    <div className="haul-admin min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--admin-bg)', fontFamily: 'var(--font-hanken)', ...brandToCssVars(brand) }}>
      <div className="w-full max-w-4xl grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-stretch">
        {/* Form */}
        <div className="rounded-3xl border-[3px] border-[var(--admin-ink)] bg-white p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-flex items-center justify-center overflow-hidden rounded-2xl" style={{ width: 52, height: 52, background: 'var(--admin-accent)' }}>
              {logo ? <img src={logo.dataUrl} alt="" className="h-full w-full object-contain p-1" /> : <span style={{ fontFamily: 'var(--font-anton)' }} className="text-2xl text-[var(--admin-ink)]">H</span>}
            </span>
            <div>
              <h1 style={{ fontFamily: 'var(--font-anton)' }} className="text-2xl uppercase tracking-tight text-[var(--admin-ink)] leading-none">Start your workspace</h1>
              <p className="text-sm text-[var(--admin-ink-faint)] mt-1">Run your whole operation in one place.</p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-3">
            <Field label="Company name *"><input type="text" value={form.company} onChange={set('company')} placeholder="Bear Junk Removal" autoFocus style={{ fontSize: '16px' }} className={inp} /></Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Your name *"><input type="text" value={form.name} onChange={set('name')} placeholder="Full name" style={{ fontSize: '16px' }} className={inp} /></Field>
              <Field label="Username *"><input type="text" value={form.username} onChange={set('username')} placeholder="username" autoCapitalize="none" autoComplete="username" style={{ fontSize: '16px' }} className={inp} /></Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Phone"><input type="tel" value={form.phone} onChange={set('phone')} placeholder="Optional" style={{ fontSize: '16px' }} className={inp} /></Field>
              <Field label="Email"><input type="email" value={form.email} onChange={set('email')} placeholder="Optional" style={{ fontSize: '16px' }} className={inp} /></Field>
            </div>
            <Field label="Password *"><input type="password" value={form.password} onChange={set('password')} placeholder="At least 8 characters" autoComplete="new-password" style={{ fontSize: '16px' }} className={inp} /></Field>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold mb-1 text-[var(--admin-ink-faint)]">Company logo</label>
              <button type="button" onClick={() => fileRef.current?.click()} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-[var(--admin-line)] hover:border-[var(--admin-primary)] transition-colors text-left">
                <span className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: 'var(--admin-primary-soft)' }}>
                  <svg className="w-4 h-4" style={{ color: 'var(--admin-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </span>
                <span className="text-sm font-semibold text-[var(--admin-ink-soft)]">{logo ? logo.name : 'Upload your logo to brand the app'}</span>
              </button>
              <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={onLogo} className="hidden" />
            </div>

            {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}
            <button type="submit" disabled={submitting || !valid} className="w-full py-3.5 rounded-xl font-extrabold text-white transition-all disabled:opacity-40 active:scale-[0.98]" style={{ background: 'var(--admin-primary)' }}>
              {submitting ? 'Creating your workspace...' : 'Create workspace'}
            </button>
            <p className="text-center text-sm text-[var(--admin-ink-soft)]">Already have one? <Link href="/admin" className="font-bold" style={{ color: 'var(--admin-primary)' }}>Sign in</Link></p>
          </form>
        </div>

        {/* Live brand preview */}
        <div className="rounded-3xl border-[3px] border-[var(--admin-ink)] overflow-hidden flex flex-col" style={{ background: 'var(--admin-primary)' }}>
          <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between text-white">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-80">Live preview</p>
              <h2 style={{ fontFamily: 'var(--font-anton)' }} className="mt-2 text-3xl uppercase leading-none">{form.company || 'Your company'}</h2>
              <p className="mt-3 text-sm opacity-90 max-w-xs">Drop in your logo and the whole app, buttons, highlights, dashboard, matches your brand automatically.</p>
            </div>
            <div className="mt-8 space-y-3">
              <div className="rounded-2xl bg-white p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl overflow-hidden" style={{ background: 'var(--admin-accent)' }}>
                    {logo ? <img src={logo.dataUrl} alt="" className="h-full w-full object-contain p-0.5" /> : <span style={{ fontFamily: 'var(--font-anton)', color: 'var(--admin-ink)' }} className="text-lg">H</span>}
                  </span>
                  <div className="flex-1">
                    <div className="h-2.5 w-24 rounded-full" style={{ background: 'var(--admin-primary)' }} />
                    <div className="mt-1.5 h-2 w-16 rounded-full bg-black/10" />
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold text-white" style={{ background: 'var(--admin-primary)' }}>New</span>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="flex-1 rounded-xl py-2.5 text-center text-xs font-extrabold text-white" style={{ background: 'var(--admin-primary-hover)' }}>Primary</span>
                <span className="flex-1 rounded-xl py-2.5 text-center text-xs font-extrabold text-[var(--admin-ink)]" style={{ background: 'var(--admin-accent)' }}>Accent</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .haul-admin {
          --admin-bg: #f5f1e6; --admin-line: #e6dfce; --admin-ink: #121110;
          --admin-ink-soft: #47443c; --admin-ink-faint: #8a857a;
        }
      `}</style>
    </div>
  )
}

const inp = 'w-full px-4 py-3 rounded-xl border-2 border-[var(--admin-line)] text-sm text-[var(--admin-ink)] outline-none transition-all focus:border-[var(--admin-primary)]'
function Field({ label, children }) {
  return <div><label className="block text-[10px] uppercase tracking-widest font-bold mb-1 text-[var(--admin-ink-faint)]">{label}</label>{children}</div>
}