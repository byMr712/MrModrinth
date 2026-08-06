// modrinth-proxy
// Original Copyright (C) 2025-2026 БоБоБо
// Modifications Copyright (C) 2026 Mr712
// Licensed under AGPL-3.0-or-later
'use client'

import { useEffect } from 'react'
import { applyPalette } from '../../lib/paletteManager'

export default function AppSettingsSync() {
  useEffect(() => {
    const palette = localStorage.getItem('color-palette') || 'pink'
    applyPalette(palette)

    const handlePaletteChange = (e) => {
      applyPalette(e.detail)
    }

    window.addEventListener('color-palette-changed', handlePaletteChange)

    const { hostname } = window.location

    const handleClick = ({ target }) => {
      const a = target.closest('a[href]')
      if (!a || a.target) return

      try {
        if (new URL(a.href).hostname !== hostname) {
          a.target = '_blank'
          a.rel = 'noopener noreferrer'
        }
      } catch {}
    }

    document.addEventListener('click', handleClick, true)
    return () => {
      window.removeEventListener('color-palette-changed', handlePaletteChange)
      document.removeEventListener('click', handleClick, true)
    }
  }, [])

  return null
}
