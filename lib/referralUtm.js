// modrinth-proxy
// Original Copyright (C) 2025-2026 БоБоБо
// Modifications Copyright (C) 2026 Mr712
// Licensed under AGPL-3.0-or-later
import { SITE_NAME } from '@/lib/siteConfig'

const UTM_SOURCE = SITE_NAME
const UTM_MEDIUM = 'referral'

export function withReferralUtm(url) {
  const raw = url?.trim()
  if (!raw) return url

  try {
    const parsed = new URL(raw.includes('://') ? raw : `https://${raw}`)
    parsed.searchParams.set('utm_source', UTM_SOURCE)
    parsed.searchParams.set('utm_medium', UTM_MEDIUM)
    return parsed.toString()
  } catch {
    return url
  }
}
