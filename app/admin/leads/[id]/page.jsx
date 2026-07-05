'use client'

// app/admin/leads/[id]/page.jsx
// Haul It All lead detail. Pipeline mover, photo gallery, scheduling, notes,
// recommended action, quick call + text. No crew, email, or activity feed yet
// (those need routes and tables we do not have; wired in a later phase).

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAdminAuth } from '../../layout'
import { PIPELINE_STAGES, STAGE_BY_KEY, CLOSE_REASONS, SERVICE_OPTIONS, getRecommendedAction } from '@/lib/pipeline'

const STATUS_OPTIONS = PIPELINE_STAGES.map(s => ({ value: s.key, label: s.label, color: s.pillActive }))
const TIME_OPTIONS = ['7:00 AM - 9:00 AM', '8:00 AM - 10:00 AM', '9:00 AM - 11:00 AM', '10:00 AM - 12:00 PM', '12:00 PM - 2:00 PM', '1:00 PM - 3:00 PM', '2:00 PM - 4:00 PM', '3:00 PM - 5:00 PM']

// Light SMS templates. Copy-and-open-Messages, no server send yet.
const SMS_TEMPLATES = [
  { label: 'New lead intro', text: "Hey {name}, this is Haul It All. We got your request for {service} and would love to help. Reply here or call us and we will get you a price. Thanks!" },
  { label: 'On the way', text: "Hey {name}, we are on our way and should be there in about 20 minutes. See you soon!" },
  { label: 'Quote follow-up', text: "Hey {name}, just checking in on your {service} quote. Happy to answer any questions or get you on the schedule." },
  { label: 'Scheduled confirm', text: "Hey {name}, you are on the schedule for {date}. We will text when we are on the way. Thanks for choosing Haul It All!" },
  { label: 'Review request', text: "Hey {name}, thanks for choosing Haul It All! If you were happy with the job, a quick Google review would mean a lot to us." },
]

