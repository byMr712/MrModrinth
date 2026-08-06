// modrinth-proxy
// Original Copyright (C) 2025-2026 БоБоБо
// Modifications Copyright (C) 2026 Mr712
// Licensed under AGPL-3.0-or-later
import { notFound } from 'next/navigation'
import { getMod, getModVersions, getUser } from '@/lib/modrinth'
import { filterModContent } from '@/lib/contentFilter'
import VersionPage from '@/app/components/VersionPage'
import { SITE_NAME, siteCanonical } from '@/lib/siteConfig'

export async function generateMetadata({ params }) {
  try {
    const modpack = filterModContent(await getMod(params.slug))
    const versions = await getModVersions(params.slug)
    const version = versions.find(v => v.version_number === decodeURIComponent(params.versionNumber) || v.id === decodeURIComponent(params.versionNumber))
    
    if (!version) throw new Error('Version not found')
    
    const description = version.changelog ? version.changelog.slice(0, 150) : `Скачать версию ${version.version_number} модпака ${modpack.title}`
    
    const url = siteCanonical(`/modpack/${params.slug}/version/${params.versionNumber}`)
    return {
      title: `${version.version_number} - ${modpack.title}`,
      description: description,
      robots: 'all',
      openGraph: {
        siteName: SITE_NAME,
        type: 'website',
        ...(url ? { url } : {}),
        title: `${version.version_number} - ${modpack.title}`,
        description: version.changelog ? version.changelog.slice(0, 150) : modpack.description,
        images: modpack.icon_url ? [{ url: modpack.icon_url }] : [],
      },
      twitter: {
        card: 'summary',
        title: `${version.version_number} - ${modpack.title}`,
        description: version.changelog ? version.changelog.slice(0, 150) : modpack.description,
        images: modpack.icon_url ? [modpack.icon_url] : [],
      },
      other: {
        'theme-color': '#1bd96a',
      },
    }
  } catch {
    return {
      title: `Версия не найдена | ${SITE_NAME}`,
      description: 'Запрашиваемая версия не найдена',
    }
  }
}

export default async function ModpackVersionPage({ params }) {
  let modpack, versions, version, author;
  
  try {
    [modpack, versions] = await Promise.all([
      getMod(params.slug),
      getModVersions(params.slug)
    ])
    
    version = versions.find(v => v.version_number === decodeURIComponent(params.versionNumber) || v.id === decodeURIComponent(params.versionNumber))
    
    if (!version) {
      notFound()
    }
    
    if (version.author_id) {
      author = await getUser(version.author_id)
    }
  } catch (error) {
    notFound()
  }

  modpack = filterModContent(modpack)

  return (
    <VersionPage 
      project={modpack}
      version={version}
      author={author}
      contentType="modpack"
      pluralName="modpacks"
      singularName="modpack"
      versions={versions}
      galleryCount={modpack.gallery?.length || 0}
    />
  )
}
