// modrinth-proxy
// Original Copyright (C) 2025-2026 БоБоБо
// Modifications Copyright (C) 2026 Mr712
// Licensed under AGPL-3.0-or-later
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  getCollection,
  getProjectsByIds,
  getTeamMembers,
  getUser,
} from '@/lib/modrinth'
import {
  filterAvatar,
  filterModContent,
  filterModsList,
  filterUserPublic,
  isUserBlocked,
  replaceBlockedWords,
} from '@/lib/contentFilter'
import ResourceList from '@/app/components/ResourceList'
import { catalogBlockedRemovedPhrase, pluralRu } from '@/lib/catalogBlockedNote'
import { getProjectTypeDisplayName } from '@/lib/author'
import { SITE_NAME, siteCanonical } from '@/lib/siteConfig'

const COLLECTION_TYPE_MAP = {
  mods: 'mod',
  plugins: 'plugin',
  datapacks: 'datapack',
  shaders: 'shader',
  resourcepacks: 'resourcepack',
  modpacks: 'modpack',
}

const TYPE_COUNT_WORDS = {
  mod: ['мод', 'мода', 'модов'],
  plugin: ['плагин', 'плагина', 'плагинов'],
  datapack: ['датапак', 'датапака', 'датапаков'],
  shader: ['шейдер', 'шейдера', 'шейдеров'],
  resourcepack: ['ресурспак', 'ресурспака', 'ресурспаков'],
  modpack: ['модпак', 'модпака', 'модпаков'],
}

const TYPE_GENITIVE = {
  mod: 'модов',
  plugin: 'плагинов',
  datapack: 'датапаков',
  shader: 'шейдеров',
  resourcepack: 'ресурспаков',
  modpack: 'модпаков',
}

export function buildCollectionMetadata(collection, type = null) {
  const typeSuffix = type ? ` ${getProjectTypeDisplayName(COLLECTION_TYPE_MAP[type]).toLowerCase()}` : ''
  const url = siteCanonical(`/collection/${collection.id}${type ? `/${type}` : ''}`)
  return {
    title: `${collection.name} - Подборка | ${SITE_NAME}`,
    description:
      collection.description ||
      `Подборка проектов для Minecraft${typeSuffix}: ${collection.name}`,
    robots: 'all',
    openGraph: {
      siteName: SITE_NAME,
      type: 'website',
      ...(url ? { url } : {}),
      title: `${collection.name} - Подборка | ${SITE_NAME}`,
      description: collection.description || undefined,
      images: collection.icon_url ? [{ url: collection.icon_url }] : [],
    },
    twitter: {
      card: 'summary',
      title: `${collection.name} - Подборка | ${SITE_NAME}`,
      description: collection.description || undefined,
      images: collection.icon_url ? [collection.icon_url] : [],
    },
    other: {
      'theme-color': '#1bd96a',
    },
  }
}

function resolvePrimaryAuthor(members) {
  if (!Array.isArray(members) || members.length === 0) return null
  const primary =
    members.find((member) => member.role === 'Owner') || members[0]
  return primary?.user ?? null
}

