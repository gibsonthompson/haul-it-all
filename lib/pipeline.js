// lib/pipeline.js
// Single source of truth for the lead pipeline.
// Every admin page that references a status value imports from here.
// To add, remove, or rename a stage: update this file AND the SQL check
// constraint on haul_leads.status (see supabase/migrations/0003_leads_pipeline.sql).
//
// Adapted from the RSA waterproofing pipeline to fit hauling: junk removal
// usually quotes straight from photos (no separate on-site estimate stage),
// and speed-to-lead is the whole game on a new lead.

export const PIPELINE_STAGES = [
  {
    key: 'new',
    label: 'New',
    short: 'New',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    badge: 'bg-blue-100 text-blue-700',
    dot: 'bg-blue-500',
    pillActive: 'bg-blue-100 text-blue-700 border-blue-200',
    order: 1,
    terminal: false,
    help: 'New lead from the site. They already got an auto-confirmation text. Call within 5 minutes, speed wins the job.',
  },
  {
    key: 'contacting',
    label: 'Contacting',
    short: 'Contacting',
    bg: 'bg-sky-50',
    text: 'text-sky-600',
    badge: 'bg-sky-100 text-sky-700',
    dot: 'bg-sky-500',
    pillActive: 'bg-sky-100 text-sky-700 border-sky-200',
    order: 2,
    terminal: false,
    help: 'You are working to reach them. Keep the cadence: text, call, text. Do not let it go cold.',
  },
  {
    key: 'quoted',
    label: 'Quoted',
    short: 'Quoted',
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
    badge: 'bg-indigo-100 text-indigo-700',
    dot: 'bg-indigo-500',
    pillActive: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    order: 3,
    terminal: false,
    help: 'Price is out (junk from photos, or a flat dumpster rate). Follow up if you have not heard back in 2 days.',
  },
  {
    key: 'scheduled',
    label: 'Scheduled',
    short: 'Scheduled',
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    badge: 'bg-purple-100 text-purple-700',
    dot: 'bg-purple-500',
    pillActive: 'bg-purple-100 text-purple-700 border-purple-200',
    order: 4,
    terminal: false,
    help: 'They said yes. The job or dumpster drop is on the calendar. Confirm the crew or the bin and the arrival window.',
  },
  {
    key: 'in_progress',
    label: 'In Progress',
    short: 'In Progress',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    badge: 'bg-emerald-100 text-emerald-700',
    dot: 'bg-emerald-500',
    pillActive: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    order: 5,
    terminal: false,
    help: 'Crew is on site, or the dumpster is out. Finish the job and collect payment.',
  },
  {
    key: 'completed',
    label: 'Completed',
    short: 'Completed',
    bg: 'bg-green-50',
    text: 'text-green-600',
    badge: 'bg-green-100 text-green-700',
    dot: 'bg-green-500',
    pillActive: 'bg-green-100 text-green-700 border-green-200',
    order: 6,
    terminal: true,
    help: 'Done and paid. Ask for a Google review while the job is fresh.',
  },
  {
    key: 'lost',
    label: 'Lost',
    short: 'Lost',
    bg: 'bg-red-50',
    text: 'text-red-600',
    badge: 'bg-red-100 text-red-700',
    dot: 'bg-red-400',
    pillActive: 'bg-red-100 text-red-700 border-red-200',
    order: 7,
    terminal: true,
    help: 'They passed. Queue for win-back in 60 to 90 days.',
  },
]

export const STAGE_KEYS = PIPELINE_STAGES.map(s => s.key)
export const STAGE_BY_KEY = Object.fromEntries(PIPELINE_STAGES.map(s => [s.key, s]))

export const getStage = (key) => STAGE_BY_KEY[key] || STAGE_BY_KEY['new']
export const getStageLabel = (key) => getStage(key).label
export const isTerminal = (key) => STAGE_BY_KEY[key]?.terminal || false

// For dashboards, filters, and KPIs.
export const TERMINAL_STAGES = ['completed', 'lost']
export const SALES_ACTIVE_STAGES = ['contacting', 'quoted', 'scheduled', 'in_progress']

// Revenue projection sums quoted_amount for these stages (a price is out, money expected).
export const REVENUE_PROJECTION_STAGES = ['quoted', 'scheduled', 'in_progress']

// Close reasons for a "lost" transition.
export const CLOSE_REASONS = ['Too expensive', 'Went with competitor', 'No response', 'Not ready yet', 'DIY', 'Out of area', 'Other']

// Service types offered. Used by any form that creates or edits a lead.
// Junk removal spine plus the dumpster rental spine, matching the site.
export const SERVICE_OPTIONS = [
  'Junk Removal',
  'Furniture Removal',
  'Appliance Removal',
  'Garage Cleanout',
  'Estate Cleanout',
  'Hot Tub Removal',
  'Construction Debris',
  'Yard Debris',
  'Dumpster Rental',
  'Not Sure',
]

// Recommended next action based on stage and lead data.
// Returns { text, urgency: 'low'|'medium'|'high' } or null.
export function getRecommendedAction(stage, lead) {
  if (!lead || !stage) return null

  const ageMs = Date.now() - new Date(lead.created_at)
  const ageMins = ageMs / 6e4
  const ageHours = ageMs / 36e5
  const scheduledDate = lead.scheduled_date ? new Date(lead.scheduled_date + 'T00:00:00') : null
  const daysUntilScheduled = scheduledDate ? Math.floor((scheduledDate - Date.now()) / 864e5) : null

  switch (stage) {
    case 'new':
      if (ageHours > 24) return { text: `Lead is ${Math.floor(ageHours)}h old. Call now, this one is going cold.`, urgency: 'high' }
      if (ageHours > 1) return { text: `Lead is ${Math.floor(ageHours)}h old. Call now.`, urgency: 'high' }
      if (ageMins > 5) return { text: `Lead is ${Math.floor(ageMins)} min old. Call now, the 5 minute window matters.`, urgency: 'high' }
      return { text: 'New lead. Call now. Answering within 5 minutes wins roughly 8x more jobs.', urgency: 'high' }

    case 'contacting':
      if (ageHours > 72) return { text: 'In Contacting over 3 days. Try a different channel or mark it lost.', urgency: 'high' }
      return { text: 'Keep the cadence going: text, call, text.', urgency: 'medium' }

    case 'quoted':
      return { text: 'Price is out. Follow up if there is no answer in 2 days.', urgency: 'medium' }

    case 'scheduled':
      if (!scheduledDate) return { text: 'Marked scheduled but no date set. Add one below.', urgency: 'medium' }
      if (daysUntilScheduled < 0) return { text: 'The scheduled date has passed. Move to In Progress or reschedule.', urgency: 'high' }
      if (daysUntilScheduled === 0) return { text: 'Scheduled for today. Confirm the crew or the bin is dispatched.', urgency: 'high' }
      if (daysUntilScheduled === 1) return { text: 'Scheduled tomorrow. Send a reminder text.', urgency: 'medium' }
      return { text: `Scheduled in ${daysUntilScheduled} days.`, urgency: 'low' }

    case 'in_progress':
      return { text: 'Crew on site or bin is out. Collect payment when the work is done.', urgency: 'low' }

    case 'completed':
      return { text: 'Paid and closed. Ask for a Google review if you have not already.', urgency: 'low' }

    case 'lost':
      return { text: 'Dead for now. Queue for win-back in 60 to 90 days.', urgency: 'low' }

    default:
      return null
  }
}