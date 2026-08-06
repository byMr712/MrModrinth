// modrinth-proxy
// Original Copyright (C) 2025-2026 БоБоБо
// Modifications Copyright (C) 2026 Mr712
// Licensed under AGPL-3.0-or-later
export const DEPENDENCY_TYPE_LABELS = {
  required: 'Требуется',
  optional: 'Опциональная',
  embedded: 'Встроенная',
}

const PROJECT_ROUTES = {
  mod: 'mod',
  plugin: 'plugin',
  modpack: 'modpack',
  resourcepack: 'resourcepack',
  shader: 'shader',
  datapack: 'datapack',
  minecraft_java_server: 'server',
}

export function resolveProjectHref(project) {
  if (!project?.slug) return '#'
  const type = project.project_type ?? 'mod'
  const segment = PROJECT_ROUTES[type] ?? 'mod'
  return `/${segment}/${project.slug}`
}

export function dependencyTypeLabel(type) {
  return DEPENDENCY_TYPE_LABELS[type] ?? type
}

export function dedupeDependencies(deps) {
  const seen = new Set()
  const out = []
  for (const dep of deps) {
    if (!dep.project_id) continue
    const key = `${dep.project_id}:${dep.dependency_type}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push(dep)
  }
  return out
}