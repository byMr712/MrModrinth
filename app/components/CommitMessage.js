// modrinth-proxy
// Original Copyright (C) 2025-2026 БоБоБо
// Modifications Copyright (C) 2026 Mr712
// Licensed under AGPL-3.0-or-later
'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function escapeHtml(text) {
  if (!text) return ''
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export default function CommitMessage({ message }) {
  if (!message) {
    return null
  }

  const escapedMessage = escapeHtml(message)

  return (
    <div className="prose prose-invert prose-sm max-w-none mb-3 break-words">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {escapedMessage}
      </ReactMarkdown>
    </div>
  )
}
