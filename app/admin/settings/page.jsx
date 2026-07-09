'use client'

// app/admin/settings/page.jsx
// Tenant settings: company info, brand logo (with live re-theming of the whole
// admin), and new-lead SMS alert recipients. Owner-only. All org-scoped through
// the session cookie, no auth headers to pass.

import { useState, useEffect, useRef } from 'react'
import { useAdminAuth } from '../layout'
import { extractDominantColor, deriveBrand, brandToCssVars, DEFAULT_BRAND } from '@/lib/brand'

export default function SettingsPage() {
  const { org, refresh } = useAdminAuth()
  const fileRef = useRef(null)

  const [info, setInfo] = useState({ name: '', phone: '', email: '' })
  const [savingInfo, setSavingInfo] = useState(false)
  const [logoPreview, setLogoPreview] = useState(null) // { dataUrl, brand }
  const [savingLogo, setSavingLogo] = useState(false)
  const [recipients, setRecipients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(null)
  const [recForm, setRecForm] = useState({ name: '', phone: '' })
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  useEffect(() => { if (org) setInfo({ name: org.name || '', phone: org.phone || '', email: org.email || '' }) }, [org])
  useEffect(() => { fetchRecipients() }, [])

  const flash = (m) => { setToast(m); setTimeout(() => setToast(''), 2500) }
  const jsonHeaders = { 'Content-Type': 'application/json' }
  const formatPhone = (p) => { if (!p) return ''; const c = p.replace(/\D/g, ''); if (c.length === 10) return '(' + c.slice(0,3) + ') ' + c.slice(3,6) + '-' + c.slice(6); return p }

  // ---- business info
  const saveInfo = async () => {
    setSavingInfo(true); setError('')
    try {
      const r = await fetch('/api/org', { method: 'PATCH', headers: jsonHeaders, body: JSON.stringify({ name: info.name.trim(), phone: info.phone.trim(), email: info.email.trim() }) })
      if (!r.ok) { const d = await r.json(); setError(d.error || 'Could not save'); return }
      flash('Business info saved'); refresh()
    } catch (e) { setError('Could not save') }
    finally { setSavingInfo(false) }
  }

  // ---- logo + brand
  const onLogo = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 3 * 1024 * 1024) { setError('Logo must be under 3MB'); return }
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result
      const img = new Image()
      img.onload = () => {
        let brand = DEFAULT_BRAND
        try { brand = deriveBrand(extractDominantColor(img)) } catch { /* default */ }
        setLogoPreview({ dataUrl, brand })
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  }

  const saveLogo = async () => {
    if (!logoPreview) return
    setSavingLogo(true); setError('')
    try {
      const r = await fetch('/api/org/logo', { method: 'POST', headers: jsonHeaders, body: JSON.stringify({ dataUrl: logoPreview.dataUrl, brand: logoPreview.brand }) })
      if (!r.ok) { const d = await r.json(); setError(d.error || 'Could not save logo'); return }
      setLogoPreview(null); flash('Logo saved. Your theme is updated.'); refresh()
    } catch (e) { setError('Could not save logo') }
    finally { setSavingLogo(false) }
  }

  // ---- recipients
  const fetchRecipients = async () => {
    try { const r = await fetch('/api/admin/recipients'); const d = await r.json(); if (d.recipients) setRecipients(d.recipients) }
    catch (e) { /* noop */ } finally { setLoading(false) }
  }
  const openAddRec = () => { setRecForm({ name: '', phone: '' }); setEditing(null); setError(''); setShowAdd(true) }
  const openEditRec = (rec) => { setRecForm({ name: rec.name, phone: rec.phone }); setEditing(rec); setError(''); setShowAdd(true) }
  const recValid = recForm.name.trim() && recForm.phone.trim()
  const saveRec = async () => {
    if (!recValid) { setError('Name and phone are required'); return }
    setError('')
    try {
      const method = editing ? 'PATCH' : 'POST'
      const body = editing ? { id: editing.id, name: recForm.name.trim(), phone: recForm.phone.trim() } : { name: recForm.name.trim(), phone: recForm.phone.trim() }
      const r = await fetch('/api/admin/recipients', { method, headers: jsonHeaders, body: JSON.stringify(body) })
      if (!r.ok) { const d = await r.json(); setError(d.error || 'Could not save'); return }
      setShowAdd(false); setEditing(null); flash(editing ? 'Saved' : 'Recipient added'); fetchRecipients()
    } catch (e) { setError('Could not save') }
  }
  const toggleRec = async (rec) => {
    setRecipients(rs => rs.map(r => r.id === rec.id ? { ...r, enabled: !r.enabled } : r))
    try { await fetch('/api/admin/recipients', { method: 'PATCH', headers: jsonHeaders, body: JSON.stringify({ id: rec.id, enabled: !rec.enabled }) }) }
    catch (e) { fetchRecipients() }
  }
  const deleteRec = async (rec) => {
    if (!confirm(`Remove ${rec.name} from lead alerts?`)) return
    try { const r = await fetch('/api/admin/recipients', { method: 'DELETE', headers: jsonHeaders, body: JSON.stringify({ id: rec.id }) }); if (r.ok) { flash('Removed'); fetchRecipients() } }
    catch (e) { /* noop */ }
  }

  const currentLogo = logoPreview?.dataUrl || org?.logo_url || null

  return (
    <div className="px-4 py-5 sm:py-8 max-w-2xl">
      <div className="mb-6 animate-[fadeUp_0.3s_ease-out]">
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--admin-ink)]">Settings</h2>
        <p className="text-sm mt-0.5 text-[var(--admin-ink-faint)]">Your company, brand, and alerts</p>
      </div>

      {toast && <div className="mb-4 rounded-xl p-3 text-sm bg-green-50 border border-green-200 text-green-700 flex items-center gap-2 animate-[fadeUp_0.2s_ease-out]"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>{toast}</div>}
      {error && <div className="mb-4 rounded-xl p-3 text-sm bg-red-50 border border-red-200 text-red-700">{error}</div>}

      {/* Branding */}
      <div className="mb-5 rounded-2xl border-2 border-[var(--admin-line)] bg-white overflow-hidden animate-[fadeUp_0.4s_ease-out]">
        <div className="px-4 sm:px-6 py-4 border-b border-[var(--admin-line)]">
          <h3 className="font-extrabold text-sm text-[var(--admin-ink)]">Brand</h3>
          <p className="text-xs mt-0.5 text-[var(--admin-ink-faint)]">Your logo sets the colors across the whole app.</p>
        </div>
        <div className="p-4 sm:p-6" style={logoPreview ? brandToCssVars(logoPreview.brand) : undefined}>
          <div className="flex items-center gap-4">
            <span className="grid place-items-center rounded-2xl overflow-hidden flex-shrink-0" style={{ width: 72, height: 72, background: currentLogo ? '#fff' : 'var(--admin-accent)', border: '2px solid var(--admin-line)' }}>
              {currentLogo ? <img src={currentLogo} alt="" className="h-full w-full object-contain p-1.5" /> : <span style={{ fontFamily: 'var(--font-anton)' }} className="text-2xl text-[var(--admin-ink)]">{(org?.name || 'H').charAt(0)}</span>}
            </span>
            <div className="flex-1">
              <button onClick={() => fileRef.current?.click()} className="px-4 py-2.5 rounded-xl text-sm font-bold border-2 border-[var(--admin-line)] hover:border-[var(--admin-ink)] transition-all text-[var(--admin-ink-soft)]">
                {currentLogo ? 'Change logo' : 'Upload logo'}
              </button>
              <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={onLogo} className="hidden" />
              {logoPreview && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-[var(--admin-ink-faint)]">Preview:</span>
                  <span className="w-6 h-6 rounded-md border border-black/10" style={{ background: 'var(--admin-primary)' }} />
                  <span className="w-6 h-6 rounded-md border border-black/10" style={{ background: 'var(--admin-accent)' }} />
                </div>
              )}
            </div>
          </div>
          {logoPreview && (
            <div className="mt-4 flex gap-3">
              <button onClick={() => setLogoPreview(null)} className="flex-1 py-2.5 rounded-xl font-bold bg-black/[0.05] text-[var(--admin-ink-soft)] hover:bg-black/[0.08] transition-colors">Cancel</button>
              <button onClick={saveLogo} disabled={savingLogo} className="flex-1 py-2.5 rounded-xl font-bold text-white transition-all disabled:opacity-40" style={{ background: 'var(--admin-primary)' }}>{savingLogo ? 'Saving...' : 'Save logo & theme'}</button>
            </div>
          )}
        </div>
      </div>

      {/* Business info */}
      <div className="mb-5 rounded-2xl border-2 border-[var(--admin-line)] bg-white overflow-hidden animate-[fadeUp_0.45s_ease-out]">
        <div className="px-4 sm:px-6 py-4 border-b border-[var(--admin-line)]"><h3 className="font-extrabold text-sm text-[var(--admin-ink)]">Business info</h3></div>
        <div className="p-4 sm:p-6 space-y-3">
          <Field label="Company name"><input type="text" value={info.name} onChange={(e) => setInfo(p => ({ ...p, name: e.target.value }))} style={{ fontSize: '16px' }} className={inp} /></Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Phone"><input type="tel" value={info.phone} onChange={(e) => setInfo(p => ({ ...p, phone: e.target.value }))} style={{ fontSize: '16px' }} className={inp} /></Field>
            <Field label="Email"><input type="email" value={info.email} onChange={(e) => setInfo(p => ({ ...p, email: e.target.value }))} style={{ fontSize: '16px' }} className={inp} /></Field>
          </div>
          <div className="flex justify-end"><button onClick={saveInfo} disabled={savingInfo} className="px-5 py-2.5 rounded-xl font-bold text-white transition-all disabled:opacity-40" style={{ background: 'var(--admin-primary)' }}>{savingInfo ? 'Saving...' : 'Save'}</button></div>
        </div>
      </div>

      {/* Recipients */}
      <div className="rounded-2xl border-2 border-[var(--admin-line)] bg-white overflow-hidden animate-[fadeUp_0.5s_ease-out]">
        <div className="px-4 sm:px-6 py-4 border-b border-[var(--admin-line)] flex items-start justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-sm text-[var(--admin-ink)]">New-lead text alerts</h3>
            <p className="text-xs mt-0.5 text-[var(--admin-ink-faint)]">Everyone enabled gets a text when a new lead comes in.</p>
          </div>
          <button onClick={openAddRec} className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.97]" style={{ background: 'var(--admin-primary)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>Add
          </button>
        </div>
        {loading ? (
          <div className="p-8 text-center"><div className="inline-block w-6 h-6 rounded-full animate-spin" style={{ border: '3px solid var(--admin-primary)', borderTopColor: 'transparent' }} /></div>
        ) : recipients.length === 0 ? (
          <div className="p-8 text-center"><p className="text-sm text-[var(--admin-ink-faint)]">No recipients yet. Add yourself so you never miss a lead.</p></div>
        ) : (
          <div className="divide-y divide-[var(--admin-line)]">
            {recipients.map(rec => (
              <div key={rec.id} className="px-4 sm:px-6 py-3.5 flex items-center gap-3">
                <div className="min-w-0 flex-1"><p className="font-bold text-sm text-[var(--admin-ink)]">{rec.name}</p><p className="text-xs text-[var(--admin-ink-faint)]">{formatPhone(rec.phone)}</p></div>
                <button onClick={() => toggleRec(rec)} className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0" style={{ background: rec.enabled ? 'var(--admin-primary)' : 'var(--admin-line)' }}>
                  <span className={'absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ' + (rec.enabled ? 'left-[22px]' : 'left-0.5')} />
                </button>
                <button onClick={() => openEditRec(rec)} className="p-2 rounded-lg text-[var(--admin-ink-faint)] hover:text-[var(--admin-primary)] hover:bg-black/[0.03] transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                <button onClick={() => deleteRec(rec)} className="p-2 rounded-lg text-[var(--admin-ink-faint)] hover:text-red-500 hover:bg-red-50 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm" onClick={() => { setShowAdd(false); setEditing(null) }}>
          <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border-[3px] border-[var(--admin-ink)] bg-white animate-[fadeUp_0.2s_ease-out]" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 sm:p-5 border-b border-[var(--admin-line)]">
              <div className="w-8 h-1 rounded-full mx-auto mb-3 sm:hidden bg-[var(--admin-line)]" />
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-[var(--admin-ink)]">{editing ? 'Edit Recipient' : 'Add Recipient'}</h3>
                <button onClick={() => { setShowAdd(false); setEditing(null) }} className="p-1 text-[var(--admin-ink-faint)] hover:text-[var(--admin-ink-soft)]"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
            </div>
            <div className="p-4 sm:p-5 space-y-3">
              <Field label="Name *"><input type="text" value={recForm.name} onChange={(e) => setRecForm(p => ({ ...p, name: e.target.value }))} placeholder="Who gets the alert" autoFocus style={{ fontSize: '16px' }} className={inp} /></Field>
              <Field label="Mobile number *"><input type="tel" value={recForm.phone} onChange={(e) => setRecForm(p => ({ ...p, phone: e.target.value }))} placeholder="(770) 000-0000" style={{ fontSize: '16px' }} className={inp} /></Field>
            </div>
            <div className="p-4 sm:p-5 border-t border-[var(--admin-line)] flex items-center gap-3">
              <button onClick={() => { setShowAdd(false); setEditing(null) }} className="flex-1 py-3 rounded-xl font-bold bg-black/[0.05] text-[var(--admin-ink-soft)] hover:bg-black/[0.08] transition-colors">Cancel</button>
              <button onClick={saveRec} disabled={!recValid} className="flex-1 py-3 rounded-xl font-bold text-white transition-all disabled:opacity-40" style={{ background: 'var(--admin-primary)' }}>{editing ? 'Save' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  )
}

const inp = 'w-full px-3.5 py-2.5 rounded-xl border-2 border-[var(--admin-line)] text-sm outline-none transition-all focus:border-[var(--admin-primary)]'
function Field({ label, children }) {
  return <div><label className="block text-[10px] uppercase tracking-widest font-bold mb-1 text-[var(--admin-ink-faint)]">{label}</label>{children}</div>
}