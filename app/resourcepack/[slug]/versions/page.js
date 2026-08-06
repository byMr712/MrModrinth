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
    const pack = await getMod(params.slug)
    const url = siteCanonical(`/resourcepack/${params.slug}/versions`)
    return {
      title: `${pack.title} - Версии | ${SITE_NAME}`,
      description: `Все версии ресурспака ${pack.title}.`,
      openGraph: {
        siteName: SITE_NAME,
        type: 'website',
        ...(url ? { url } : {}),
        title: `${pack.title} - Версии | ${SITE_NAME}`,
        description: `Все версии ресурспака ${pack.title}.`,
        images: pack.icon_url ? [{ url: pack.icon_url }] : [],
      },
      twitter: {
        card: 'summary',
        title: `${pack.title} - Версии | ${SITE_NAME}`,
        description: `Все версии ресурспака ${pack.title}.`,
        images: pack.icon_url ? [pack.icon_url] : [],
      },
    }
  } catch {
    return { title: `Ресурспак не найден | ${SITE_NAME}` }
  }
}

export default async function ResourcepackVersionsPage({ params, searchParams = {} }) {
  const { slug } = params;
  if (isProjectBlocked(slug)) {
    return <div className="text-center py-16"><Link href="/resourcepacks" className="inline-flex items-center gap-2 bg-modrinth-green text-black px-6 py-3 rounded-lg font-semibold">Вернуться</Link></div>
  }

  const initialLoader = searchParams.l || 'all'

  let pack, versions, teamMembers, organization;
  try {
    [pack, versions, teamMembers] = await Promise.all([getMod(slug), getModVersions(slug), getTeamMembers(slug)]);
    pack = filterModContent(pack);
    teamMembers = filterTeamMembers(teamMembers);
    organization = pack.organization ? await getOrganization(pack.organization) : null;
    if ((isProjectBlocked(pack.slug, pack.id) || isOrganizationBlocked(pack.organization))) notFound()
  } catch (error) {
    notFound()
  }

  return (
    <div className="max-w-7xl mx-auto">
      <IconPreload iconUrl={pack.icon_url} />
      <ResourceHeader resource={pack} contentType="resourcepack" versions={versions} />
      
      <ContentNavigation slug={slug} contentType="resourcepack" versionsCount={versions.length} galleryCount={pack.gallery?.length || 0} projectColor={pack.color} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="min-w-0">
          <VersionsList versions={versions} contentType="resourcepack" slug={slug} initialLoader={searchParams.l || 'all'} projectColor={pack.color} />
        </div>
        <div className="lg:sticky lg:top-4 lg:self-start">
          <ResourceSidebar resource={pack} organization={organization} teamMembers={teamMembers} />
        </div>
      </div>
    </div>
  )
}