export default async function CollectionPageView({ collectionId, type = null }) {
  const typeValue = COLLECTION_TYPE_MAP[type] ?? null
  if (type && !typeValue) {
    notFound()
  }

  let collection
  try {
    collection = await getCollection(collectionId)
  } catch (error) {
    notFound()
  }

  const owner = filterUserPublic(await getUser(collection.user))

  if (owner && isUserBlocked(owner.id)) {
    return (
      <div className="text-center py-16 max-w-2xl mx-auto">
        <div className="mb-6">
          <svg className="w-20 h-20 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h1 className="text-3xl font-bold text-red-500 mb-4">Доступ ограничен</h1>
          <div className="bg-modrinth-dark border border-gray-800 rounded-xl p-6 mb-6 text-left">
            <p className="text-gray-300 mb-3">
              Данная подборка недоступна в соответствии с региональными ограничениями и требованиями Роскомнадзора.
            </p>
            <p className="text-gray-400 text-sm">
              К сожалению, некоторые подборки были заблокированы на территории Российской Федерации по решению регулирующих органов. Мы вынуждены ограничить доступ к этому контенту для соблюдения действующего законодательства.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const projectsData = await getProjectsByIds(collection.projects)

  const projectsWithAuthors = await Promise.all(
    projectsData.map(async (project) => {
      const author = resolvePrimaryAuthor(await getTeamMembers(project.id))
      if (!author) return project
      return {
        ...project,
        author: author.username,
        author_id: author.id,
      }
    }),
  )

  const filtered = filterModsList(projectsWithAuthors)
  const allResources = filtered.hits.map((project) => filterModContent(project))

  const counts = {}
  for (const resource of allResources) {
    const t = resource.project_type
    if (t) counts[t] = (counts[t] || 0) + 1
  }

  const resources = typeValue
    ? allResources.filter((resource) => resource.project_type === typeValue)
    : allResources

  const countLabel = typeValue
    ? pluralRu(resources.length, ...(TYPE_COUNT_WORDS[typeValue] || ['проект', 'проекта', 'проектов']))
    : pluralRu(resources.length, 'проект', 'проекта', 'проектов')

  const tabs = ['mods', 'plugins', 'datapacks', 'shaders', 'resourcepacks', 'modpacks'].filter(
    (tab) => counts[COLLECTION_TYPE_MAP[tab]] > 0,
  )

  return (
    <div className="max-w-7xl mx-auto">
      <div className="p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-shrink-0">
            {collection.icon_url ? (
              <img
                src={filterAvatar(collection.icon_url)}
                alt={collection.name}
                className="w-24 h-24 rounded-lg object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-modrinth-green to-modrinth-green-light rounded-lg flex items-center justify-center text-3xl font-bold">
                {String(collection.name || '?').charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-white break-words">
                {replaceBlockedWords(collection.name)}
              </h1>
              <span className="px-3 py-1 rounded-full text-sm font-medium w-fit bg-gray-800 border border-gray-700 text-gray-300">
                Подборка
              </span>
            </div>
            {owner && (
              <Link
                href={`/user/${owner.id}`}
                className="flex items-center gap-2 text-gray-400 hover:text-modrinth-green transition-colors w-fit"
              >
                {owner.avatar_url ? (
                  <img
                    src={owner.avatar_url}
                    alt={owner.username}
                    className="w-6 h-6 rounded-md object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-6 h-6 bg-gradient-to-br from-modrinth-green to-modrinth-green-light rounded-md flex items-center justify-center text-xs font-bold">
                    {String(owner.username || '?').charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="font-medium">{owner.username}</span>
              </Link>
            )}
            {collection.description && (
              <p className="text-gray-300 max-w-2xl break-words">
                {replaceBlockedWords(collection.description)}
              </p>
            )}
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="font-semibold text-white">{resources.length}</span>
              <span>{countLabel}</span>
            </div>
          </div>
        </div>
      </div>

      {tabs.length > 0 && (
        <div className="px-6 mb-6 max-w-full overflow-x-auto overscroll-x-contain mobile-nav-spacing custom-scrollbar">
          <nav className="relative flex w-max rounded-full border border-gray-800 bg-modrinth-dark p-1 text-sm font-bold shadow-lg">
            <Link
              href={`/collection/${collection.id}`}
              className={`relative z-[1] flex shrink-0 items-center whitespace-nowrap rounded-full px-4 py-2 transition-colors ${
                !typeValue
                  ? 'bg-modrinth-green text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Все
            </Link>
            {tabs.map((tab) => {
              const tabType = COLLECTION_TYPE_MAP[tab]
              return (
                <Link
                  key={tab}
                  href={`/collection/${collection.id}/${tab}`}
                  className={`relative z-[1] flex shrink-0 items-center whitespace-nowrap rounded-full px-4 py-2 transition-colors ${
                    typeValue === tabType
                      ? 'bg-modrinth-green text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {getProjectTypeDisplayName(tabType)}
                </Link>
              )
            })}
          </nav>
        </div>
      )}

      <div className="px-6 pb-8">
        {filtered.blockedCount > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            <svg className="w-5 h-5 text-amber-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Из этой подборки {catalogBlockedRemovedPhrase(filtered.blockedCount)}.</span>
          </div>
        )}

        {resources.length > 0 ? (
          <ResourceList resources={resources} type="mod" isProfile={true} />
        ) : (
          <div className="text-center py-16">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              В этой подборке нет {typeValue ? TYPE_GENITIVE[typeValue] : 'проектов'}
            </h3>
            <p className="text-gray-500">
              {typeValue
                ? 'Автор ещё не добавил сюда проекты этого типа.'
                : 'Автор ещё не добавил сюда ни одного проекта.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
