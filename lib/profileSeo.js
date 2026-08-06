// modrinth-proxy
// Original Copyright (C) 2025-2026 БоБоБо
// Modifications Copyright (C) 2026 Mr712
// Licensed under AGPL-3.0-or-later
import { SITE_NAME, siteCanonical } from '@/lib/siteConfig'

export function getProfileOgImage(avatarUrl, username) {
  if (!avatarUrl) return null

  let url = avatarUrl

  if (url.includes('avatars.githubusercontent.com')) {
    const parsed = new URL(url)
    parsed.searchParams.set('s', '256')
    url = parsed.toString()
  }

  return {
    url,
    width: 256,
    height: 256,
    alt: username ? `Аватар ${username}` : 'Аватар пользователя',
  }
}

export function buildUserProfileMetadata(author, stats, userId, { profilePath = 'user' } = {}) {
  const title = `${author.username} — автор проектов`
  const description = `Профиль автора ${author.username}. ${stats.projectCount} проектов, ${stats.totalDownloads} загрузок.`
  const ogImage = getProfileOgImage(author.avatar_url, author.username)
  const url = siteCanonical(`/${profilePath}/${userId}`)

  return {
    title,
    description,
    robots: 'all',
    openGraph: {
      siteName: SITE_NAME,
      type: 'profile',
      ...(url ? { url } : {}),
      title,
      description: author.bio || description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    twitter: {
      card: 'summary',
      title,
      description: author.bio || description,
      ...(ogImage ? { images: [ogImage.url] } : {}),
    },
    ...(url ? { alternates: { canonical: url } } : {}),
  }
}
