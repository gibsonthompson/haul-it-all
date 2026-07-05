'use client'

// app/admin/layout.js
// Haul It All admin shell. Auth context, permission-gated nav, login gate.
//
// BRAND TOKEN LAYER: every brand color lives in CSS variables defined once on
// .haul-admin (see the styled-jsx block at the bottom). Pages reference
// var(--admin-primary) etc, never a raw hex. A second tenant reskins the whole
// admin by overriding these tokens in one place, no find-and-replace.
// Pipeline stage colors (blue/indigo/purple per stage) are intentionally NOT
// tokenized: those are semantic status colors and should read the same for
// every tenant.
//
// Fonts come from the root layout (next/font sets --font-anton and
// --font-hanken on <html>), so nothing is injected here. Anton is used only for
// the wordmark and page titles, Hanken Grotesk is the UI body font.

import { useState, useEffect, createContext, useContext } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const AuthContext = createContext({ isAuthenticated: false, user: null, hasPermission: () => false })
export const useAdminAuth = () => useContext(AuthContext)

// Small bear-in-a-green-tile logo. The bear PNG has a baked #7fd957 background,
// so sitting it on a matching green tile hides the seam.
function BearMark({ size = 32, rounded = 'rounded-xl' }) {
  return (
    <span
      className={`inline-flex items-center justify-center overflow-hidden ${rounded}`}
      style={{ width: size, height: size, background: 'var(--admin-accent)' }}
    >
      <Image src="/bear.png" alt="Haul It All" width={size} height={size} className="h-full w-full object-cover" />
    </span>
  )
}

