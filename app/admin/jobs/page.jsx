'use client'

// app/admin/jobs/page.jsx
// The Jobs board. A job is a work-phase lead (scheduled, in_progress, or
// completed). This is the crew's operational view: what's on today, what's in
// progress, what's coming, and what got done, with one-tap start/complete and
// on-the-spot payment capture. All org-scoped through the session.

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAdminAuth } from '../layout'

const ymd = (d) => { const n = new Date(d); return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}` }
const todayStr = () => ymd(new Date())
const fmtMoney = (n) => (n === null || n === undefined || n === '') ? null : '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 })

const TABS = [
  { key: 'today', label: 'Today' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'active', label: 'In Progress' },
  { key: 'done', label: 'Completed' },
]

const PAY = {
  paid: { label: 'Paid', cls: 'bg-green-100 text-green-700' },
  partial: { label: 'Partial', cls: 'bg-amber-100 text-amber-700' },
  unpaid: { label: 'Unpaid', cls: 'bg-red-100 text-red-600' },
}

export default function JobsPage() {
  const { user } = useAdminAuth()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('today')
  const [busy, setBusy] = useState(null)         // id being acted on
  const [complete, setComplete] = useState(null) // job being completed
  const [payForm, setPayForm] = useState({ amount: '', payment_status: 'paid' })
  const [toast, setToast] = useState('')

  useEffect(() => { if (user) fetchLeads() }, [user])

  const fetchLeads = async () => {
    try {
      const params = user.role === 'member' ? `?user_id=${user.id}&user_role=member` : ''
      const r = await fetch('/api/admin/leads' + params)
      const res = await r.json()
      if (res.data) setLeads(res.data)
    } catch (e) { /* noop */ } finally { setLoading(false) }
  }

  const flash = (m) => { setToast(m); setTimeout(() => setToast(''), 2500) }
  const today = todayStr()
  const weekAgo = ymd(new Date(Date.now() - 6 * 864e5))

  const jobs = leads.filter(l => ['scheduled', 'in_progress', 'completed'].includes(l.status))
  const inBucket = {
    today: jobs.filter(l => l.status === 'scheduled' && l.scheduled_date && l.scheduled_date.slice(0, 10) <= today),
    upcoming: jobs.filter(l => l.status === 'scheduled' && (!l.scheduled_date || l.scheduled_date.slice(0, 10) > today)),
    active: jobs.filter(l => l.status === 'in_progress'),
    done: jobs.filter(l => l.status === 'completed'),
  }
  const sorters = {
    today: (a, b) => (a.scheduled_date || '').localeCompare(b.scheduled_date || '') || (a.scheduled_time || '').localeCompare(b.scheduled_time || ''),
    upcoming: (a, b) => (a.scheduled_date || '').localeCompare(b.scheduled_date || ''),
    active: (a, b) => (a.scheduled_date || '').localeCompare(b.scheduled_date || ''),
    done: (a, b) => (b.completed_at || '').localeCompare(a.completed_at || ''),
  }
  const list = [...(inBucket[tab] || [])].sort(sorters[tab])

  const doneThisWeek = inBucket.done.filter(l => l.completed_at && l.completed_at.slice(0, 10) >= weekAgo)
  const collectedThisWeek = doneThisWeek.reduce((s, l) => s + (Number(l.amount_collected) || 0), 0)

  const patch = async (id, body) => {
    setBusy(id)
    try {
      await fetch('/api/admin/leads', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...body }) })
      await fetchLeads()
    } catch (e) { /* noop */ } finally { setBusy(null) }
  }

  const startJob = (l) => patch(l.id, { status: 'in_progress' }).then(() => flash('Job started'))
  const openComplete = (l) => { setComplete(l); setPayForm({ amount: (l.quoted_amount ?? '').toString(), payment_status: 'paid' }) }
  const confirmComplete = async () => {
    const l = complete
    await patch(l.id, {
      status: 'completed', completed_at: new Date().toISOString(),
      amount_collected: payForm.amount === '' ? null : Number(payForm.amount),
      payment_status: payForm.payment_status,
    })
    setComplete(null); flash('Job completed')
  }

  const fmtDate = (d) => d ? new Date(d.slice(0, 10) + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : null
  const isOverdue = (l) => l.status === 'scheduled' && l.scheduled_date && l.scheduled_date.slice(0, 10) < today

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-10 h-10 rounded-full animate-spin" style={{ border: '4px solid var(--admin-primary)', borderTopColor: 'transparent' }} />
    </div>
  )

  return (
    <div className="px-4 py-5 sm:py-8">
      <div className="mb-5 animate-[fadeUp_0.3s_ease-out]">
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--admin-ink)]">Jobs</h2>
        <p className="text-sm mt-0.5 text-[var(--admin-ink-faint)]">Your scheduled and active work</p>
      </div>

      {toast && <div className="mb-4 rounded-xl p-3 text-sm bg-green-50 border border-green-200 text-green-700 flex items-center gap-2 animate-[fadeUp_0.2s_ease-out]"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>{toast}</div>}

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3 animate-[fadeUp_0.35s_ease-out]">
        <Stat label="Today" value={inBucket.today.length} bar="bg-blue-400" />
        <Stat label="In progress" value={inBucket.active.length} bar="bg-amber-400" />
        <Stat label="Done / 7 days" value={doneThisWeek.length} bar="bg-green-400" />
        <Stat label="Collected / 7 days" value={fmtMoney(collectedThisWeek) || '$0'} bar="bg-emerald-400" />
      </div>

      {/* Tabs */}
      <div className="mb-4 -mx-4 px-4 overflow-x-auto scrollbar-hide animate-[fadeUp_0.4s_ease-out]">
        <div className="flex gap-2">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={'flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ' + (tab === t.key ? 'text-white' : 'bg-white border-2 border-[var(--admin-line)] text-[var(--admin-ink-soft)] hover:border-[var(--admin-ink)]')}
              style={tab === t.key ? { background: 'var(--admin-primary)' } : undefined}>
              {t.label}<span className={'ml-1.5 ' + (tab === t.key ? 'text-white/60' : 'text-[var(--admin-ink-faint)]')}>{inBucket[t.key].length}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Job list */}
      {list.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-[var(--admin-line)] p-10 text-center animate-[fadeUp_0.45s_ease-out]">
          <p className="text-sm text-[var(--admin-ink-faint)]">
            {tab === 'today' ? 'No jobs scheduled for today.' : tab === 'upcoming' ? 'Nothing upcoming.' : tab === 'active' ? 'No jobs in progress.' : 'No completed jobs yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3 animate-[fadeUp_0.45s_ease-out]">
          {list.map(l => {
            const overdue = isOverdue(l)
            return (
              <div key={l.id} className="rounded-2xl border-2 border-[var(--admin-line)] bg-white overflow-hidden">
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link href={'/admin/leads/' + l.id} className="font-bold text-[var(--admin-ink)] hover:text-[var(--admin-primary)] transition-colors">{l.name}</Link>
                        {overdue && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-red-100 text-red-600">Overdue</span>}
                        {l.status === 'in_progress' && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-700">In progress</span>}
                      </div>
                      <p className="text-sm mt-0.5 text-[var(--admin-ink-faint)]">{l.service_type || 'No service set'}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {l.status === 'completed'
                        ? <p className="font-extrabold text-[var(--admin-ink)]">{fmtMoney(l.amount_collected) || '—'}</p>
                        : (fmtMoney(l.quoted_amount) && <p className="text-sm font-bold text-[var(--admin-ink-soft)]">{fmtMoney(l.quoted_amount)}<span className="text-[10px] font-medium text-[var(--admin-ink-faint)]"> quote</span></p>)}
                      {l.status === 'completed' && l.payment_status && <span className={'inline-flex mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold ' + (PAY[l.payment_status]?.cls || '')}>{PAY[l.payment_status]?.label}</span>}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--admin-ink-faint)]">
                    {l.status === 'completed'
                      ? l.completed_at && <Meta icon="M5 13l4 4L19 7" text={'Done ' + fmtDate(l.completed_at)} />
                      : l.scheduled_date && <Meta icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" text={fmtDate(l.scheduled_date) + (l.scheduled_time ? ' · ' + l.scheduled_time : '')} />}
                    {(l.city || l.address) && <Meta icon="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" text={l.address || l.city} />}
                    {l.assigned_user?.name && <Meta icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" text={l.assigned_user.name} />}
                    <Meta icon="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" text={l.phone} link={'tel:' + l.phone} />
                  </div>
                </div>

                {(l.status === 'scheduled' || l.status === 'in_progress') && (
                  <div className="flex border-t border-[var(--admin-line)]">
                    <Link href={'/admin/leads/' + l.id} className="flex-1 py-3 text-center text-sm font-bold text-[var(--admin-ink-soft)] hover:bg-black/[0.02] transition-colors">View</Link>
                    {l.status === 'scheduled' ? (
                      <button onClick={() => startJob(l)} disabled={busy === l.id} className="flex-1 py-3 text-center text-sm font-bold border-l border-[var(--admin-line)] text-white transition-all disabled:opacity-50" style={{ background: 'var(--admin-primary)' }}>{busy === l.id ? '...' : 'Start job'}</button>
                    ) : (
                      <button onClick={() => openComplete(l)} disabled={busy === l.id} className="flex-1 py-3 text-center text-sm font-bold border-l border-[var(--admin-line)] text-white transition-all disabled:opacity-50" style={{ background: 'var(--admin-primary)' }}>Complete</button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Complete modal */}
      {complete && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm" onClick={() => setComplete(null)}>
          <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border-[3px] border-[var(--admin-ink)] bg-white animate-[fadeUp_0.2s_ease-out]" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 sm:p-5 border-b border-[var(--admin-line)]">
              <div className="w-8 h-1 rounded-full mx-auto mb-3 sm:hidden bg-[var(--admin-line)]" />
              <div className="flex items-center justify-between">
                <div><h3 className="text-lg font-extrabold text-[var(--admin-ink)]">Complete job</h3><p className="text-xs mt-0.5 text-[var(--admin-ink-faint)]">{complete.name}</p></div>
                <button onClick={() => setComplete(null)} className="p-1 text-[var(--admin-ink-faint)] hover:text-[var(--admin-ink-soft)]"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
            </div>
            <div className="p-4 sm:p-5 space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold mb-1 text-[var(--admin-ink-faint)]">Amount collected</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--admin-ink-faint)] font-bold">$</span>
                  <input type="number" inputMode="decimal" value={payForm.amount} onChange={(e) => setPayForm(p => ({ ...p, amount: e.target.value }))} placeholder="0" style={{ fontSize: '16px' }}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border-2 border-[var(--admin-line)] text-sm outline-none transition-all focus:border-[var(--admin-primary)]" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold mb-1.5 text-[var(--admin-ink-faint)]">Payment</label>
                <div className="grid grid-cols-3 gap-2">
                  {['paid', 'partial', 'unpaid'].map(p => (
                    <button key={p} onClick={() => setPayForm(f => ({ ...f, payment_status: p }))} className={'py-2.5 rounded-xl text-sm font-bold border-2 capitalize transition-all ' + (payForm.payment_status === p ? 'text-white border-transparent' : 'bg-white text-[var(--admin-ink-soft)] border-[var(--admin-line)] hover:border-[var(--admin-ink)]')} style={payForm.payment_status === p ? { background: 'var(--admin-primary)' } : undefined}>{p}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-5 border-t border-[var(--admin-line)] flex items-center gap-3">
              <button onClick={() => setComplete(null)} className="flex-1 py-3 rounded-xl font-bold bg-black/[0.05] text-[var(--admin-ink-soft)] hover:bg-black/[0.08] transition-colors">Cancel</button>
              <button onClick={confirmComplete} disabled={busy === complete.id} className="flex-1 py-3 rounded-xl font-bold text-white transition-all disabled:opacity-40" style={{ background: 'var(--admin-primary)' }}>{busy === complete.id ? 'Saving...' : 'Mark complete'}</button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  )
}

function Stat({ label, value, bar }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-[var(--admin-line)] bg-white p-3.5">
      <div className={'absolute top-0 left-0 w-1 h-full ' + bar} />
      <p className="ml-2 text-[10px] uppercase tracking-widest font-bold text-[var(--admin-ink-faint)]">{label}</p>
      <p className="ml-2 mt-0.5 text-2xl font-extrabold tabular-nums text-[var(--admin-ink)]">{value}</p>
    </div>
  )
}

function Meta({ icon, text, link }) {
  const inner = (
    <span className="inline-flex items-center gap-1">
      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d={icon} /></svg>
      {text}
    </span>
  )
  return link ? <a href={link} className="hover:text-[var(--admin-primary)] transition-colors">{inner}</a> : inner
}