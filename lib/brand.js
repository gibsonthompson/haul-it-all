// lib/brand.js
// The white-label engine. A tenant uploads a logo, we pull its dominant brand
// color, and derive a full, accessible admin theme from it. The derived tokens
// map 1:1 onto the --admin-* CSS variables the admin UI already reads, so the
// whole product reskins with zero code.
//
// Design rule (same one the Haul green uses): the raw brand color is the
// ACCENT (logo tile, highlights), but buttons and text-on-color use a
// contrast-safe PRIMARY, darkened until white text clears WCAG AA (4.5:1).
// This keeps every tenant's UI legible no matter how bright their logo is.

// ------------------------------------------------------------- color math
export function hexToRgb(hex) {
  const h = hex.replace('#', '')
  const n = h.length === 3 ? h.split('').map(c => c + c).join('') : h
  const int = parseInt(n, 16)
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 }
}

export function rgbToHex({ r, g, b }) {
  const to = (v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')
  return '#' + to(r) + to(g) + to(b)
}

export function rgbToHsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  const d = max - min
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0))
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h /= 6
  }
  return { h: h * 360, s, l }
}

export function hslToRgb({ h, s, l }) {
  h /= 360
  const hue = (p, q, t) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
  let r, g, b
  if (s === 0) { r = g = b = l }
  else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue(p, q, h + 1 / 3); g = hue(p, q, h); b = hue(p, q, h - 1 / 3)
  }
  return { r: r * 255, g: g * 255, b: b * 255 }
}

// WCAG relative luminance + contrast ratio.
function channel(v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4) }
export function luminance({ r, g, b }) { return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b) }
export function contrast(rgb1, rgb2) {
  const l1 = luminance(rgb1), l2 = luminance(rgb2)
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
}

const WHITE = { r: 255, g: 255, b: 255 }

// Darken a color (in HSL space) until white text on it clears the target ratio.
export function contrastSafe(hex, target = 4.5) {
  let { h, s, l } = rgbToHsl(hexToRgb(hex))
  // keep some saturation so it still reads as the brand color, not mud
  s = Math.min(1, Math.max(s, 0.35))
  let rgb = hslToRgb({ h, s, l })
  let guard = 0
  while (contrast(rgb, WHITE) < target && l > 0.05 && guard < 100) {
    l -= 0.02
    rgb = hslToRgb({ h, s, l })
    guard++
  }
  return rgbToHex(rgb)
}

function shift(hex, dl) {
  const { h, s, l } = rgbToHsl(hexToRgb(hex))
  return rgbToHex(hslToRgb({ h, s, l: Math.max(0, Math.min(1, l + dl)) }))
}
function rgba(hex, a) { const { r, g, b } = hexToRgb(hex); return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})` }

// The default Haul theme (bright logo green + contrast-safe deep green).
export const DEFAULT_BRAND = {
  accent: '#7fd957',
  primary: '#2c7a1a',
  primaryHover: '#24631a',
  primarySoft: 'rgba(44, 122, 26, 0.08)',
  ring: 'rgba(44, 122, 26, 0.18)',
}

// Turn a single brand color into the full token set the admin UI consumes.
export function deriveBrand(seedHex) {
  if (!seedHex) return { ...DEFAULT_BRAND }
  const accent = seedHex
  const primary = contrastSafe(seedHex, 4.5)
  return {
    accent,
    primary,
    primaryHover: shift(primary, -0.06),
    primarySoft: rgba(primary, 0.08),
    ring: rgba(primary, 0.18),
  }
}

// Map a brand token set onto the --admin-* CSS variables on an element.
// Neutrals (ink, bone, line) stay fixed for legibility across tenants.
export function brandToCssVars(brand) {
  const b = brand && brand.primary ? brand : DEFAULT_BRAND
  return {
    '--admin-primary': b.primary,
    '--admin-primary-hover': b.primaryHover,
    '--admin-primary-soft': b.primarySoft,
    '--admin-primary-ring': b.ring,
    '--admin-accent': b.accent,
  }
}

// ------------------------------------------------- logo -> dominant color
// Browser only. Draws the image small, ignores background/near-gray pixels,
// buckets the rest by hue weighted by saturation, and returns the dominant
// vibrant color as hex. Falls back to the Haul green if the logo has no color.
export function extractDominantColor(imgEl) {
  try {
    const size = 48
    const canvas = document.createElement('canvas')
    canvas.width = size; canvas.height = size
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    ctx.drawImage(imgEl, 0, 0, size, size)
    const { data } = ctx.getImageData(0, 0, size, size)

    // 12 hue buckets, each accumulating saturation-weighted rgb.
    const buckets = Array.from({ length: 12 }, () => ({ r: 0, g: 0, b: 0, w: 0 }))
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3]
      if (a < 200) continue
      const max = Math.max(r, g, b), min = Math.min(r, g, b)
      if (max > 236 && min > 236) continue      // near-white bg
      if (max < 22) continue                     // near-black
      if (max - min < 16) continue               // near-gray / neutral
      const { h, s, l } = rgbToHsl({ r, g, b })
      if (s < 0.18 || l < 0.12 || l > 0.9) continue
      const bin = Math.min(11, Math.floor((h / 360) * 12))
      const w = s * (1 - Math.abs(l - 0.5))      // favor vibrant, mid-light
      buckets[bin].r += r * w; buckets[bin].g += g * w; buckets[bin].b += b * w; buckets[bin].w += w
    }
    let best = null
    for (const bk of buckets) if (bk.w > 0 && (!best || bk.w > best.w)) best = bk
    if (!best) return DEFAULT_BRAND.accent
    return rgbToHex({ r: best.r / best.w, g: best.g / best.w, b: best.b / best.w })
  } catch {
    return DEFAULT_BRAND.accent
  }
}

// Convenience: from a loaded <img>, get the full derived brand in one call.
export function brandFromImage(imgEl) {
  return deriveBrand(extractDominantColor(imgEl))
}