export default function AdminLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)

  // Native PWA feel: kill overscroll bounce and block pinch / double-tap zoom,
  // including in Safari browser mode where user-scalable=no is ignored.
  useEffect(() => {
    const meta = document.querySelector('meta[name="viewport"]')
    const content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover'
    if (meta) meta.setAttribute('content', content)
    else { const m = document.createElement('meta'); m.name = 'viewport'; m.content = content; document.head.appendChild(m) }

    const prevBody = document.body.style.overscrollBehavior
    const prevHtml = document.documentElement.style.overscrollBehavior
    document.body.style.overscrollBehavior = 'none'
    document.documentElement.style.overscrollBehavior = 'none'

    // { passive: false } is REQUIRED for preventDefault to fire on these events.
    const preventGesture = (e) => e.preventDefault()
    const preventMultiTouch = (e) => { if (e.touches && e.touches.length > 1) e.preventDefault() }
    let lastTouchEnd = 0
    const preventDoubleTapZoom = (e) => { const now = Date.now(); if (now - lastTouchEnd < 300) e.preventDefault(); lastTouchEnd = now }

    const opts = { passive: false }
    document.addEventListener('gesturestart', preventGesture, opts)
    document.addEventListener('gesturechange', preventGesture, opts)
    document.addEventListener('gestureend', preventGesture, opts)
    document.addEventListener('touchstart', preventMultiTouch, opts)
    document.addEventListener('touchmove', preventMultiTouch, opts)
    document.addEventListener('touchend', preventDoubleTapZoom, opts)

    return () => {
      document.body.style.overscrollBehavior = prevBody
      document.documentElement.style.overscrollBehavior = prevHtml
      document.removeEventListener('gesturestart', preventGesture, opts)
      document.removeEventListener('gesturechange', preventGesture, opts)
      document.removeEventListener('gestureend', preventGesture, opts)
      document.removeEventListener('touchstart', preventMultiTouch, opts)
      document.removeEventListener('touchmove', preventMultiTouch, opts)
      document.removeEventListener('touchend', preventDoubleTapZoom, opts)
    }
  }, [])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('haul_admin_user')
      if (saved) { const parsed = JSON.parse(saved); setUser(parsed); setIsAuthenticated(true) }
    } catch (e) { localStorage.removeItem('haul_admin_user') }
    setChecking(false)
  }, [])

  useEffect(() => { setSidebarOpen(false) }, [pathname])

  const handleLogin = async (e) => {
    e.preventDefault(); setLoginError(''); setLoggingIn(true)
    try {
      const r = await fetch('/api/admin/auth', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await r.json()
      if (!r.ok) { setLoginError(data.error || 'Login failed'); return }
      setUser(data.user); setIsAuthenticated(true); localStorage.setItem('haul_admin_user', JSON.stringify(data.user))
    } catch (err) { setLoginError('Connection error') }
    finally { setLoggingIn(false) }
  }

  const handleLogout = () => { setIsAuthenticated(false); setUser(null); localStorage.removeItem('haul_admin_user') }

  const hasPermission = (key) => {
    if (!user) return false
    if (user.role === 'admin') return true
    return user.permissions?.[key] === true
  }

  // Grouped navigation. perm keys are the Haul permission set.
  const icon = (d) => <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={d} /></svg>
  const navGroups = [
    { label: null, items: [
      { href: '/admin', label: 'Dashboard', perm: 'dashboard', icon: icon('M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z') },
    ]},
    { label: 'Sales', items: [
      { href: '/admin/leads', label: 'Leads', perm: 'leads', icon: icon('M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4') },
      { href: '/admin/calendar', label: 'Calendar', perm: 'calendar', icon: icon('M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z') },
    ]},
    { label: 'Operations', items: [
      { href: '/admin/jobs', label: 'Jobs', perm: 'jobs', icon: icon('M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4') },
      { href: '/admin/dumpsters', label: 'Dumpsters', perm: 'dumpsters', icon: icon('M4 7h16l-1.5 12.5a1 1 0 01-1 .5H6.5a1 1 0 01-1-.5L4 7zm2-3h12l1 3H5l1-3z') },
    ]},
    { label: 'System', items: [
      { href: '/admin/users', label: 'Users', perm: 'users', icon: icon('M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z') },
      { href: '/admin/settings', label: 'Settings', perm: 'users', icon: icon('M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z') },
    ]},
  ]

  const filteredGroups = navGroups
    .map(g => ({ ...g, items: g.items.filter(item => hasPermission(item.perm)) }))
    .filter(g => g.items.length > 0)

  const isActive = (href) => href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  if (checking) return (
    <div className="haul-admin min-h-screen flex items-center justify-center" style={{ background: 'var(--admin-bg)', fontFamily: 'var(--font-hanken)' }}>
      <div className="w-10 h-10 rounded-full animate-spin" style={{ border: '4px solid var(--admin-primary)', borderTopColor: 'transparent' }} />
      <TokenStyles />
    </div>
  )

  if (!isAuthenticated) {
    return (
      <div className="haul-admin min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--admin-bg)', fontFamily: 'var(--font-hanken)' }}>
        <div className="w-full max-w-sm rounded-3xl border-[3px] border-[var(--admin-ink)] bg-white p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex flex-col items-center gap-3">
              <BearMark size={64} rounded="rounded-2xl" />
              <span style={{ fontFamily: 'var(--font-anton)' }} className="text-3xl uppercase tracking-tight text-[var(--admin-ink)]">Haul It All</span>
            </div>
            <p className="text-sm text-[var(--admin-ink-faint)]">Sign in to continue</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold mb-1.5 text-[var(--admin-ink-faint)]">Username</label>
              <input type="text" value={username} onChange={(e) => { setUsername(e.target.value); setLoginError('') }}
                placeholder="Username" autoFocus autoComplete="username" autoCapitalize="none" style={{ fontSize: '16px' }}
                className="w-full px-4 py-3 rounded-xl border-2 border-[var(--admin-line)] text-sm text-[var(--admin-ink)] outline-none transition-all focus:border-[var(--admin-primary)]" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold mb-1.5 text-[var(--admin-ink-faint)]">Password</label>
              <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setLoginError('') }}
                placeholder="Password" autoComplete="current-password" style={{ fontSize: '16px' }}
                className="w-full px-4 py-3 rounded-xl border-2 border-[var(--admin-line)] text-sm text-[var(--admin-ink)] outline-none transition-all focus:border-[var(--admin-primary)]" />
            </div>
            {loginError && <p className="text-red-500 text-sm text-center font-semibold">{loginError}</p>}
            <button type="submit" disabled={loggingIn || !username || !password}
              className="w-full py-3.5 rounded-xl font-extrabold text-white transition-all disabled:opacity-40 active:scale-[0.98]"
              style={{ background: 'var(--admin-primary)' }}>
              {loggingIn ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-xs mt-5 text-[var(--admin-ink-faint)]">Forgot your password? Ask your admin.</p>
          <Link href="/" className="block text-center mt-3 text-sm text-[var(--admin-ink-soft)] hover:text-[var(--admin-primary)] transition-colors">Back to website</Link>
        </div>
        <TokenStyles />
      </div>
    )
  }

  const SidebarContent = ({ mobile = false }) => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-5 py-5 flex-shrink-0">
        <BearMark size={30} />
        <span style={{ fontFamily: 'var(--font-anton)' }} className="text-xl uppercase tracking-tight text-[var(--admin-ink)]">Haul It All</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-1">
        {filteredGroups.map((group, gi) => (
          <div key={gi} className={gi > 0 ? 'mt-4' : ''}>
            {group.label && <p className="px-3 mb-1.5 text-[9px] uppercase tracking-[0.15em] font-bold text-[var(--admin-ink-faint)]">{group.label}</p>}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href)
                return (
                  <Link key={item.href} href={item.href}
                    className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150 group"
                    style={active
                      ? { background: 'var(--admin-primary-soft)', color: 'var(--admin-primary)' }
                      : { color: 'var(--admin-ink-soft)' }}>
                    {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full" style={{ background: 'var(--admin-primary)' }} />}
                    <span className="flex-shrink-0" style={{ color: active ? 'var(--admin-primary)' : 'var(--admin-ink-faint)' }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="flex-shrink-0 border-t border-[var(--admin-line)] px-3 py-3 space-y-0.5"
        style={{ paddingBottom: mobile ? 'max(0.75rem, env(safe-area-inset-bottom))' : undefined }}>
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--admin-primary)' }}>
            <span className="text-white font-bold text-xs">{user?.name?.charAt(0)?.toUpperCase()}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-bold text-[var(--admin-ink)] truncate">{user?.name}</p>
            <p className="text-[10px] capitalize text-[var(--admin-ink-faint)]">{user?.role}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] w-full transition-all text-[var(--admin-ink-faint)] hover:text-red-500 hover:bg-red-50/80">
          <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, hasPermission }}>
      <div className="haul-admin admin-root desktop-zoom min-h-screen flex" style={{ background: 'var(--admin-bg)', fontFamily: 'var(--font-hanken)' }}>
        <aside className="admin-chrome hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 w-[220px] bg-white border-r border-[var(--admin-line)]">
          <SidebarContent />
        </aside>

        <header className="admin-chrome lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[var(--admin-line)]" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <button onClick={() => setSidebarOpen(true)} className="p-1 -ml-1 text-[var(--admin-ink-soft)]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <BearMark size={28} />
              <span style={{ fontFamily: 'var(--font-anton)' }} className="text-lg uppercase tracking-tight text-[var(--admin-ink)]">Haul It All</span>
            </div>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--admin-primary)' }}>
              <span className="text-white font-bold text-xs">{user?.name?.charAt(0)?.toUpperCase()}</span>
            </div>
          </div>
        </header>

        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setSidebarOpen(false)}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="admin-chrome absolute inset-y-0 left-0 w-[260px] bg-white shadow-2xl animate-[slideIn_0.2s_ease-out]" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 z-10 p-1 text-[var(--admin-ink-faint)] hover:text-[var(--admin-ink-soft)]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <SidebarContent mobile />
            </div>
          </div>
        )}

        <main className="admin-main flex-1 lg:ml-[220px] min-h-screen overflow-x-hidden">
          <div className="max-w-[1400px] mx-auto">{children}</div>
        </main>
      </div>
      <TokenStyles />
    </AuthContext.Provider>
  )
}

