// modrinth-proxy
// Original Copyright (C) 2025-2026 БоБоБо
// Modifications Copyright (C) 2026 Mr712
// Licensed under AGPL-3.0-or-later
import { catalogBlockedRemovedPhrase } from '@/lib/catalogBlockedNote'

export default function CatalogSearchBlockedNote({ count }) {
  if (!(count > 0)) return null
  return (
    <span className="catalog-search-blocked-note">
      {' (из поисковой выдачи '}
      {catalogBlockedRemovedPhrase(count)}
      {')'}
    </span>
  )
}
