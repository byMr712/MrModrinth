// modrinth-proxy
// Original Copyright (C) 2025-2026 БоБоБо
// Modifications Copyright (C) 2026 Mr712
// Licensed under AGPL-3.0-or-later
class FavoritesManager {
  constructor() {
    this.mcVersionKey = 'favoriteMcVersion'
    this.loaderKey = 'favoriteLoader'
  }

  _normalizeContentType(contentType) {
    if (!contentType) return 'mod'
    const type = contentType.toLowerCase().trim()
    const mapping = {
      'mods': 'mod',
      'mod': 'mod',
      'resourcepacks': 'resourcepack',
      'resourcepack': 'resourcepack',
      'datapacks': 'datapack',
      'datapack': 'datapack',
      'shaders': 'shader',
      'shader': 'shader',
      'modpacks': 'modpack',
      'modpack': 'modpack',
      'plugins': 'plugin',
      'plugin': 'plugin'
    }
    return mapping[type] || type
  }

  getFavoriteMcVersion(contentType) {
    if (typeof window === 'undefined') {
      return ''
    }
    const type = this._normalizeContentType(contentType)
    const key = `${this.mcVersionKey}_${type}`
    const val = localStorage.getItem(key)
    if (val) return val
    if (type === 'mod') {
      const oldVal = localStorage.getItem(this.mcVersionKey)
      if (oldVal) {
        localStorage.setItem(key, oldVal)
        localStorage.removeItem(this.mcVersionKey)
        return oldVal
      }
    }
    return ''
  }

  setFavoriteMcVersion(version, contentType) {
    if (typeof window === 'undefined') {
      return
    }
    const type = this._normalizeContentType(contentType)
    const key = `${this.mcVersionKey}_${type}`
    if (version) {
      localStorage.setItem(key, version)
    } else {
      localStorage.removeItem(key)
    }
  }

  getFavoriteLoader(contentType) {
    if (typeof window === 'undefined') {
      return ''
    }
    const type = this._normalizeContentType(contentType)
    const key = `${this.loaderKey}_${type}`
    const val = localStorage.getItem(key)
    if (val) return val
    if (type === 'mod') {
      const oldVal = localStorage.getItem(this.loaderKey)
      if (oldVal) {
        localStorage.setItem(key, oldVal)
        localStorage.removeItem(this.loaderKey)
        return oldVal
      }
    }
    return ''
  }

  setFavoriteLoader(loader, contentType) {
    if (typeof window === 'undefined') {
      return
    }
    const type = this._normalizeContentType(contentType)
    const key = `${this.loaderKey}_${type}`
    if (loader) {
      localStorage.setItem(key, loader)
    } else {
      localStorage.removeItem(key)
    }
  }
}

export const favoritesManager = new FavoritesManager()
