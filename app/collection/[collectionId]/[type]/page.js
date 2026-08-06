// modrinth-proxy
// Original Copyright (C) 2025-2026 БоБоБо
// Modifications Copyright (C) 2026 Mr712
// Licensed under AGPL-3.0-or-later
import { SITE_NAME } from '@/lib/siteConfig'
import { getCollection } from '@/lib/modrinth'
import CollectionPageView, { buildCollectionMetadata } from '@/app/components/CollectionPageView'

export async function generateMetadata({ params }) {
  try {
    const collection = await getCollection(params.collectionId)
    return buildCollectionMetadata(collection, params.type)
  } catch {
    return {
      title: `Подборка не найдена | ${SITE_NAME}`,
      description: 'Запрашиваемая подборка не найдена',
    }
  }
}

export default function CollectionTypePage({ params }) {
  return <CollectionPageView collectionId={params.collectionId} type={params.type} />
}
