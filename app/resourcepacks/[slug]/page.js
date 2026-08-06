// modrinth-proxy
// Original Copyright (C) 2025-2026 БоБоБо
// Modifications Copyright (C) 2026 Mr712
// Licensed under AGPL-3.0-or-later
import { redirect } from 'next/navigation'

export default function OldResourcepackPage({ params }) {
  redirect(`/resourcepack/${params.slug}`)
}
