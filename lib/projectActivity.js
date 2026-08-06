// modrinth-proxy
// Original Copyright (C) 2025-2026 БоБоБо
// Modifications Copyright (C) 2026 Mr712
// Licensed under AGPL-3.0-or-later
export const ACTIVITY_DAYS = 60
export const ACTIVITY_PAD_TOP = 10
export const ACTIVITY_PAD_BOTTOM = 10
export const ACTIVITY_SMOOTH_SIGMA = 0.8

export function gaussianSmooth(data, sigma) {
  const radius = Math.ceil(sigma * 3)
  const kernel = []
  for (let k = -radius; k <= radius; k++) {
    kernel.push(Math.exp(-(k * k) / (2 * sigma * sigma)))
  }
  return data.map((_, i) => {
    let sum = 0
    let weight = 0
    for (let k = -radius; k <= radius; k++) {
      const j = i + k
      if (j >= 0 && j < data.length) {
        sum += data[j] * kernel[k + radius]
        weight += kernel[k + radius]
      }
    }
    return sum / weight
  })
}

export function buildDailyVersionCounts(versions, days = ACTIVITY_DAYS) {
  const counts = Array(days).fill(0)
  if (!Array.isArray(versions) || versions.length === 0) {
    return { counts, hasAnyData: false }
  }

  const now = Date.now()
  const cutoff = now - days * 24 * 60 * 60 * 1000

  for (const version of versions) {
    const dateStr = version?.date_published ?? version?.published
    if (!dateStr) continue
    const t = new Date(dateStr).getTime()
    if (Number.isNaN(t) || t < cutoff) continue
    const dayIndex = Math.floor((t - cutoff) / (24 * 60 * 60 * 1000))
    if (dayIndex >= 0 && dayIndex < days) counts[dayIndex]++
  }

  return { counts, hasAnyData: counts.some((c) => c > 0) }
}

export function catmullRomPath(pts) {
  if (pts.length < 2) return ''
  let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[Math.max(0, i - 2)]
    const p1 = pts[i - 1]
    const p2 = pts[i]
    const p3 = pts[Math.min(pts.length - 1, i + 1)]
    const t = 1 / 6
    const cp1x = p1[0] + (p2[0] - p0[0]) * t
    const cp1y = p1[1] + (p2[1] - p0[1]) * t
    const cp2x = p2[0] - (p3[0] - p1[0]) * t
    const cp2y = p2[1] - (p3[1] - p1[1]) * t
    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`
  }
  return d
}

export function buildActivityPoints(dailyCounts, svgWidth, svgHeight, hasAnyData) {
  if (!hasAnyData || svgWidth <= 0 || svgHeight <= 0) return []

  const smoothed = gaussianSmooth(dailyCounts, ACTIVITY_SMOOTH_SIGMA)
  const max = Math.max(...smoothed, 1e-6)
  const bottom = svgHeight - ACTIVITY_PAD_BOTTOM
  const range = bottom - ACTIVITY_PAD_TOP

  return smoothed.map((c, i) => [
    (i / (dailyCounts.length - 1)) * svgWidth,
    bottom - (c / max) * range,
  ])
}

export function buildActivityAreaPath(linePath, points, svgHeight) {
  if (!points.length || !linePath) return ''
  const b = (svgHeight - ACTIVITY_PAD_BOTTOM).toFixed(2)
  const first = points[0]
  const last = points[points.length - 1]
  return `${linePath} L ${last[0].toFixed(2)} ${b} L ${first[0].toFixed(2)} ${b} Z`
}
