// modrinth-proxy
// Original Copyright (C) 2025-2026 БоБоБо
// Modifications Copyright (C) 2026 Mr712
// Licensed under AGPL-3.0-or-later
'use client'

import * as Popover from '@radix-ui/react-popover'
import { useState, useRef } from 'react'
import { DownloadIcon } from './icons'

export default function DownloadButtonWithPopover({ 
  buttonText,
  officialUrl, 
  pirateUrl
}) {
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (window.innerWidth >= 768) {
      setOpen(true)
    }
  }

  const handleMouseLeave = () => {
    if (window.innerWidth >= 768) {
      timeoutRef.current = setTimeout(() => {
        setOpen(false)
      }, 200)
    }
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => {
            if (window.innerWidth < 768) {
              setOpen(!open)
            }
          }}
          className="download-link w-full hover:scale-100 focus:outline-none outline-none"
        >
          <div className="flex items-center justify-center gap-3">
            <DownloadIcon />
            {buttonText}
          </div>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="rounded-xl px-3 py-1.5 shadow-lg shadow-black/50 border border-gray-700 z-50"
          style={{ backgroundColor: 'var(--bg-gradient-start)' }}
          side="top"
          sideOffset={-10}
          align="end"
          alignOffset={-10}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex items-center justify-center gap-3 text-white text-center">
            <a
              href={officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-modrinth-green hover:underline text-sm focus:outline-none outline-none"
            >
              Официальная
            </a>
            <span className="text-gray-500">|</span>
            <a
              href={pirateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-modrinth-green hover:underline text-sm focus:outline-none outline-none"
            >
              Хочу без лицензии
            </a>
          </div>
          <Popover.Arrow className="fill-[var(--bg-gradient-start)]" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
