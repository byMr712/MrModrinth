// modrinth-proxy
// Original Copyright (C) 2025-2026 БоБоБо
// Modifications Copyright (C) 2026 Mr712
// Licensed under AGPL-3.0-or-later
'use client'

export default function ReloadButton() {
  return (
    <button
      onClick={() => window.location.reload()}
      className="px-6 py-3 bg-modrinth-green hover:bg-green-600 text-black font-semibold rounded-lg transition-colors"
    >
      Обновить страницу
    </button>
  )
}
