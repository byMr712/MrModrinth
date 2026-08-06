// modrinth-proxy
// Original Copyright (C) 2025-2026 БоБоБо
// Modifications Copyright (C) 2026 Mr712
// Licensed under AGPL-3.0-or-later
export function versionChannelLetterRingClass(versionType) {
  if (versionType === 'release') {
    return 'bg-version-release-bg text-version-release-fg'
  }
  if (versionType === 'beta') {
    return 'bg-version-beta-bg text-version-beta-fg'
  }
  return 'bg-red-900 text-red-300'
}
