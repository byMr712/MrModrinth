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
import IconPreload from '@/app/components/IconPreload'
import ChangelogVersionEntries from '@/app/components/ChangelogVersionEntries'
import { SITE_NAME, siteCanonical } from '@/lib/siteConfig'

export async function generateMetadata({ params }) {
  try {
    const shader = await getMod(params.slug)
    const url = siteCanonical(`/shader/${params.slug}/changelog`)
    return {
      title: `${shader.title} - Изменения | ${SITE_NAME}`,
      description: `История изменений шейдера ${shader.title}`,
      openGraph: {
        siteName: SITE_NAME,
        type: 'website',
        ...(url ? { url } : {}),
        title: `${shader.title} - Изменения | ${SITE_NAME}`,
        description: `История изменений шейдера ${shader.title}`,
        images: shader.icon_url ? [{ url: shader.icon_url }] : [],
      },
      twitter: {
        card: 'summary',
        title: `${shader.title} - Изменения | ${SITE_NAME}`,
        description: `История изменений шейдера ${shader.title}`,
        images: shader.icon_url ? [shader.icon_url] : [],
      },
    }
  } catch {
    return { title: `Шейдер не найден | ${SITE_NAME}` }
  }
}

export default async function ShaderChangelogPage({ params }) {
  const { slug } = params;
  if (isProjectBlocked(slug)) {
    return <div className="text-center py-16"><Link href="/shaders" className="inline-flex items-center gap-2 bg-modrinth-green text-black px-6 py-3 rounded-lg font-semibold">Вернуться</Link></div>
  }

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
          <div className="bg-modrinth-dark border border-gray-800 rounded-lg overflow-hidden">
            <div className="p-4 md:p-6">
              <ChangelogVersionEntries versions={versions} slug={slug} contentType="shader" projectColor={shader.color} />
            </div>
          </div>
        </div>
        <div className="lg:sticky lg:top-4 lg:self-start">
          <ResourceSidebar resource={shader} organization={organization} teamMembers={teamMembers} />
        </div>
      </div>
    </div>
  )
}
