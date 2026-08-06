// modrinth-proxy
// Original Copyright (C) 2025-2026 БоБоБо
// Modifications Copyright (C) 2026 Mr712
// Licensed under AGPL-3.0-or-later
import HomeClient from './HomeClient'
import {
  getModrinthPlatformStatistics,
  getModrinthProjectTypeTotals,
} from '@/lib/modrinthCatalogTotals'
import { SITE_NAME } from '@/lib/siteConfig'

export const metadata = {
  title: SITE_NAME,
  description: 'Скачать моды, плагины, шейдеры, ресурспаки и датапаки для Minecraft. Удобный каталог на русском языке. Тысячи модификаций для любой версии.',
}

export default async function Home() {
  let platformStats = null
  let categoryTotals = null
  try {
    const [stats, totals] = await Promise.all([
      getModrinthPlatformStatistics(),
      getModrinthProjectTypeTotals(),
    ])
    if (stats.projects > 0) platformStats = stats
    if (totals && Object.values(totals).some((n) => n > 0)) categoryTotals = totals
  } catch {
    platformStats = null
    categoryTotals = null
  }
  return (
    <HomeClient
      platformStats={platformStats}
      categoryTotals={categoryTotals}
    />
  )
}
