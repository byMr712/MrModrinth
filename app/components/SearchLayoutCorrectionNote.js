// modrinth-proxy
// Original Copyright (C) 2025-2026 БоБоБо
// Modifications Copyright (C) 2026 Mr712
// Licensed under AGPL-3.0-or-later
export default function SearchLayoutCorrectionNote({ correction }) {
  if (!correction?.from || !correction?.to) return null

  return (
    <p className="text-sm text-modrinth-green">
      Показаны результаты для «{correction.to}» — похоже, была включена неверная раскладка клавиатуры
      {correction.from !== correction.to && (
        <span className="text-gray-500"> (вместо «{correction.from}»)</span>
      )}
    </p>
  )
}
