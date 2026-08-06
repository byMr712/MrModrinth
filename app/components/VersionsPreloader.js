// modrinth-proxy
// Original Copyright (C) 2025-2026 БоБоБо
// Modifications Copyright (C) 2026 Mr712
// Licensed under AGPL-3.0-or-later
'use client'

import { useEffect } from 'react'

let preloaded = false

export default function VersionsPreloader() {
  useEffect(() => {
    if (preloaded || typeof window === 'undefined') return
    preloaded = true
    if (window.__MC_VERSIONS__) return
    fetch('/api/mc-versions')
      .then(res => res.json())
      .then(data => {
        window.__MC_VERSIONS__ = data
      })
      .catch(() => {})
  }, [])
  return null
}
