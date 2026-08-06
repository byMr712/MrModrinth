// modrinth-proxy
// Original Copyright (C) 2025-2026 БоБоБо
// Modifications Copyright (C) 2026 Mr712
// Licensed under AGPL-3.0-or-later
import { notFound, redirect } from 'next/navigation'
import { getMod, getServer } from '@/lib/modrinth'
import { isProjectBlocked, isOrganizationBlocked } from '@/lib/contentFilter'
import { resolveProjectHref } from '@/lib/dependencies'

export default async function ProjectRedirectPage({ params }) {
  const { slug, path } = params

  let project
  try {
    project = await getMod(slug)
  } catch {
    try {
      project = await getServer(slug)
    } catch {
      redirect('/')
    }
  }

  if (isProjectBlocked(project.slug, project.id) || isOrganizationBlocked(project.organization)) {
    notFound()
  }

  const baseHref = resolveProjectHref(project)
  if (!baseHref) {
    notFound()
  }

  const suffix = Array.isArray(path) && path.length > 0 ? `/${path.join('/')}` : ''
  redirect(`${baseHref}${suffix}`)
}
