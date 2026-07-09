'use client'

// app/admin/users/page.jsx
// Team member management. Admin-only (nav gates it via the 'users' perm; the
// server double-checks with verifyAdmin). Create members, set their role and
// per-section permissions, reset passwords, activate/deactivate, or remove.
// You cannot lock yourself out: self deactivate, self demote, and self delete
// are blocked here and on the server.

import { useState, useEffect } from 'react'
import { useAdminAuth } from '../layout'

const PERMISSION_KEYS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'leads', label: 'Leads' },
  { key: 'calendar', label: 'Calendar' },
  { key: 'jobs', label: 'Jobs' },
  { key: 'dumpsters', label: 'Dumpsters' },
  { key: 'sms', label: 'Send texts' },
  { key: 'delete_leads', label: 'Delete leads' },
  { key: 'users', label: 'Manage users' },
]

const EMPTY_USER = { name: '', username: '', phone: '', email: '', password: '', role: 'member', permissions: {} }

export default function UsersPage() {
  const { user } = useAdminAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(null) // user object being edited
  const [form, setForm] = useState(EMPTY_USER)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    try {
      const r = await fetch('/api/admin/users')
      const d = await r.json()
      if (d.users) setUsers(d.users)
    } catch (e) { /* noop */ }
    finally { setLoading(false) }
  }

  const authHeaders = { 'Content-Type': 'application/json', 'x-admin-user-id': user?.id || '' }
  const flash = (m) => { setToast(m); setTimeout(() => setToast(''), 2500) }

  // ---- add
  const openAdd = () => { setForm(EMPTY_USER); setError(''); setShowAdd(true) }
  const addValid = form.name.trim() && form.username.trim() && form.password.length >= 8

  const handleAdd = async () => {
    if (!addValid) { setError('Name, username, and an 8+ character password are required'); return }
    setSaving(true); setError('')
    try {
      const r = await fetch('/api/admin/users', {
        method: 'POST', headers: authHeaders,
        body: JSON.stringify({
          name: form.name.trim(), username: form.username.trim().toLowerCase(),
          phone: form.phone.trim() || null, email: form.email.trim() || null,
          password: form.password, role: form.role,
          permissions: form.role === 'admin' ? {} : form.permissions,
        }),
      })
      const d = await r.json()
      if (!r.ok) { setError(d.error || 'Could not create user'); return }
      setShowAdd(false); flash('User added'); fetchUsers()
    } catch (e) { setError('Could not create user') }
    finally { setSaving(false) }
  }

  // ---- edit
  const openEdit = (u) => {
    setEditing(u)
    setForm({
      name: u.name || '', username: u.username || '', phone: u.phone || '', email: u.email || '',
      password: '', role: u.role || 'member', permissions: u.permissions || {}, is_active: u.is_active,
    })
    setError('')
  }

  const handleUpdate = async () => {
    setSaving(true); setError('')
    try {
      const payload = {
        id: editing.id, name: form.name.trim(),
        phone: form.phone.trim() || null, email: form.email.trim() || null,
        role: form.role, is_active: form.is_active,
        permissions: form.role === 'admin' ? {} : form.permissions,
      }
      if (form.password) payload.password = form.password
      const r = await fetch('/api/admin/users', { method: 'PATCH', headers: authHeaders, body: JSON.stringify(payload) })
      const d = await r.json()
      if (!r.ok) { setError(d.error || 'Could not update user'); return }
      setEditing(null); flash('Saved'); fetchUsers()
    } catch (e) { setError('Could not update user') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!confirm(`Remove ${editing.name}? Their leads stay, just unassigned.`)) return
    setSaving(true); setError('')
    try {
      const r = await fetch('/api/admin/users', { method: 'DELETE', headers: authHeaders, body: JSON.stringify({ id: editing.id }) })
      const d = await r.json()
      if (!r.ok) { setError(d.error || 'Could not remove user'); return }
      setEditing(null); flash('User removed'); fetchUsers()
    } catch (e) { setError('Could not remove user') }
    finally { setSaving(false) }
  }

  const togglePerm = (key) => setForm(p => ({ ...p, permissions: { ...p.permissions, [key]: !p.permissions[key] } }))

  const fmtLogin = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Never'

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-10 h-10 rounded-full animate-spin" style={{ border: '4px solid var(--admin-primary)', borderTopColor: 'transparent' }} />
    </div>
  )

  return (
    <div className="px-4 py-5 sm:py-8">
      <div className="mb-6 flex items-center justify-between animate-[fadeUp_0.3s_ease-out]">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--admin-ink)]">Users</h2>
          <p className="text-sm mt-0.5 text-[var(--admin-ink-faint)]">{users.length} team member{users.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.97]" style={{ background: 'var(--admin-primary)' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>Add
        </button>
      </div>

      {toast && <div className="mb-4 rounded-xl p-3 text-sm bg-green-50 border border-green-200 text-green-700 flex items-center gap-2 animate-[fadeUp_0.2s_ease-out]"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>{toast}</div>}

      <div className="rounded-2xl border-2 border-[var(--admin-line)] bg-white overflow-hidden animate-[fadeUp_0.4s_ease-out]">
        {/* desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/[0.02]">
              <tr>{['Member', 'Role', 'Status', 'Last login', ''].map((h, i) => <th key={i} className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[var(--admin-ink-faint)]">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-[var(--admin-line)]">
              {users.map(u => (
                <tr key={u.id} className="group hover:bg-black/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--admin-primary)' }}><span className="text-white font-bold text-xs">{u.name?.charAt(0)?.toUpperCase()}</span></div>
                      <div>
                        <p className="font-bold text-sm text-[var(--admin-ink)]">{u.name}{u.id === user?.id && <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[var(--admin-primary-soft)] text-[var(--admin-primary)]">You</span>}</p>
                        <p className="text-xs text-[var(--admin-ink-faint)]">@{u.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><RoleBadge role={u.role} /></td>
                  <td className="px-6 py-4"><StatusBadge active={u.is_active} /></td>
                  <td className="px-6 py-4 text-sm text-[var(--admin-ink-faint)]">{fmtLogin(u.last_login)}</td>
                  <td className="px-6 py-4"><button onClick={() => openEdit(u)} className="text-sm font-bold text-[var(--admin-primary)] opacity-0 group-hover:opacity-100 transition-opacity">Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* mobile */}
        <div className="md:hidden divide-y divide-[var(--admin-line)]">
          {users.map(u => (
            <button key={u.id} onClick={() => openEdit(u)} className="w-full text-left p-4 active:bg-black/[0.03] transition-colors flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--admin-primary)' }}><span className="text-white font-bold text-sm">{u.name?.charAt(0)?.toUpperCase()}</span></div>
              <div className="min-w-0 flex-1">
                <p className="font-bold truncate text-[var(--admin-ink)]">{u.name}{u.id === user?.id && <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[var(--admin-primary-soft)] text-[var(--admin-primary)]">You</span>}</p>
                <p className="text-xs text-[var(--admin-ink-faint)]">@{u.username}</p>
              </div>
              <div className="flex flex-col items-end gap-1"><RoleBadge role={u.role} /><StatusBadge active={u.is_active} /></div>
            </button>
          ))}
        </div>
      </div>

      {(showAdd || editing) && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm" onClick={() => { setShowAdd(false); setEditing(null) }}>
          <div className="w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border-[3px] border-[var(--admin-ink)] bg-white animate-[fadeUp_0.2s_ease-out]" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 sm:p-5 border-b border-[var(--admin-line)]">
              <div className="w-8 h-1 rounded-full mx-auto mb-3 sm:hidden bg-[var(--admin-line)]" />
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-[var(--admin-ink)]">{editing ? 'Edit User' : 'Add User'}</h3>
                <button onClick={() => { setShowAdd(false); setEditing(null) }} className="p-1 text-[var(--admin-ink-faint)] hover:text-[var(--admin-ink-soft)]"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
            </div>

            <div className="p-4 sm:p-5 space-y-3">
              {error && <div className="rounded-xl p-3 text-sm bg-red-50 border border-red-200 text-red-700">{error}</div>}
              <Field label="Name *"><input type="text" value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Full name" autoFocus style={{ fontSize: '16px' }} className={inputCls} /></Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Username *">
                  <input type="text" value={form.username} disabled={!!editing} onChange={(e) => setForm(p => ({ ...p, username: e.target.value }))} placeholder="username" autoCapitalize="none" style={{ fontSize: '16px' }} className={inputCls + (editing ? ' opacity-60' : '')} />
                </Field>
                <Field label={editing ? 'Reset password' : 'Password *'}>
                  <input type="password" value={form.password} onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))} placeholder={editing ? 'Leave blank to keep' : 'At least 8 characters'} autoComplete="new-password" style={{ fontSize: '16px' }} className={inputCls} />
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Phone"><input type="tel" value={form.phone} onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="Optional" style={{ fontSize: '16px' }} className={inputCls} /></Field>
                <Field label="Email"><input type="email" value={form.email} onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))} placeholder="Optional" style={{ fontSize: '16px' }} className={inputCls} /></Field>
              </div>

              <Field label="Role">
                <div className="grid grid-cols-2 gap-2">
                  {['member', 'admin'].map(r => {
                    const isSelfAdmin = editing && editing.id === user?.id
                    const disabled = isSelfAdmin && r === 'member'
                    return (
                      <button key={r} type="button" disabled={disabled} onClick={() => setForm(p => ({ ...p, role: r }))}
                        className={'px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all capitalize disabled:opacity-40 ' + (form.role === r ? 'text-white border-transparent' : 'bg-white text-[var(--admin-ink-soft)] border-[var(--admin-line)] hover:border-[var(--admin-ink)]')}
                        style={form.role === r ? { background: 'var(--admin-primary)' } : undefined}>{r}</button>
                    )
                  })}
                </div>
              </Field>

              {form.role === 'admin' ? (
                <div className="rounded-xl p-3 bg-[var(--admin-primary-soft)] text-sm font-semibold text-[var(--admin-primary)]">Admins have full access to everything.</div>
              ) : (
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold mb-2 text-[var(--admin-ink-faint)]">Permissions</p>
                  <div className="grid grid-cols-2 gap-2">
                    {PERMISSION_KEYS.map(pk => {
                      const on = !!form.permissions[pk.key]
                      return (
                        <button key={pk.key} type="button" onClick={() => togglePerm(pk.key)}
                          className={'flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ' + (on ? 'border-[var(--admin-primary)] bg-[var(--admin-primary-soft)] text-[var(--admin-primary)]' : 'border-[var(--admin-line)] text-[var(--admin-ink-faint)] hover:border-[var(--admin-ink)]')}>
                          <span className={'w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ' + (on ? 'text-white' : 'border-2 border-[var(--admin-line)]')} style={on ? { background: 'var(--admin-primary)' } : undefined}>
                            {on && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                          </span>
                          {pk.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {editing && (
                <Field label="Account status">
                  <button type="button" onClick={() => setForm(p => ({ ...p, is_active: !p.is_active }))} disabled={editing.id === user?.id}
                    className={'w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all disabled:opacity-50 ' + (form.is_active ? 'border-[var(--admin-line)]' : 'border-red-200 bg-red-50')}>
                    <span className={'text-sm font-bold ' + (form.is_active ? 'text-[var(--admin-ink)]' : 'text-red-600')}>{form.is_active ? 'Active' : 'Deactivated'}</span>
                    <span className={'relative w-10 h-6 rounded-full transition-colors ' + (form.is_active ? '' : 'bg-red-300')} style={form.is_active ? { background: 'var(--admin-primary)' } : undefined}>
                      <span className={'absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ' + (form.is_active ? 'left-[18px]' : 'left-0.5')} />
                    </span>
                  </button>
                  {editing.id === user?.id && <p className="mt-1.5 text-xs text-[var(--admin-ink-faint)]">You cannot deactivate your own account.</p>}
                </Field>
              )}
            </div>

            <div className="p-4 sm:p-5 border-t border-[var(--admin-line)] flex items-center gap-3">
              {editing && editing.id !== user?.id && (
                <button onClick={handleDelete} disabled={saving} className="px-4 py-3 rounded-xl font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50">Remove</button>
              )}
              <button onClick={() => { setShowAdd(false); setEditing(null) }} className="flex-1 py-3 rounded-xl font-bold bg-black/[0.05] text-[var(--admin-ink-soft)] hover:bg-black/[0.08] transition-colors">Cancel</button>
              <button onClick={editing ? handleUpdate : handleAdd} disabled={saving || (!editing && !addValid)} className="flex-1 py-3 rounded-xl font-bold text-white transition-all disabled:opacity-40" style={{ background: 'var(--admin-primary)' }}>{saving ? 'Saving...' : editing ? 'Save' : 'Add User'}</button>
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
  return <div><label className="block text-[10px] uppercase tracking-widest font-bold mb-1 text-[var(--admin-ink-faint)]">{label}</label>{children}</div>
}
function RoleBadge({ role }) {
  const admin = role === 'admin'
  return <span className={'inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold ' + (admin ? 'bg-[var(--admin-primary-soft)] text-[var(--admin-primary)]' : 'bg-black/[0.05] text-[var(--admin-ink-soft)]')}>{admin ? 'Admin' : 'Member'}</span>
}
function StatusBadge({ active }) {
  return <span className={'inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold ' + (active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600')}>{active ? 'Active' : 'Inactive'}</span>
}