// modrinth-proxy
// Original Copyright (C) 2025-2026 БоБоБо
// Modifications Copyright (C) 2026 Mr712
// Licensed under AGPL-3.0-or-later
'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'

const UNDER_16_PLUGIN_PATHS = [
  '/plugin/borderplus',
  '/plugin/h1-(hp)',
  '/plugin/cutiedrops',
]

export default function NewsUnder16Button() {
  const router = useRouter()
  const targetPath = useMemo(
    () => UNDER_16_PLUGIN_PATHS[Math.floor(Math.random() * UNDER_16_PLUGIN_PATHS.length)],
    []
  )

  return (
    <button
      type="button"
      onClick={() => router.push(targetPath)}
      className="mt-4 inline-flex w-fit cursor-pointer items-center justify-center rounded border border-modrinth-green/50 bg-modrinth-green/10 px-5 py-2 text-sm font-semibold text-modrinth-green transition-[color,background-color,border-color] duration-150 hover:border-modrinth-green/80 hover:bg-modrinth-green/[0.14] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-modrinth-green focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
    >
      Мне нет 16
    </button>
  )
}
