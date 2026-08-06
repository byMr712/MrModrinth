// modrinth-proxy
// Original Copyright (C) 2025-2026 БоБоБо
// Modifications Copyright (C) 2026 Mr712
// Licensed under AGPL-3.0-or-later
export default function AuthorPluginPromo() {
  return (
    <div
      className="w-full max-w-none rounded-2xl border border-gray-600/80 bg-[var(--bg-tertiary)] p-4 dark:border-gray-700 sm:p-4"
      role="note"
    >
      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 sm:text-[15px] sm:leading-[1.65]">
        Да, это плагин автора данного сайта. Я очень люблю майнкрафт, и этот плагин был нужен мне в трудные
        времена. Надеюсь и вам поможет.
      </p>
    </div>
  )
}
