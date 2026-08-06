// modrinth-proxy
// Original Copyright (C) 2025-2026 БоБоБо
// Modifications Copyright (C) 2026 Mr712
// Licensed under AGPL-3.0-or-later
import { fetchProjectDependencies, fetchVersionDependencies } from '@/lib/dependencies'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const version = searchParams.get('version')
  if (!slug) return Response.json({ error: 'slug required' }, { status: 400 })
  try {
    const deps = version
      ? await fetchVersionDependencies(slug, version)
      : await fetchProjectDependencies(slug)
    return Response.json(deps)
  } catch {
    return Response.json({ error: 'failed to load dependencies' }, { status: 502 })
  }
}
