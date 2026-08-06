// modrinth-proxy
// Original Copyright (C) 2025-2026 БоБоБо
// Modifications Copyright (C) 2026 Mr712
// Licensed under AGPL-3.0-or-later
'use client'

import { useEffect } from 'react'

export default function IconPreload({ iconUrl }) {
  useEffect(() => {
    if (!iconUrl) return

    const existingLink = document.querySelector(`link[rel="preload"][as="image"][href="${iconUrl}"]`)
    if (existingLink) return

    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = iconUrl
    document.head.appendChild(link)

    return () => {
      const linkToRemove = document.querySelector(`link[rel="preload"][as="image"][href="${iconUrl}"]`)
      if (linkToRemove) {
        linkToRemove.remove()
      }
    }
  }, [iconUrl])

  return null
}
