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
    const plugin = filterModContent(await getMod(params.slug))
    const versions = await getModVersions(params.slug)
    const version = versions.find(v => v.version_number === decodeURIComponent(params.versionNumber) || v.id === decodeURIComponent(params.versionNumber))
    
    if (!version) throw new Error('Version not found')
    
    const description = version.changelog ? version.changelog.slice(0, 150) : `Скачать версию ${version.version_number} плагина ${plugin.title}`
    
    const url = siteCanonical(`/plugin/${params.slug}/version/${params.versionNumber}`)
    return {
      title: `${version.version_number} - ${plugin.title}`,
      description: description,
      robots: 'all',
      openGraph: {
        siteName: SITE_NAME,
        type: 'website',
        ...(url ? { url } : {}),
        title: `${version.version_number} - ${plugin.title}`,
        description: version.changelog ? version.changelog.slice(0, 150) : plugin.description,
        images: plugin.icon_url ? [{ url: plugin.icon_url }] : [],
      },
      twitter: {
        card: 'summary',
        title: `${version.version_number} - ${plugin.title}`,
        description: version.changelog ? version.changelog.slice(0, 150) : plugin.description,
        images: plugin.icon_url ? [plugin.icon_url] : [],
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

export default async function PluginVersionPage({ params }) {
  let plugin, versions, version, author;
  
  try {
    [plugin, versions] = await Promise.all([
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

  plugin = filterModContent(plugin)

  return (
    <VersionPage 
      project={plugin}
      version={version}
      author={author}
      contentType="plugin"
      pluralName="plugins"
      singularName="plugin"
      versions={versions}
      galleryCount={plugin.gallery?.length || 0}
    />
  )
}
