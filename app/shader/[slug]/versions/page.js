// modrinth-proxy
// Original Copyright (C) 2025-2026 БоБоБо
// Modifications Copyright (C) 2026 Mr712
// Licensed under AGPL-3.0-or-later
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getMod, getModVersions, getTeamMembers, getOrganization } from '@/lib/modrinth'
import { filterModContent, filterTeamMembers, isProjectBlocked, isOrganizationBlocked } from '@/lib/contentFilter'
import ResourceSidebar from '@/app/components/ResourceSidebar'
import ContentNavigation from '@/app/components/ContentNavigation'
import ResourceHeader from '@/app/components/ResourceHeader'
import VersionsList from '@/app/components/VersionsList'
import IconPreload from '@/app/components/IconPreload'
import { SITE_NAME, siteCanonical } from '@/lib/siteConfig'

export async function generateMetadata({ params }) {
  try {
    const shader = await getMod(params.slug)
    const url = siteCanonical(`/shader/${params.slug}/versions`)
    return {
      title: `${shader.title} - Версии | ${SITE_NAME}`,
      description: `Все версии шейдера ${shader.title}.`,
      openGraph: {
        siteName: SITE_NAME,
        type: 'website',
        ...(url ? { url } : {}),
        title: `${shader.title} - Версии | ${SITE_NAME}`,
        description: `Все версии шейдера ${shader.title}.`,
        images: shader.icon_url ? [{ url: shader.icon_url }] : [],
      },
      twitter: {
        card: 'summary',
        title: `${shader.title} - Версии | ${SITE_NAME}`,
        description: `Все версии шейдера ${shader.title}.`,
        images: shader.icon_url ? [shader.icon_url] : [],
      },
    }
  } catch {
    return { title: `Шейдер не найден | ${SITE_NAME}` }
  }
}

export default async function ShaderVersionsPage({ params, searchParams = {} }) {
  const { slug } = params;
  if (isProjectBlocked(slug)) {
    return <div className="text-center py-16"><Link href="/shaders" className="inline-flex items-center gap-2 bg-modrinth-green text-black px-6 py-3 rounded-lg font-semibold">Вернуться</Link></div>
  }

  const initialLoader = searchParams.l || 'all'

  let shader, versions, teamMembers, organization;
  try {
    [shader, versions, teamMembers] = await Promise.all([getMod(slug), getModVersions(slug), getTeamMembers(slug)]);
    shader = filterModContent(shader);
    teamMembers = filterTeamMembers(teamMembers);
    organization = shader.organization ? await getOrganization(shader.organization) : null;
    if ((isProjectBlocked(shader.slug, shader.id) || isOrganizationBlocked(shader.organization))) notFound()
  } catch (error) {
    notFound()
  }

  return (
    <div className="max-w-7xl mx-auto">
      <IconPreload iconUrl={shader.icon_url} />
      <ResourceHeader resource={shader} contentType="shader" versions={versions} />
      
      <ContentNavigation slug={slug} contentType="shader" versionsCount={versions.length} galleryCount={shader.gallery?.length || 0} projectColor={shader.color} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="min-w-0">
          <VersionsList versions={versions} contentType="shader" slug={slug} initialLoader={searchParams.l || 'all'} projectColor={shader.color} />
        </div>
        <div className="lg:sticky lg:top-4 lg:self-start">
          <ResourceSidebar resource={shader} organization={organization} teamMembers={teamMembers} />
        </div>
      </div>
    </div>
  )
}