export default function LeadDetailPage() {
  const { user, hasPermission } = useAdminAuth()
  const params = useParams()
  const router = useRouter()
  const leadId = params.id

  const [lead, setLead] = useState(null)
  const [teamUsers, setTeamUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [error, setError] = useState('')
  const [showCloseModal, setShowCloseModal] = useState(false)
  const [closeReason, setCloseReason] = useState('')
  const [showSms, setShowSms] = useState(false)
  const [smsText, setSmsText] = useState('')
  const [lightbox, setLightbox] = useState(null)
  const [form, setForm] = useState({ status: 'new', notes: '', next_follow_up: '', scheduled_date: '', scheduled_time: '', address: '', city: '', assigned_to: '' })

  useEffect(() => { if (leadId && user) { fetchLead(); if (user.role === 'admin') fetchUsers() } }, [leadId, user])

  const fetchLead = async () => {
    try {
      const r = await fetch('/api/admin/leads')
      const res = await r.json()
      if (res.data) {
        const f = res.data.find(l => l.id === leadId)
        if (f) {
          setLead(f)
          setForm({ status: f.status || 'new', notes: f.notes || '', next_follow_up: f.next_follow_up || '', scheduled_date: f.scheduled_date || '', scheduled_time: f.scheduled_time || '', address: f.address || '', city: f.city || '', assigned_to: f.assigned_to || '' })
        } else setError('Lead not found')
      }
    } catch (e) { setError('Failed to load') }
    finally { setLoading(false) }
  }

  const fetchUsers = async () => {
    try { const r = await fetch('/api/admin/users'); const d = await r.json(); if (d.users) setTeamUsers(d.users.filter(u => u.is_active)) } catch (e) { /* users route may not exist yet */ }
  }

  const handleSave = async () => {
    setSaving(true); setError(''); setSuccessMsg('')
    try {
      const r = await fetch('/api/admin/leads', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, status: form.status, notes: form.notes, next_follow_up: form.next_follow_up || null, scheduled_date: form.scheduled_date || null, scheduled_time: form.scheduled_time || null, address: form.address || null, city: form.city || null, assigned_to: form.assigned_to || null }),
      })
      if (r.ok) { setSuccessMsg('Saved'); fetchLead(); setTimeout(() => setSuccessMsg(''), 2500) }
      else setError('Failed to save')
    } catch (e) { setError('Failed to save') }
    finally { setSaving(false) }
  }

  const handleStatusChange = async (newStatus) => {
    if (newStatus === 'lost') { setShowCloseModal(true); return }
    setForm(p => ({ ...p, status: newStatus }))
    try {
      await fetch('/api/admin/leads', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: leadId, status: newStatus }) })
      setSuccessMsg('Status updated'); fetchLead(); setTimeout(() => setSuccessMsg(''), 2500)
    } catch (e) { /* noop */ }
  }

  const handleCloseLost = async () => {
    setForm(p => ({ ...p, status: 'lost' })); setShowCloseModal(false)
    try {
      await fetch('/api/admin/leads', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: leadId, status: 'lost', close_reason: closeReason }) })
      setSuccessMsg('Marked as lost'); fetchLead(); setTimeout(() => setSuccessMsg(''), 2500)
    } catch (e) { /* noop */ }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this lead permanently?')) return
    setDeleting(true)
    try { await fetch('/api/admin/leads', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: leadId }) }); router.push('/admin/leads') }
    catch (e) { setError('Failed to delete'); setDeleting(false) }
  }

  const resolveVars = (text) => text
    .replace(/\{name\}/g, lead.name.split(' ')[0])
    .replace(/\{service\}/g, lead.service_type || 'your project')
    .replace(/\{date\}/g, form.scheduled_date ? new Date(form.scheduled_date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'your scheduled date')

  const handleCopySms = async () => {
    const resolved = resolveVars(smsText)
    try { await navigator.clipboard.writeText(resolved) } catch (e) { /* noop */ }
    setSuccessMsg('Copied. Opening Messages...'); setShowSms(false); setSmsText('')
    setTimeout(() => { window.location.href = 'sms:' + lead.phone }, 300)
    setTimeout(() => setSuccessMsg(''), 2500)
  }

  const formatPhone = (p) => { if (!p) return ''; const c = p.replace(/\D/g, ''); if (c.length === 10) return '(' + c.slice(0,3) + ') ' + c.slice(3,6) + '-' + c.slice(6); return p }
  const photos = lead?.photo_urls || []
  const rec = lead ? getRecommendedAction(form.status, { ...lead, scheduled_date: form.scheduled_date }) : null

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-10 h-10 rounded-full animate-spin" style={{ border: '4px solid var(--admin-primary)', borderTopColor: 'transparent' }} />
    </div>
  )
  if (error && !lead) return (
    <div className="px-4 py-8 text-center"><p className="mb-4 text-[var(--admin-ink-faint)]">{error}</p><Link href="/admin/leads" className="font-bold text-[var(--admin-primary)]">Back to leads</Link></div>
  )

  return (
    <div className="px-4 py-5 sm:py-8">
      <div className="mb-6 animate-[fadeUp_0.3s_ease-out]">
        <Link href="/admin/leads" className="inline-flex items-center gap-1 text-sm mb-4 transition-colors text-[var(--admin-ink-faint)] hover:text-[var(--admin-primary)]"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>Back</Link>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight truncate text-[var(--admin-ink)]">{lead?.name}</h1>
            <p className="text-sm mt-0.5 text-[var(--admin-ink-faint)]">{lead?.service_type || 'No service set'} · {new Date(lead?.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>
          </div>
          <button onClick={handleSave} disabled={saving} className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40 active:scale-[0.97]" style={{ background: 'var(--admin-primary)' }}>{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>

      {successMsg && <div className="mb-4 rounded-xl p-3 text-sm bg-green-50 border border-green-200 text-green-700 flex items-center gap-2 animate-[fadeUp_0.2s_ease-out]"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>{successMsg}</div>}
      {error && lead && <div className="mb-4 rounded-xl p-3 text-sm bg-red-50 border border-red-200 text-red-700">{error}</div>}
      {rec && <div className={'mb-5 rounded-xl p-3.5 flex items-center gap-3 animate-[fadeUp_0.35s_ease-out] ' + (rec.urgency === 'high' ? 'bg-amber-50 border border-amber-200' : 'bg-blue-50 border border-blue-200')}>{rec.urgency === 'high' && <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />}<p className={'text-sm font-bold ' + (rec.urgency === 'high' ? 'text-amber-800' : 'text-blue-800')}>{rec.text}</p></div>}

      {/* Quick actions */}
      <div className="flex gap-2 mb-6 animate-[fadeUp_0.4s_ease-out]">
        <button onClick={() => window.location.href = 'tel:' + lead.phone} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-[var(--admin-line)] bg-white text-sm font-bold text-[var(--admin-ink-soft)] hover:border-[var(--admin-ink)] transition-all active:scale-[0.97]">
          <svg className="w-4 h-4 text-[var(--admin-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>Call
        </button>
        {hasPermission('sms') && (
          <button onClick={() => setShowSms(true)} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-[var(--admin-line)] bg-white text-sm font-bold text-[var(--admin-ink-soft)] hover:border-[var(--admin-ink)] transition-all active:scale-[0.97]">
            <svg className="w-4 h-4 text-[var(--admin-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>Text
          </button>
        )}
      </div>

      {/* Pipeline */}
      <div className="mb-6 animate-[fadeUp_0.45s_ease-out]">
        <p className="text-[10px] uppercase tracking-widest font-bold mb-2 text-[var(--admin-ink-faint)]">Pipeline Stage</p>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1">
          {STATUS_OPTIONS.map(s => (
            <button key={s.value} onClick={() => handleStatusChange(s.value)}
              className={'flex-shrink-0 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border whitespace-nowrap transition-all active:scale-95 ' + (form.status === s.value ? s.color : 'bg-white text-[var(--admin-ink-faint)] border-[var(--admin-line)] hover:border-[var(--admin-ink)]')}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:gap-5 lg:grid-cols-3 animate-[fadeUp_0.5s_ease-out]">
        <div className="lg:col-span-2 space-y-4">
          {/* Photos */}
          <div className="rounded-2xl border-2 border-[var(--admin-line)] bg-white p-4 sm:p-6">
            <h3 className="font-extrabold text-sm mb-4 text-[var(--admin-ink)]">Photos <span className="font-medium text-[var(--admin-ink-faint)]">({photos.length})</span></h3>
            {photos.length === 0 ? (
              <p className="text-sm text-[var(--admin-ink-faint)]">No photos attached to this lead.</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {photos.map((url, i) => (
                  <button key={i} onClick={() => setLightbox(url)} className="aspect-square rounded-xl overflow-hidden border-2 border-[var(--admin-line)] bg-black/[0.03] active:scale-95 transition-transform">
                    { /* eslint-disable-next-line @next/next/no-img-element */ }
                    <img src={url} alt={'Lead photo ' + (i + 1)} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Lead info */}
          <div className="rounded-2xl border-2 border-[var(--admin-line)] bg-white p-4 sm:p-6">
            <h3 className="font-extrabold text-sm mb-4 text-[var(--admin-ink)]">Lead Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Tile label="Name" value={lead?.name} />
              <Tile label="Service" value={lead?.service_type || 'Not set'} />
              <div className="rounded-xl p-3 bg-black/[0.03]"><p className="text-[10px] uppercase tracking-widest font-bold mb-0.5 text-[var(--admin-ink-faint)]">Phone</p><button onClick={() => window.location.href = 'tel:' + lead.phone} className="text-sm font-bold text-[var(--admin-primary)] hover:underline">{formatPhone(lead?.phone)}</button></div>
              <div className="rounded-xl p-3 bg-black/[0.03]"><p className="text-[10px] uppercase tracking-widest font-bold mb-0.5 text-[var(--admin-ink-faint)]">Email</p>{lead?.email ? <button onClick={() => window.location.href = 'mailto:' + lead.email} className="text-sm font-bold text-left break-all text-[var(--admin-primary)] hover:underline">{lead.email}</button> : <p className="text-sm text-[var(--admin-ink-faint)]">None</p>}</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <Field label="City"><input type="text" value={form.city} onChange={(e) => setForm(p => ({ ...p, city: e.target.value }))} placeholder="City" style={{ fontSize: '16px' }} className={inputCls} /></Field>
              <Field label="Address"><input type="text" value={form.address} onChange={(e) => setForm(p => ({ ...p, address: e.target.value }))} placeholder="Property address" style={{ fontSize: '16px' }} className={inputCls} /></Field>
            </div>
            {user?.role === 'admin' && teamUsers.length > 0 && (
              <div className="mt-3"><Field label="Assigned To"><select value={form.assigned_to} onChange={(e) => setForm(p => ({ ...p, assigned_to: e.target.value }))} className={inputCls + ' bg-white'}><option value="">Unassigned</option>{teamUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}</select></Field></div>
            )}
            {lead?.details && <div className="mt-4"><p className="text-[10px] uppercase tracking-widest font-bold mb-1.5 text-[var(--admin-ink-faint)]">What they told us</p><p className="text-sm leading-relaxed rounded-xl p-3 bg-black/[0.03] text-[var(--admin-ink-soft)]">{lead.details}</p></div>}
          </div>

          {/* Scheduling */}
          <div className="rounded-2xl border-2 border-[var(--admin-line)] bg-white p-4 sm:p-6">
            <h3 className="font-extrabold text-sm mb-4 text-[var(--admin-ink)]">Scheduling</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Date"><input type="date" value={form.scheduled_date} onChange={(e) => setForm(p => ({ ...p, scheduled_date: e.target.value }))} className={inputCls} /></Field>
              <Field label="Arrival Window"><select value={form.scheduled_time} onChange={(e) => setForm(p => ({ ...p, scheduled_time: e.target.value }))} className={inputCls + ' bg-white'}><option value="">Select window...</option>{TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}</select></Field>
            </div>
          </div>

          {/* Notes */}
          <div className="rounded-2xl border-2 border-[var(--admin-line)] bg-white p-4 sm:p-6">
            <h3 className="font-extrabold text-sm mb-4 text-[var(--admin-ink)]">Internal Notes</h3>
            <textarea value={form.notes} onChange={(e) => setForm(p => ({ ...p, notes: e.target.value }))} rows={4} placeholder="Add notes..." style={{ fontSize: '16px' }} className={inputCls + ' resize-none'} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-2xl border-2 border-[var(--admin-line)] bg-white p-4 sm:p-6">
            <h3 className="font-extrabold text-sm mb-4 text-[var(--admin-ink)]">Follow-up</h3>
            <Field label="Next Follow-up Date"><input type="date" value={form.next_follow_up} onChange={(e) => setForm(p => ({ ...p, next_follow_up: e.target.value }))} className={inputCls} /></Field>
            {form.next_follow_up && <div className="mt-3 rounded-xl p-3 flex items-center gap-2 bg-amber-50"><svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><p className="text-xs font-semibold text-amber-700">Follow up {new Date(form.next_follow_up + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p></div>}
          </div>
          <div className="rounded-2xl border-2 border-[var(--admin-line)] bg-white p-4 sm:p-6">
            <h3 className="font-extrabold text-sm mb-4 text-[var(--admin-ink)]">Details</h3>
            <div className="space-y-3">
              <Row label="Photos" value={photos.length} />
              <Row label="Source" value={lead?.source || 'website'} />
              <Row label="Lead age" value={Math.floor((Date.now() - new Date(lead?.created_at)) / 864e5) + 'd'} />
            </div>
          </div>
          {hasPermission('delete_leads') && (
            <div className="rounded-2xl border-2 border-red-100 bg-white p-4 sm:p-6">
              <button onClick={handleDelete} disabled={deleting} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 disabled:opacity-50 transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>{deleting ? 'Deleting...' : 'Delete Lead'}</button>
            </div>
          )}
        </div>
      </div>

      {/* Close / lost modal */}
      {showCloseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border-[3px] border-[var(--admin-ink)] bg-white p-6 animate-[fadeUp_0.2s_ease-out]">
            <h3 className="text-lg font-extrabold mb-4 text-[var(--admin-ink)]">Why was this lead lost?</h3>
            <div className="space-y-2 mb-6">
              {CLOSE_REASONS.map(r => (
                <button key={r} onClick={() => setCloseReason(r)} className={'w-full text-left px-4 py-3 rounded-xl border text-sm font-semibold transition-all ' + (closeReason === r ? 'border-red-300 bg-red-50 text-red-700' : 'border-[var(--admin-line)] text-[var(--admin-ink-soft)] hover:bg-black/[0.02]')}>{r}</button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowCloseModal(false); setCloseReason('') }} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold bg-black/[0.05] text-[var(--admin-ink-soft)] hover:bg-black/[0.08]">Cancel</button>
              <button onClick={handleCloseLost} disabled={!closeReason} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 disabled:opacity-40">Mark Lost</button>
            </div>
          </div>
        </div>
      )}

      {/* SMS modal */}
      {showSms && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md max-h-[80vh] overflow-y-auto rounded-3xl border-[3px] border-[var(--admin-ink)] bg-white p-6 animate-[fadeUp_0.2s_ease-out]">
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-extrabold text-[var(--admin-ink)]">Send a Text</h3><button onClick={() => { setShowSms(false); setSmsText('') }} className="text-[var(--admin-ink-faint)] hover:text-[var(--admin-ink-soft)]"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button></div>
            <p className="text-[10px] uppercase tracking-widest font-bold mb-2 text-[var(--admin-ink-faint)]">Quick templates</p>
            <div className="flex flex-wrap gap-1.5 mb-4">{SMS_TEMPLATES.map(t => <button key={t.label} onClick={() => setSmsText(t.text)} className="px-2.5 py-1.5 text-[11px] font-semibold rounded-lg bg-black/[0.05] text-[var(--admin-ink-soft)] hover:bg-black/[0.09] transition-colors">{t.label}</button>)}</div>
            <textarea value={smsText} onChange={(e) => setSmsText(e.target.value)} rows={4} placeholder="Type your message..." style={{ fontSize: '16px' }} className={inputCls + ' resize-none mb-1'} />
            <p className="text-xs mb-4 text-[var(--admin-ink-faint)]">To: {formatPhone(lead?.phone)}</p>
            <button onClick={handleCopySms} disabled={!smsText} className="w-full px-4 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40" style={{ background: 'var(--admin-primary)' }}>Copy and Open Messages</button>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white/80 hover:text-white"><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          { /* eslint-disable-next-line @next/next/no-img-element */ }
          <img src={lightbox} alt="Lead photo" className="max-w-full max-h-full rounded-2xl object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      <style jsx global>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  )
}

const inputCls = 'w-full px-3.5 py-2.5 rounded-xl border-2 border-[var(--admin-line)] text-sm outline-none transition-all focus:border-[var(--admin-primary)]'

function Field({ label, children }) {
  return <div><label className="block text-[10px] uppercase tracking-widest font-bold mb-1.5 text-[var(--admin-ink-faint)]">{label}</label>{children}</div>
}
function Tile({ label, value }) {
  return <div className="rounded-xl p-3 bg-black/[0.03]"><p className="text-[10px] uppercase tracking-widest font-bold mb-0.5 text-[var(--admin-ink-faint)]">{label}</p><p className="text-sm font-bold text-[var(--admin-ink)]">{value}</p></div>
}
function Row({ label, value }) {
  return <div className="flex items-center justify-between"><span className="text-sm text-[var(--admin-ink-faint)]">{label}</span><span className="text-sm font-bold tabular-nums text-[var(--admin-ink)]">{value}</span></div>
}