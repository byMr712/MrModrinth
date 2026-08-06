// modrinth-proxy
// Original Copyright (C) 2025-2026 БоБоБо
// Modifications Copyright (C) 2026 Mr712
// Licensed under AGPL-3.0-or-later
import { getMinecraftVersions } from './modrinth'
import { unstable_cache } from 'next/cache'

class MinecraftVersions {
  constructor(data) {
    if (Array.isArray(data)) {
      this.release = data.filter(v => v.version_type === 'release').map(v => v.version)
      this.full = data.map(v => v.version)
    } else {
      this.release = data.release || []
      this.full = data.full || []
    }
  }

  getRelease() {
    return [...this.release]
  }

  getFull() {
    return [...this.full]
  }

  getAll() {
    return {
      release: this.getRelease(),
      full: this.getFull()
    }
  }
}

const getCachedVersions = unstable_cache(
  async () => {
    try {
      const apiVersions = await getMinecraftVersions()
      return new MinecraftVersions(apiVersions)
    } catch (error) {
      console.warn('Failed to fetch versions from Modrinth API, using empty fallback:', error.message)
      return new MinecraftVersions({ release: [], full: [] })
    }
  },
  ['minecraft-versions'],
  {
    revalidate: 86400
  }
)

const fallbackVersions = new MinecraftVersions({ release: [], full: [] })

export async function getMCVersions() {
  if (typeof window !== 'undefined') {
    return fallbackVersions
  }
  try {
    return await getCachedVersions()
  } catch (error) {
    console.warn('Failed to get cached versions, using fallback:', error.message)
    return fallbackVersions
  }
}

export const MC_VERSIONS_RELEASE = fallbackVersions.getRelease()
export const MC_VERSIONS_FULL = fallbackVersions.getFull()
