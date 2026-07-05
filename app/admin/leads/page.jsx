'use client'

// app/admin/leads/page.jsx
// Haul It All leads inbox. Website form leads plus manual phone-in adds.

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAdminAuth } from '../layout'
import { PIPELINE_STAGES, STAGE_BY_KEY, SERVICE_OPTIONS } from '@/lib/pipeline'

const FILTERS = [{ value: 'all', label: 'All' }, ...PIPELINE_STAGES.map(s => ({ value: s.key, label: s.label }))]
const EMPTY_LEAD = { name: '', phone: '', email: '', service_type: '', city: '', details: '', initial_status: 'new' }

export default function LeadsPage() {
  const { user } = useAdminAuth()
  const router = useRouter()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [showAdd, setShowAdd] = useState(false)
  const [newLead, setNewLead] = useState(EMPTY_LEAD)
  const [saving, setSaving] = useState(false)
  const [addError, setAddError] = useState('')

  useEffect(() => { if (user) fetchLeads() }, [user])

  const fetchLeads = async () => {
    try {
      const params = user.role === 'member' ? `?user_id=${user.id}&user_role=member` : ''
      const r = await fetch('/api/admin/leads' + params)
      const res = await r.json()
      if (res.data) setLeads(res.data)
    } catch (e) { /* noop */ }
    finally { setLoading(false) }
  }

  const isAddValid = newLead.name.trim() && newLead.phone.trim()

  const handleAdd = async () => {
    if (!isAddValid) return
    setSaving(true); setAddError('')
    try {
      const r = await fetch('/api/admin/leads', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newLead.name.trim(),
          phone: newLead.phone.trim(),
          email: newLead.email.trim() || null,
          service_type: newLead.service_type || null,
          city: newLead.city.trim() || null,
          details: newLead.details.trim() || null,
          source: 'manual',
          initial_status: newLead.initial_status,
        }),
      })
      const res = await r.json()
      if (!r.ok) { setAddError(res.error || 'Failed to add lead'); return }
      setShowAdd(false); setNewLead(EMPTY_LEAD)
      if (res.data?.id) router.push('/admin/leads/' + res.data.id)
      else fetchLeads()
    } catch (e) { setAddError('Failed to add lead') }
    finally { setSaving(false) }
  }

  const filtered = leads
    .filter(l => {
      if (filter !== 'all' && (l.status || 'new') !== filter) return false
      if (search) { const q = search.toLowerCase(); return l.name?.toLowerCase().includes(q) || l.email?.toLowerCase().includes(q) || l.phone?.includes(q) || l.service_type?.toLowerCase().includes(q) || l.city?.toLowerCase().includes(q) }
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at)
      if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at)
      if (sortBy === 'scheduled') { if (!a.scheduled_date && !b.scheduled_date) return 0; if (!a.scheduled_date) return 1; if (!b.scheduled_date) return -1; return new Date(a.scheduled_date) - new Date(b.scheduled_date) }
      return 0
    })

  const formatPhone = (p) => { if (!p) return ''; const c = p.replace(/\D/g, ''); if (c.length === 10) return '(' + c.slice(0,3) + ') ' + c.slice(3,6) + '-' + c.slice(6); return p }
  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const formatDateTime = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
  const badge = (s) => STAGE_BY_KEY[s]?.badge || 'bg-gray-100 text-gray-700'
  const label = (s) => STAGE_BY_KEY[s]?.label || s
  const count = (s) => s === 'all' ? leads.length : leads.filter(l => (l.status || 'new') === s).length
  const timeAgo = (d) => { const s = Math.floor((Date.now() - new Date(d)) / 1000); if (s < 3600) return Math.floor(s/60) + 'm ago'; if (s < 86400) return Math.floor(s/3600) + 'h ago'; if (s < 604800) return Math.floor(s/86400) + 'd ago'; return formatDate(d) }
  const urgency = (l) => { if (!['new', 'contacting'].includes(l.status)) return ''; const h = (Date.now() - new Date(l.created_at)) / 36e5; if (h < 1) return 'border-l-4 border-l-emerald-400'; if (h < 24) return 'border-l-4 border-l-amber-400'; return 'border-l-4 border-l-red-400' }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-10 h-10 rounded-full animate-spin" style={{ border: '4px solid var(--admin-primary)', borderTopColor: 'transparent' }} />
    </div>
  )

  const stat = (key, labelText, barColor) => (
    <div className="relative overflow-hidden rounded-2xl border-2 border-[var(--admin-line)] bg-white p-3.5">
      <div className={'absolute top-0 left-0 w-1 h-full ' + barColor} />
      <p className="ml-2 text-[10px] uppercase tracking-widest font-bold text-[var(--admin-ink-faint)]">{labelText}</p>
      <p className="ml-2 mt-0.5 text-2xl font-extrabold tabular-nums text-[var(--admin-ink)]">{count(key)}</p>
    </div>
  )

  return (
    <div className="px-4 py-5 sm:py-8">
      <div className="mb-5 sm:mb-6 flex items-center justify-between animate-[fadeUp_0.3s_ease-out]">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--admin-ink)]">{user?.role === 'member' ? 'My Leads' : 'Leads'}</h2>
          <p className="text-sm mt-0.5 text-[var(--admin-ink-faint)]">{leads.length} total</p>
        </div>
        <button onClick={() => { setNewLead(EMPTY_LEAD); setAddError(''); setShowAdd(true) }} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.97]" style={{ background: 'var(--admin-primary)' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>Add
        </button>
      </div>

      <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3 animate-[fadeUp_0.35s_ease-out]">
        {stat('new', 'New', 'bg-blue-400')}
        {stat('quoted', 'Quoted', 'bg-indigo-400')}
        {stat('scheduled', 'Scheduled', 'bg-purple-400')}
        {stat('completed', 'Completed', 'bg-green-400')}
      </div>

      <div className="mb-4 sm:mb-6 animate-[fadeUp_0.4s_ease-out]">
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--admin-ink-faint)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Search name, phone, service, city..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ fontSize: '16px' }}
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[var(--admin-line)] bg-white text-sm outline-none transition-all focus:border-[var(--admin-primary)]" />
        </div>
      </div>

      <div className="mb-4 sm:mb-6 -mx-4 px-4 overflow-x-auto scrollbar-hide animate-[fadeUp_0.45s_ease-out]">
        <div className="flex gap-2 sm:flex-wrap">
          {FILTERS.map(f => (
            <button key={f.value} onClick={() => setFilter(f.value)}
              className={'flex-shrink-0 px-3 sm:px-4 py-2 rounded-full text-sm font-semibold transition-all ' + (filter === f.value ? 'text-white' : 'bg-white border-2 border-[var(--admin-line)] text-[var(--admin-ink-soft)] hover:border-[var(--admin-ink)] active:scale-95')}
              style={filter === f.value ? { background: 'var(--admin-primary)' } : undefined}>
              {f.label}<span className={'ml-1.5 ' + (filter === f.value ? 'text-white/60' : 'text-[var(--admin-ink-faint)]')}>{count(f.value)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between animate-[fadeUp_0.5s_ease-out]">
        <p className="text-sm text-[var(--admin-ink-faint)]">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-sm bg-transparent border-none focus:ring-0 cursor-pointer pr-6 text-[var(--admin-ink-soft)]">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="scheduled">By scheduled date</option>
        </select>
      </div>

      <div className="rounded-2xl border-2 border-[var(--admin-line)] bg-white overflow-hidden animate-[fadeUp_0.55s_ease-out]">
        {filtered.length === 0 ? (
          <div className="p-8 sm:p-12 text-center"><p className="text-[var(--admin-ink-faint)]">{search ? 'No leads match your search' : 'No leads found'}</p></div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black/[0.02]">
                  <tr>
                    {['Lead', 'Service', 'Status', 'Scheduled', 'Submitted', ''].map((h, i) => (
                      <th key={i} className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[var(--admin-ink-faint)]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--admin-line)]">
                  {filtered.map(l => (
                    <tr key={l.id} className={'group hover:bg-black/[0.02] transition-colors ' + urgency(l)}>
                      <td className="px-6 py-4"><p className="font-bold text-sm text-[var(--admin-ink)]">{l.name}</p><p className="text-xs mt-0.5 text-[var(--admin-ink-faint)]">{formatPhone(l.phone)}</p></td>
                      <td className="px-6 py-4 text-sm text-[var(--admin-ink-soft)]">{l.service_type || '-'}</td>
                      <td className="px-6 py-4"><span className={'inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold ' + badge(l.status)}>{label(l.status)}</span></td>
                      <td className="px-6 py-4 text-sm text-[var(--admin-ink-faint)]">{l.scheduled_date ? formatDate(l.scheduled_date) : '-'}</td>
                      <td className="px-6 py-4 text-sm text-[var(--admin-ink-faint)]"><p>{formatDateTime(l.created_at)}</p><p className="text-[10px] mt-0.5">{timeAgo(l.created_at)}</p></td>
                      <td className="px-6 py-4"><Link href={'/admin/leads/' + l.id} className="text-sm font-bold text-[var(--admin-primary)] opacity-0 group-hover:opacity-100 transition-opacity">View</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden divide-y divide-[var(--admin-line)]">
              {filtered.map(l => (
                <Link key={l.id} href={'/admin/leads/' + l.id} className={'block p-4 active:bg-black/[0.03] transition-colors ' + urgency(l)}>
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="min-w-0 flex-1"><p className="font-bold truncate text-[var(--admin-ink)]">{l.name}</p><p className="text-sm text-[var(--admin-ink-faint)]">{l.service_type || 'No service set'}</p></div>
                    <div className="flex flex-col items-end ml-3"><span className={'inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold ' + badge(l.status)}>{label(l.status)}</span><p className="text-[10px] mt-1 text-[var(--admin-ink-faint)]">{timeAgo(l.created_at)}</p></div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-[var(--admin-ink-faint)]">
                    <span>{formatPhone(l.phone)}</span>
                    {l.scheduled_date && <span>· {formatDate(l.scheduled_date)}</span>}
                    {l.city && <span>· {l.city}</span>}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowAdd(false)}>
          <div className="w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border-[3px] border-[var(--admin-ink)] bg-white animate-[fadeUp_0.2s_ease-out]" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 sm:p-5 border-b border-[var(--admin-line)]">
              <div className="w-8 h-1 rounded-full mx-auto mb-3 sm:hidden bg-[var(--admin-line)]" />
              <div className="flex items-center justify-between">
                <div><h3 className="text-lg font-extrabold text-[var(--admin-ink)]">Add Lead</h3><p className="text-xs mt-0.5 text-[var(--admin-ink-faint)]">For phone-in calls or referrals</p></div>
                <button onClick={() => setShowAdd(false)} className="p-1 text-[var(--admin-ink-faint)] hover:text-[var(--admin-ink-soft)]"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
            </div>
            <div className="p-4 sm:p-5 space-y-3">
              {addError && <div className="rounded-xl p-3 text-sm bg-red-50 border border-red-200 text-red-700">{addError}</div>}
              <Field label="Name *"><input type="text" value={newLead.name} onChange={(e) => setNewLead(p => ({ ...p, name: e.target.value }))} placeholder="Customer name" autoFocus style={{ fontSize: '16px' }} className={inputCls} /></Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Phone *"><input type="tel" value={newLead.phone} onChange={(e) => setNewLead(p => ({ ...p, phone: e.target.value }))} placeholder="(770) 000-0000" style={{ fontSize: '16px' }} className={inputCls} /></Field>
                <Field label="Email"><input type="email" value={newLead.email} onChange={(e) => setNewLead(p => ({ ...p, email: e.target.value }))} placeholder="Optional" style={{ fontSize: '16px' }} className={inputCls} /></Field>
              </div>
              <Field label="Service">
                <select value={newLead.service_type} onChange={(e) => setNewLead(p => ({ ...p, service_type: e.target.value }))} className={inputCls + ' bg-white'}>
                  <option value="">Select service...</option>
                  {SERVICE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="City"><input type="text" value={newLead.city} onChange={(e) => setNewLead(p => ({ ...p, city: e.target.value }))} placeholder="Optional" style={{ fontSize: '16px' }} className={inputCls} /></Field>
              <Field label="Initial Stage">
                <select value={newLead.initial_status} onChange={(e) => setNewLead(p => ({ ...p, initial_status: e.target.value }))} className={inputCls + ' bg-white'}>
                  {PIPELINE_STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              </Field>
              <Field label="Notes"><textarea value={newLead.details} onChange={(e) => setNewLead(p => ({ ...p, details: e.target.value }))} rows={2} placeholder="What they need, where, what they said..." style={{ fontSize: '16px' }} className={inputCls + ' resize-none'} /></Field>
            </div>
            <div className="p-4 sm:p-5 border-t border-[var(--admin-line)] flex items-center gap-3">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-3 rounded-xl font-bold bg-black/[0.05] text-[var(--admin-ink-soft)] hover:bg-black/[0.08] transition-colors">Cancel</button>
              <button onClick={handleAdd} disabled={saving || !isAddValid} className="flex-1 py-3 rounded-xl font-bold text-white transition-all disabled:opacity-40" style={{ background: 'var(--admin-primary)' }}>{saving ? 'Adding...' : 'Add Lead'}</button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  )
}

const inputCls = 'w-full px-3.5 py-2.5 rounded-xl border-2 border-[var(--admin-line)] text-sm outline-none transition-all focus:border-[var(--admin-primary)]'

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest font-bold mb-1 text-[var(--admin-ink-faint)]">{label}</label>
      {children}
    </div>
  )
}