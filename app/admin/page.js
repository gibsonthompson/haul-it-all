'use client'

// app/admin/page.js
// Haul It All dashboard. Leads only (no crew, timesheets, prospects, or jobs
// yet). Built around the two things that make hauling money: answering new
// leads fast, and not letting scheduled work slip.

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAdminAuth } from './layout'
import { STAGE_BY_KEY } from '@/lib/pipeline'

export default function DashboardPage() {
  const { user } = useAdminAuth()
  const [loading, setLoading] = useState(true)
  const [leads, setLeads] = useState([])

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

  const today = new Date().toISOString().split('T')[0]
  const weekEnd = (() => { const d = new Date(); d.setDate(d.getDate() + 7); return d.toISOString().split('T')[0] })()

  const newLeads = leads.filter(l => l.status === 'new')
  const coldLeads = newLeads.filter(l => (Date.now() - new Date(l.created_at)) / 36e5 > 1)
  const scheduledToday = leads.filter(l => l.scheduled_date === today && !['completed', 'lost'].includes(l.status))
  const scheduledWeek = leads.filter(l => l.scheduled_date && l.scheduled_date >= today && l.scheduled_date <= weekEnd && !['completed', 'lost'].includes(l.status))
  const followUps = leads.filter(l => l.next_follow_up && l.next_follow_up <= today && !['completed', 'lost'].includes(l.status))
  const recent = leads.slice(0, 8)

  // Action items, highest urgency first.
  const items = []
  if (coldLeads.length > 0) items.push({
    key: 'cold', href: '/admin/leads',
    label: `${coldLeads.length} lead${coldLeads.length > 1 ? 's' : ''} waiting over an hour`,
    count: coldLeads.length, bg: 'bg-red-50', text: 'text-red-600',
    icon: 'M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  })
  else if (newLeads.length > 0) items.push({
    key: 'new', href: '/admin/leads',
    label: `${newLeads.length} new lead${newLeads.length > 1 ? 's' : ''} to call`,
    count: newLeads.length, bg: 'bg-blue-50', text: 'text-blue-600',
    icon: 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4',
  })
  if (scheduledToday.length > 0) items.push({
    key: 'today', href: '/admin/leads',
    label: `${scheduledToday.length} job${scheduledToday.length > 1 ? 's' : ''} scheduled today`,
    count: scheduledToday.length, bg: 'bg-emerald-50', text: 'text-emerald-600',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  })
  if (followUps.length > 0) items.push({
    key: 'followup', href: '/admin/leads',
    label: `${followUps.length} follow-up${followUps.length > 1 ? 's' : ''} due`,
    count: followUps.length, bg: 'bg-amber-50', text: 'text-amber-600',
    icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
  })

  const formatPhone = (p) => { if (!p) return ''; const c = p.replace(/\D/g, ''); if (c.length === 10) return '(' + c.slice(0,3) + ') ' + c.slice(3,6) + '-' + c.slice(6); return p }
  const timeAgo = (d) => { const s = Math.floor((Date.now() - new Date(d)) / 1000); if (s < 60) return 'just now'; if (s < 3600) return Math.floor(s/60) + 'm'; if (s < 86400) return Math.floor(s/3600) + 'h'; return Math.floor(s/86400) + 'd' }
  const badge = (status) => STAGE_BY_KEY[status]?.badge || 'bg-gray-100 text-gray-600'
  const label = (status) => STAGE_BY_KEY[status]?.label || status

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-10 h-10 rounded-full animate-spin" style={{ border: '4px solid var(--admin-primary)', borderTopColor: 'transparent' }} />
    </div>
  )

  return (
    <div className="px-4 py-5 sm:py-8">
      <div className="mb-6 flex items-start justify-between gap-3 animate-[fadeUp_0.3s_ease-out]">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--admin-ink)]">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0]}
          </h2>
          <p className="text-sm mt-0.5 text-[var(--admin-ink-faint)]">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link href="/admin/leads" className="flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.97]" style={{ background: 'var(--admin-primary)' }}>
          View leads
        </Link>
      </div>

      {items.length > 0 && (
        <div className="mb-6 space-y-2 animate-[fadeUp_0.35s_ease-out]">
          {items.map((item, i) => (
            <Link key={item.key} href={item.href}
              className="group flex items-center gap-3 rounded-2xl border-2 border-[var(--admin-line)] bg-white px-4 py-3 transition-all hover:border-[var(--admin-ink)] active:scale-[0.995]"
              style={{ animationDelay: `${i * 60}ms` }}>
              <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                <svg className={`w-5 h-5 ${item.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={item.icon} /></svg>
              </div>
              <p className="flex-1 min-w-0 text-sm font-bold text-[var(--admin-ink)]">{item.label}</p>
              <span className={`text-lg font-extrabold tabular-nums ${item.text}`}>{item.count}</span>
              <svg className="w-4 h-4 text-[var(--admin-ink-faint)] group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          ))}
        </div>
      )}

      <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
        {/* Recent leads */}
        <div className="rounded-2xl border-2 border-[var(--admin-line)] bg-white overflow-hidden animate-[fadeUp_0.45s_ease-out]">
          <div className="px-4 py-3.5 border-b border-[var(--admin-line)] flex items-center justify-between">
            <h3 className="font-extrabold text-sm tracking-tight text-[var(--admin-ink)]">Recent Leads</h3>
            <Link href="/admin/leads" className="text-xs font-bold text-[var(--admin-primary)] hover:underline">{leads.length} total</Link>
          </div>
          {recent.length === 0 ? (
            <div className="p-8 text-center"><p className="text-sm text-[var(--admin-ink-faint)]">No leads yet</p></div>
          ) : (
            <div className="divide-y divide-[var(--admin-line)]">
              {recent.map(l => (
                <Link key={l.id} href={'/admin/leads/' + l.id} className="px-4 py-3 flex items-center justify-between hover:bg-black/[0.02] transition-colors group">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold truncate text-[var(--admin-ink)] group-hover:text-[var(--admin-primary)] transition-colors">{l.name}</p>
                      <span className={'text-[9px] font-bold px-1.5 py-0.5 rounded-md ' + badge(l.status)}>{label(l.status)}</span>
                    </div>
                    <p className="text-xs mt-0.5 truncate text-[var(--admin-ink-faint)]">{l.service_type || 'No service set'}{formatPhone(l.phone) ? ' · ' + formatPhone(l.phone) : ''}</p>
                  </div>
                  <span className="text-[10px] flex-shrink-0 ml-3 tabular-nums text-[var(--admin-ink-faint)]">{timeAgo(l.created_at)}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming this week */}
        <div className="rounded-2xl border-2 border-[var(--admin-line)] bg-white overflow-hidden animate-[fadeUp_0.5s_ease-out]">
          <div className="px-4 py-3.5 border-b border-[var(--admin-line)] flex items-center justify-between">
            <h3 className="font-extrabold text-sm tracking-tight text-[var(--admin-ink)]">Scheduled This Week</h3>
            <Link href="/admin/calendar" className="text-xs font-bold text-[var(--admin-primary)] hover:underline">Calendar</Link>
          </div>
          {scheduledWeek.length === 0 ? (
            <div className="p-8 text-center"><p className="text-sm text-[var(--admin-ink-faint)]">Nothing scheduled</p></div>
          ) : (
            <div className="divide-y divide-[var(--admin-line)]">
              {scheduledWeek.sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date)).slice(0, 8).map(l => {
                const d = new Date(l.scheduled_date + 'T00:00:00')
                const isToday = l.scheduled_date === today
                return (
                  <Link key={l.id} href={'/admin/leads/' + l.id} className="px-4 py-3 flex items-center gap-3 hover:bg-black/[0.02] transition-colors group">
                    <div className={'w-10 h-10 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ' + (isToday ? 'text-white' : 'bg-black/[0.04] text-[var(--admin-ink-soft)]')} style={isToday ? { background: 'var(--admin-primary)' } : undefined}>
                      <span className="text-[9px] font-bold uppercase leading-none">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                      <span className="text-base font-extrabold leading-none">{d.getDate()}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold truncate text-[var(--admin-ink)] group-hover:text-[var(--admin-primary)] transition-colors">{l.name}</p>
                      <p className="text-xs truncate text-[var(--admin-ink-faint)]">{l.service_type || ''}{l.scheduled_time ? ' · ' + l.scheduled_time : ''}</p>
                    </div>
                    <span className={'text-[9px] font-bold px-1.5 py-0.5 rounded-md ' + badge(l.status)}>{label(l.status)}</span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  )
}