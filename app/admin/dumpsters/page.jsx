'use client'

// app/admin/dumpsters/page.jsx
// Dumpster tracking. Two views: Rentals (what's out, where, and when it comes
// back) and Fleet (every box and its status). Marking a rental delivered or
// picked up flips the box status automatically, so you never double-book a box
// that's already on someone's driveway. Org-scoped through the session.

import { useState, useEffect } from 'react'

const ymd = (d) => { const n = new Date(d); return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}` }
const todayStr = () => ymd(new Date())
const fmtMoney = (n) => (n === null || n === undefined || n === '') ? null : '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 })
const fmtDate = (d) => d ? new Date(d.slice(0, 10) + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null

const RENTAL_BADGE = { scheduled: 'bg-blue-100 text-blue-700', delivered: 'bg-amber-100 text-amber-700', picked_up: 'bg-gray-100 text-gray-600', cancelled: 'bg-red-100 text-red-600' }
const RENTAL_LABEL = { scheduled: 'Scheduled', delivered: 'Out', picked_up: 'Picked up', cancelled: 'Cancelled' }
const BOX_BADGE = { available: 'bg-green-100 text-green-700', out: 'bg-amber-100 text-amber-700', maintenance: 'bg-gray-100 text-gray-600' }

const EMPTY_RENTAL = { customer_name: '', phone: '', address: '', size: '', dumpster_id: '', dropoff_date: '', pickup_date: '', price: '' }
const EMPTY_BOX = { label: '', size: '', status: 'available', notes: '' }

export default function DumpstersPage() {
  const [boxes, setBoxes] = useState([])
  const [rentals, setRentals] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('rentals')
  const [showPast, setShowPast] = useState(false)
  const [rentalModal, setRentalModal] = useState(null) // EMPTY_RENTAL or existing
  const [boxModal, setBoxModal] = useState(null)
  const [saving, setSaving] = useState(false)
  const [busy, setBusy] = useState(null)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  useEffect(() => { fetchAll() }, [])
  const fetchAll = async () => {
    try {
      const [rb, rr] = await Promise.all([fetch('/api/admin/dumpsters'), fetch('/api/admin/dumpsters/rentals')])
      const [db, dr] = await Promise.all([rb.json(), rr.json()])
      if (db.dumpsters) setBoxes(db.dumpsters)
      if (dr.rentals) setRentals(dr.rentals)
    } catch (e) { /* noop */ } finally { setLoading(false) }
  }

  const H = { 'Content-Type': 'application/json' }
  const flash = (m) => { setToast(m); setTimeout(() => setToast(''), 2500) }
  const today = todayStr()

  const available = boxes.filter(b => b.status === 'available')
  const stats = {
    available: available.length,
    out: boxes.filter(b => b.status === 'out').length,
    dueBack: rentals.filter(r => r.status === 'delivered' && r.pickup_date && r.pickup_date.slice(0, 10) <= today).length,
    total: boxes.length,
  }

  const activeRentals = rentals.filter(r => ['scheduled', 'delivered'].includes(r.status))
  const pastRentals = rentals.filter(r => ['picked_up', 'cancelled'].includes(r.status))
  const shownRentals = (showPast ? pastRentals : activeRentals).sort((a, b) => {
    const ak = a.status === 'delivered' ? a.pickup_date : a.dropoff_date
    const bk = b.status === 'delivered' ? b.pickup_date : b.dropoff_date
    return (ak || '').localeCompare(bk || '')
  })

  // ---- rental actions
  const setRentalStatus = async (r, status) => {
    setBusy(r.id)
    try { await fetch('/api/admin/dumpsters/rentals', { method: 'PATCH', headers: H, body: JSON.stringify({ id: r.id, status }) }); await fetchAll(); flash(status === 'delivered' ? 'Marked delivered' : status === 'picked_up' ? 'Picked up' : 'Updated') }
    catch (e) { /* noop */ } finally { setBusy(null) }
  }

  const saveRental = async () => {
    if (!rentalModal.customer_name.trim()) { setError('Customer name is required'); return }
    setSaving(true); setError('')
    try {
      const editing = !!rentalModal.id
      const r = await fetch('/api/admin/dumpsters/rentals', { method: editing ? 'PATCH' : 'POST', headers: H, body: JSON.stringify(rentalModal) })
      if (!r.ok) { const d = await r.json(); setError(d.error || 'Could not save'); return }
      setRentalModal(null); flash(editing ? 'Saved' : 'Rental booked'); fetchAll()
    } catch (e) { setError('Could not save') } finally { setSaving(false) }
  }

  // ---- box actions
  const saveBox = async () => {
    if (!boxModal.label.trim()) { setError('A label is required'); return }
    setSaving(true); setError('')
    try {
      const editing = !!boxModal.id
      const r = await fetch('/api/admin/dumpsters', { method: editing ? 'PATCH' : 'POST', headers: H, body: JSON.stringify(boxModal) })
      if (!r.ok) { const d = await r.json(); setError(d.error || 'Could not save'); return }
      setBoxModal(null); flash(editing ? 'Saved' : 'Box added'); fetchAll()
    } catch (e) { setError('Could not save') } finally { setSaving(false) }
  }
  const deleteBox = async (box) => {
    if (!confirm(`Remove ${box.label} from the fleet?`)) return
    try { const r = await fetch('/api/admin/dumpsters', { method: 'DELETE', headers: H, body: JSON.stringify({ id: box.id }) }); if (r.ok) { flash('Box removed'); fetchAll() } else { const d = await r.json(); setError(d.error || 'Could not remove') } }
    catch (e) { /* noop */ }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-10 h-10 rounded-full animate-spin" style={{ border: '4px solid var(--admin-primary)', borderTopColor: 'transparent' }} />
    </div>
  )

  return (
    <div className="px-4 py-5 sm:py-8">
      <div className="mb-5 flex items-center justify-between animate-[fadeUp_0.3s_ease-out]">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--admin-ink)]">Dumpsters</h2>
          <p className="text-sm mt-0.5 text-[var(--admin-ink-faint)]">Rentals and fleet</p>
        </div>
        <button onClick={() => { setError(''); tab === 'fleet' ? setBoxModal({ ...EMPTY_BOX }) : setRentalModal({ ...EMPTY_RENTAL }) }} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.97]" style={{ background: 'var(--admin-primary)' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>{tab === 'fleet' ? 'Add box' : 'New rental'}
        </button>
      </div>

      {toast && <div className="mb-4 rounded-xl p-3 text-sm bg-green-50 border border-green-200 text-green-700 flex items-center gap-2 animate-[fadeUp_0.2s_ease-out]"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>{toast}</div>}
      {error && !rentalModal && !boxModal && <div className="mb-4 rounded-xl p-3 text-sm bg-red-50 border border-red-200 text-red-700">{error}</div>}

      <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3 animate-[fadeUp_0.35s_ease-out]">
        <Stat label="Available" value={stats.available} bar="bg-green-400" />
        <Stat label="Out" value={stats.out} bar="bg-amber-400" />
        <Stat label="Due back" value={stats.dueBack} bar="bg-red-400" />
        <Stat label="Total boxes" value={stats.total} bar="bg-blue-400" />
      </div>

      <div className="mb-4 flex items-center justify-between animate-[fadeUp_0.4s_ease-out]">
        <div className="flex gap-2">
          {[{ k: 'rentals', l: 'Rentals' }, { k: 'fleet', l: 'Fleet' }].map(t => (
            <button key={t.k} onClick={() => setTab(t.k)} className={'px-4 py-2 rounded-full text-sm font-semibold transition-all ' + (tab === t.k ? 'text-white' : 'bg-white border-2 border-[var(--admin-line)] text-[var(--admin-ink-soft)] hover:border-[var(--admin-ink)]')} style={tab === t.k ? { background: 'var(--admin-primary)' } : undefined}>
              {t.l}<span className={'ml-1.5 ' + (tab === t.k ? 'text-white/60' : 'text-[var(--admin-ink-faint)]')}>{t.k === 'rentals' ? activeRentals.length : boxes.length}</span>
            </button>
          ))}
        </div>
        {tab === 'rentals' && <button onClick={() => setShowPast(s => !s)} className="text-xs font-bold text-[var(--admin-primary)] hover:underline">{showPast ? 'Show active' : 'Show past'}</button>}
      </div>

      {tab === 'rentals' ? (
        shownRentals.length === 0 ? (
          <Empty text={showPast ? 'No past rentals.' : 'No active rentals. Book one with New rental.'} />
        ) : (
          <div className="space-y-3 animate-[fadeUp_0.45s_ease-out]">
            {shownRentals.map(r => {
              const dueBack = r.status === 'delivered' && r.pickup_date && r.pickup_date.slice(0, 10) <= today
              const boxLabel = r.dumpster?.label
              return (
                <div key={r.id} className="rounded-2xl border-2 border-[var(--admin-line)] bg-white overflow-hidden">
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-[var(--admin-ink)]">{r.customer_name}</p>
                          <span className={'text-[10px] font-bold px-1.5 py-0.5 rounded-md ' + (RENTAL_BADGE[r.status] || '')}>{RENTAL_LABEL[r.status]}</span>
                          {dueBack && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-red-100 text-red-600">Due back</span>}
                        </div>
                        <p className="text-sm mt-0.5 text-[var(--admin-ink-faint)]">{boxLabel ? boxLabel + (r.size ? ' · ' + r.size + ' yd' : '') : (r.size ? r.size + ' yd' : 'No box assigned')}</p>
                      </div>
                      {fmtMoney(r.price) && <p className="font-extrabold text-[var(--admin-ink)] flex-shrink-0">{fmtMoney(r.price)}</p>}
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--admin-ink-faint)]">
                      {r.address && <Meta icon="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" text={r.address} />}
                      {(r.dropoff_date || r.pickup_date) && <Meta icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" text={(fmtDate(r.dropoff_date) || '?') + ' → ' + (fmtDate(r.pickup_date) || '?')} />}
                      {r.phone && <Meta icon="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" text={r.phone} link={'tel:' + r.phone} />}
                    </div>
                  </div>
                  {['scheduled', 'delivered'].includes(r.status) && (
                    <div className="flex border-t border-[var(--admin-line)]">
                      <button onClick={() => { setError(''); setRentalModal(r) }} className="flex-1 py-3 text-center text-sm font-bold text-[var(--admin-ink-soft)] hover:bg-black/[0.02] transition-colors">Edit</button>
                      {r.status === 'scheduled' ? (
                        <button onClick={() => setRentalStatus(r, 'delivered')} disabled={busy === r.id} className="flex-1 py-3 text-center text-sm font-bold border-l border-[var(--admin-line)] text-white transition-all disabled:opacity-50" style={{ background: 'var(--admin-primary)' }}>{busy === r.id ? '...' : 'Mark delivered'}</button>
                      ) : (
                        <button onClick={() => setRentalStatus(r, 'picked_up')} disabled={busy === r.id} className="flex-1 py-3 text-center text-sm font-bold border-l border-[var(--admin-line)] text-white transition-all disabled:opacity-50" style={{ background: 'var(--admin-primary)' }}>{busy === r.id ? '...' : 'Mark picked up'}</button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )
      ) : (
        boxes.length === 0 ? (
          <Empty text="No boxes yet. Add your first with Add box." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 animate-[fadeUp_0.45s_ease-out]">
            {boxes.map(box => (
              <div key={box.id} className="rounded-2xl border-2 border-[var(--admin-line)] bg-white p-4 flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl flex-shrink-0" style={{ background: 'var(--admin-primary-soft)' }}>
                  <svg className="w-5 h-5" style={{ color: 'var(--admin-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M4 7h16l-1.5 12.5a1 1 0 01-1 .5H6.5a1 1 0 01-1-.5L4 7zm2-3h12l1 3H5l1-3z" /></svg>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2"><p className="font-bold text-[var(--admin-ink)] truncate">{box.label}</p><span className={'text-[10px] font-bold px-1.5 py-0.5 rounded-md ' + (BOX_BADGE[box.status] || '')}>{box.status}</span></div>
                  <p className="text-xs text-[var(--admin-ink-faint)]">{box.size ? box.size + ' yard' : 'Size not set'}</p>
                </div>
                <button onClick={() => { setError(''); setBoxModal(box) }} className="p-2 rounded-lg text-[var(--admin-ink-faint)] hover:text-[var(--admin-primary)] hover:bg-black/[0.03] transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
              </div>
            ))}
          </div>
        )
      )}

      {/* Rental modal */}
      {rentalModal && (
        <Modal title={rentalModal.id ? 'Edit rental' : 'New rental'} onClose={() => setRentalModal(null)}>
          <div className="p-4 sm:p-5 space-y-3">
            {error && <div className="rounded-xl p-3 text-sm bg-red-50 border border-red-200 text-red-700">{error}</div>}
            <F label="Customer name *"><input value={rentalModal.customer_name} onChange={(e) => setRentalModal(p => ({ ...p, customer_name: e.target.value }))} autoFocus style={{ fontSize: '16px' }} className={inp} /></F>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <F label="Phone"><input type="tel" value={rentalModal.phone || ''} onChange={(e) => setRentalModal(p => ({ ...p, phone: e.target.value }))} style={{ fontSize: '16px' }} className={inp} /></F>
              <F label="Price"><input type="number" inputMode="decimal" value={rentalModal.price ?? ''} onChange={(e) => setRentalModal(p => ({ ...p, price: e.target.value }))} placeholder="0" style={{ fontSize: '16px' }} className={inp} /></F>
            </div>
            <F label="Address"><input value={rentalModal.address || ''} onChange={(e) => setRentalModal(p => ({ ...p, address: e.target.value }))} style={{ fontSize: '16px' }} className={inp} /></F>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <F label="Box"><select value={rentalModal.dumpster_id || ''} onChange={(e) => { const id = e.target.value; const box = boxes.find(b => b.id === id); setRentalModal(p => ({ ...p, dumpster_id: id, size: box?.size || p.size })) }} className={inp + ' bg-white'}>
                <option value="">No box / assign later</option>
                {boxes.filter(b => b.status === 'available' || b.id === rentalModal.dumpster_id).map(b => <option key={b.id} value={b.id}>{b.label}{b.size ? ` (${b.size} yd)` : ''}</option>)}
              </select></F>
              <F label="Size (yd)"><input value={rentalModal.size || ''} onChange={(e) => setRentalModal(p => ({ ...p, size: e.target.value }))} placeholder="20" style={{ fontSize: '16px' }} className={inp} /></F>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <F label="Drop-off"><input type="date" value={rentalModal.dropoff_date || ''} onChange={(e) => setRentalModal(p => ({ ...p, dropoff_date: e.target.value }))} className={inp} /></F>
              <F label="Pickup"><input type="date" value={rentalModal.pickup_date || ''} onChange={(e) => setRentalModal(p => ({ ...p, pickup_date: e.target.value }))} className={inp} /></F>
            </div>
          </div>
          <ModalFooter onCancel={() => setRentalModal(null)} onSave={saveRental} saving={saving} label={rentalModal.id ? 'Save' : 'Book rental'} />
        </Modal>
      )}

      {/* Box modal */}
      {boxModal && (
        <Modal title={boxModal.id ? 'Edit box' : 'Add box'} onClose={() => setBoxModal(null)}>
          <div className="p-4 sm:p-5 space-y-3">
            {error && <div className="rounded-xl p-3 text-sm bg-red-50 border border-red-200 text-red-700">{error}</div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <F label="Label *"><input value={boxModal.label} onChange={(e) => setBoxModal(p => ({ ...p, label: e.target.value }))} placeholder="Box A" autoFocus style={{ fontSize: '16px' }} className={inp} /></F>
              <F label="Size (yd)"><input value={boxModal.size || ''} onChange={(e) => setBoxModal(p => ({ ...p, size: e.target.value }))} placeholder="20" style={{ fontSize: '16px' }} className={inp} /></F>
            </div>
            <F label="Status">
              <div className="grid grid-cols-3 gap-2">
                {['available', 'out', 'maintenance'].map(s => (
                  <button key={s} type="button" onClick={() => setBoxModal(p => ({ ...p, status: s }))} className={'py-2.5 rounded-xl text-xs font-bold border-2 capitalize transition-all ' + (boxModal.status === s ? 'text-white border-transparent' : 'bg-white text-[var(--admin-ink-soft)] border-[var(--admin-line)] hover:border-[var(--admin-ink)]')} style={boxModal.status === s ? { background: 'var(--admin-primary)' } : undefined}>{s}</button>
                ))}
              </div>
            </F>
            <F label="Notes"><input value={boxModal.notes || ''} onChange={(e) => setBoxModal(p => ({ ...p, notes: e.target.value }))} placeholder="Optional" style={{ fontSize: '16px' }} className={inp} /></F>
          </div>
          <div className="p-4 sm:p-5 border-t border-[var(--admin-line)] flex items-center gap-3">
            {boxModal.id && <button onClick={() => deleteBox(boxModal)} className="px-4 py-3 rounded-xl font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors">Remove</button>}
            <button onClick={() => setBoxModal(null)} className="flex-1 py-3 rounded-xl font-bold bg-black/[0.05] text-[var(--admin-ink-soft)] hover:bg-black/[0.08] transition-colors">Cancel</button>
            <button onClick={saveBox} disabled={saving} className="flex-1 py-3 rounded-xl font-bold text-white transition-all disabled:opacity-40" style={{ background: 'var(--admin-primary)' }}>{saving ? 'Saving...' : boxModal.id ? 'Save' : 'Add box'}</button>
          </div>
        </Modal>
      )}

      <style jsx global>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  )
}

const inp = 'w-full px-3.5 py-2.5 rounded-xl border-2 border-[var(--admin-line)] text-sm outline-none transition-all focus:border-[var(--admin-primary)]'
function F({ label, children }) { return <div><label className="block text-[10px] uppercase tracking-widest font-bold mb-1 text-[var(--admin-ink-faint)]">{label}</label>{children}</div> }
function Stat({ label, value, bar }) {
  return <div className="relative overflow-hidden rounded-2xl border-2 border-[var(--admin-line)] bg-white p-3.5"><div className={'absolute top-0 left-0 w-1 h-full ' + bar} /><p className="ml-2 text-[10px] uppercase tracking-widest font-bold text-[var(--admin-ink-faint)]">{label}</p><p className="ml-2 mt-0.5 text-2xl font-extrabold tabular-nums text-[var(--admin-ink)]">{value}</p></div>
}
function Empty({ text }) { return <div className="rounded-2xl border-2 border-dashed border-[var(--admin-line)] p-10 text-center animate-[fadeUp_0.45s_ease-out]"><p className="text-sm text-[var(--admin-ink-faint)]">{text}</p></div> }
function Meta({ icon, text, link }) {
  const inner = <span className="inline-flex items-center gap-1"><svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d={icon} /></svg>{text}</span>
  return link ? <a href={link} className="hover:text-[var(--admin-primary)] transition-colors">{inner}</a> : inner
}
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border-[3px] border-[var(--admin-ink)] bg-white animate-[fadeUp_0.2s_ease-out]" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 sm:p-5 border-b border-[var(--admin-line)]">
          <div className="w-8 h-1 rounded-full mx-auto mb-3 sm:hidden bg-[var(--admin-line)]" />
          <div className="flex items-center justify-between"><h3 className="text-lg font-extrabold text-[var(--admin-ink)]">{title}</h3><button onClick={onClose} className="p-1 text-[var(--admin-ink-faint)] hover:text-[var(--admin-ink-soft)]"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button></div>
        </div>
        {children}
      </div>
    </div>
  )
}
function ModalFooter({ onCancel, onSave, saving, label }) {
  return (
    <div className="p-4 sm:p-5 border-t border-[var(--admin-line)] flex items-center gap-3">
      <button onClick={onCancel} className="flex-1 py-3 rounded-xl font-bold bg-black/[0.05] text-[var(--admin-ink-soft)] hover:bg-black/[0.08] transition-colors">Cancel</button>
      <button onClick={onSave} disabled={saving} className="flex-1 py-3 rounded-xl font-bold text-white transition-all disabled:opacity-40" style={{ background: 'var(--admin-primary)' }}>{saving ? 'Saving...' : label}</button>
    </div>
  )
}