// Brand token layer + shared admin chrome behavior. Defined once; every admin
// page inherits these variables. Override --admin-* for a different tenant.
function TokenStyles() {
  return (
    <style jsx global>{`
      .haul-admin {
        --admin-primary: #2c7a1a;        /* green-deep, carries white text (WCAG AA) */
        --admin-primary-hover: #24631a;
        --admin-primary-soft: rgba(44, 122, 26, 0.08);
        --admin-primary-ring: rgba(44, 122, 26, 0.18);
        --admin-accent: #7fd957;         /* bright logo green, accents and the bear tile */
        --admin-bg: #f5f1e6;             /* bone, matches the marketing site */
        --admin-surface: #ffffff;
        --admin-line: #e6dfce;
        --admin-ink: #121110;
        --admin-ink-soft: #47443c;
        --admin-ink-faint: #8a857a;
      }
      @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
      @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      .admin-main { margin-top: calc(56px + env(safe-area-inset-top)); }
      @media (min-width: 1024px) {
        .admin-main { margin-top: 0; }
        .desktop-zoom { zoom: 0.95; }
      }
      .admin-root { -webkit-tap-highlight-color: transparent; -webkit-text-size-adjust: 100%; touch-action: pan-x pan-y; }
      .admin-chrome, .admin-chrome * { -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; }
      input, textarea, [contenteditable] { -webkit-user-select: text; user-select: text; -webkit-touch-callout: default; }
      .scrollbar-hide::-webkit-scrollbar { display: none; }
      .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    `}</style>
  )
}