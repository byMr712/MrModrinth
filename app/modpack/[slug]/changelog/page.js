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
    const modpack = await getMod(params.slug)
    const url = siteCanonical(`/modpack/${params.slug}/changelog`)
    return {
      title: `${modpack.title} - Изменения | ${SITE_NAME}`,
      description: `История изменений модпака ${modpack.title}`,
      openGraph: {
        siteName: SITE_NAME,
        type: 'website',
        ...(url ? { url } : {}),
        title: `${modpack.title} - Изменения | ${SITE_NAME}`,
        description: `История изменений модпака ${modpack.title}`,
        images: modpack.icon_url ? [{ url: modpack.icon_url }] : [],
      },
      twitter: {
        card: 'summary',
        title: `${modpack.title} - Изменения | ${SITE_NAME}`,
        description: `История изменений модпака ${modpack.title}`,
        images: modpack.icon_url ? [modpack.icon_url] : [],
      },
    }
  } catch {
    return { title: `Модпак не найден | ${SITE_NAME}` }
  }
}

export default async function ModpackChangelogPage({ params }) {
  const { slug } = params;
  if (isProjectBlocked(slug)) {
    return <div className="text-center py-16"><Link href="/modpacks" className="inline-flex items-center gap-2 bg-modrinth-green text-black px-6 py-3 rounded-lg font-semibold">Вернуться</Link></div>
  }

  let modpack, versions, teamMembers, organization;
  try {
    [modpack, versions, teamMembers] = await Promise.all([getMod(slug), getModVersions(slug), getTeamMembers(slug)]);
    modpack = filterModContent(modpack);
    teamMembers = filterTeamMembers(teamMembers);
    organization = modpack.organization ? await getOrganization(modpack.organization) : null;
    if ((isProjectBlocked(modpack.slug, modpack.id) || isOrganizationBlocked(modpack.organization))) notFound()
  } catch (error) {
    notFound()
  }

  return (
    <div className="max-w-7xl mx-auto">
      <IconPreload iconUrl={modpack.icon_url} />
      <ResourceHeader resource={modpack} contentType="modpack" versions={versions} />
      
      <ContentNavigation slug={slug} contentType="modpack" versionsCount={versions.length} galleryCount={modpack.gallery?.length || 0} projectColor={modpack.color} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2">
          <div className="bg-modrinth-dark border border-gray-800 rounded-lg overflow-hidden">
            <div className="p-4 md:p-6">
              <ChangelogVersionEntries versions={versions} slug={slug} contentType="modpack" projectColor={modpack.color} />
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-4 lg:self-start">
          <ResourceSidebar resource={modpack} organization={organization} teamMembers={teamMembers} />
        </div>
      </div>
    </div>
  )
}
