// modrinth-proxy
// Original Copyright (C) 2025-2026 БоБоБо
// Modifications Copyright (C) 2026 Mr712
// Licensed under AGPL-3.0-or-later
import { toProjectInfo } from '@/lib/dependencies'
import { getMod } from '@/lib/modrinth'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const slugOrId = searchParams.get('id') || searchParams.get('slug')
  if (!slugOrId) return Response.json({ error: 'slug or id required' }, { status: 400 })
  try {
    const project = await getMod(slugOrId)
    return Response.json(toProjectInfo(project))
  } catch {
    return Response.json({ error: 'project not found' }, { status: 404 })
  }
}
