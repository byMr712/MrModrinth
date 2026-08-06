// modrinth-proxy
// Original Copyright (C) 2025-2026 БоБоБо
// Modifications Copyright (C) 2026 Mr712
// Licensed under AGPL-3.0-or-later
import { SITE_NAME } from '@/lib/siteConfig'
import SettingsClient from './SettingsClient'

export const metadata = {
  title: `Настройки сайта | ${SITE_NAME}`,
  description: 'Настройте поведение и внешний вид сайта MrModrinth под ваши предпочтения на этом устройстве.',
  robots: 'noindex, nofollow'
}

export default function SettingsPage() {
  return (
    <div className="max-w-7xl mx-auto py-8">
      <h1 className="text-3xl font-extrabold text-white mb-2" id="settings-title">Настройки</h1>
      <p className="text-gray-400 mb-8 text-sm md:text-base">Персонализируйте отображение каталогов и функции на этом устройстве.</p>
      <SettingsClient />
    </div>
  )
}
