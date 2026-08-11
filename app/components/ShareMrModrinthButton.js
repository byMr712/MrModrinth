// modrinth-proxy
// Original Copyright (C) 2025-2026 БоБоБо
// Modifications Copyright (C) 2026 Mr712
// Licensed under AGPL-3.0-or-later
'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import StyledTooltip from './StyledTooltip'

const MODRINTH_URL_TYPES = {
  mod: 'mod',
  mods: 'mod',
  modpack: 'modpack',
  modpacks: 'modpack',
  plugin: 'plugin',
  plugins: 'plugin',
  datapack: 'datapack',
  datapacks: 'datapack',
  resourcepack: 'resourcepack',
  resourcepacks: 'resourcepack',
  shader: 'shader',
  shaders: 'shader',
  server: 'server',
  servers: 'server',
  minecraft_java_server: 'server',
}

export default function ShareMrModrinthButton({ resource, contentType, accent = null, muted = false, className = '' }) {
  const [copied, setCopied] = useState(false)
  const [portalTarget, setPortalTarget] = useState(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    setPortalTarget(document.body)
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const modrinthType =
    MODRINTH_URL_TYPES[contentType] ||
    MODRINTH_URL_TYPES[resource?.project_type] ||
    'mod'
  const shareUrl = `https://modrinth.com/${modrinthType}/${resource?.slug || resource?.id || ''}`

  const accentCss = accent?.accentHex || 'var(--color-green)'

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
    } catch (err) {
      try {
        const textarea = document.createElement('textarea')
        textarea.value = shareUrl
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      } catch (fallbackErr) {
        console.error('Failed to copy:', fallbackErr)
        return
      }
    }
    setCopied(true)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setCopied(false), 2200)
  }

  return (
    <>
      <StyledTooltip label="Скопировать ссылку на оригинал" side="bottom">
        <button
          type="button"
          onClick={handleShare}
          className={`share-modrinth-button modrinth-button-font text-base w-full lg:w-auto focus:outline-none outline-none${muted ? ' share-modrinth-button--muted' : ''}${className ? ` ${className}` : ''}`}
          style={accent && !muted ? { backgroundColor: accent.accentHex, color: accent.activeFgHex } : undefined}
        >
          <svg
            className="w-4 h-4 lg:w-[18px] lg:h-[18px] shrink-0"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.25}
            viewBox="0 0 24 24"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <path d="m8.59 13.51 6.83 3.98" />
            <path d="m15.41 6.51-6.82 3.98" />
          </svg>
          <span>Поделиться</span>
        </button>
      </StyledTooltip>

      {copied && portalTarget && createPortal(
        <div className="fixed inset-x-0 bottom-6 z-[300] flex justify-center px-4 pointer-events-none">
          <div
            className="share-toast pointer-events-auto flex items-start gap-3 rounded-2xl border py-3 pl-4 pr-5 shadow-2xl animate-slide-up"
            style={{ '--share-accent': accentCss }}
            role="status"
            aria-live="polite"
          >
            <span className="share-toast-check mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} viewBox="0 0 24 24">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-bold leading-snug">Ссылка на MrModrinth скопирована</span>
              <span className="share-toast-url text-xs leading-snug break-all">{shareUrl}</span>
            </div>
          </div>
        </div>,
        portalTarget,
      )}
    </>
  )
}
