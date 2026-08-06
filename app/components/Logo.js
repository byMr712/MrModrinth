// modrinth-proxy
// Original Copyright (C) 2025-2026 БоБоБо
// Modifications Copyright (C) 2026 Mr712
// Licensed under AGPL-3.0-or-later
'use client'

import Link from 'next/link'
import { SITE_NAME } from '@/lib/siteConfig'

export default function Logo() {
  return (
    <Link href="/discover/mods" className="flex items-center gap-2 md:gap-3 group flex-shrink-0 relative">
      <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-modrinth-green to-modrinth-green-light bg-clip-text text-transparent hidden sm:block group-hover:from-modrinth-green-light group-hover:to-modrinth-green transition-all select-none">{SITE_NAME}</span>
      <div className="hidden sm:block absolute top-full left-1/2 -translate-x-1/2 mt-[2px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none z-50 select-none">
        <div className="relative select-none">
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-b-6 border-l-transparent border-r-transparent border-b-gray-800 select-none"></div>
          <div className="bg-gray-800 text-white px-4 py-1.5 rounded-full text-xs whitespace-nowrap shadow-xl border border-gray-700 select-none">
            <span className="select-none">На главную</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
