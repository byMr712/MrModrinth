// modrinth-proxy
// Original Copyright (C) 2025-2026 БоБоБо
// Modifications Copyright (C) 2026 Mr712
// Licensed under AGPL-3.0-or-later
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'MrModrinth'

export const SITE_ORIGIN = (process.env.NEXT_PUBLIC_SITE_ORIGIN || '').replace(/\/+$/, '')

export const METRIKA_ID = process.env.NEXT_PUBLIC_METRIKA_ID || ''

export const SITE_GITHUB_URL =
  process.env.NEXT_PUBLIC_SITE_GITHUB_URL || 'https://github.com/byMr712/MrModrinth'

export function siteCanonical(relPath) {
  if (!SITE_ORIGIN) return undefined
  const path = String(relPath || '').startsWith('/') ? relPath : `/${relPath}`
  return `${SITE_ORIGIN}${path}`
}
