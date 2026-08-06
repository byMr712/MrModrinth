// modrinth-proxy
// Original Copyright (C) 2025-2026 БоБоБо
// Modifications Copyright (C) 2026 Mr712
// Licensed under AGPL-3.0-or-later
import { renderMarkdownToHtml } from '@/lib/renderMarkdown'

export default function MarkdownContent({ content, className }) {
  const html = renderMarkdownToHtml(content)

  return (
    <div
      className={className}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
