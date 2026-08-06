// modrinth-proxy
// Original Copyright (C) 2025-2026 БоБоБо
// Modifications Copyright (C) 2026 Mr712
// Licensed under AGPL-3.0-or-later
'use client'

import * as Tooltip from '@radix-ui/react-tooltip'

export function TooltipProvider({ children }) {
  return (
    <Tooltip.Provider delayDuration={350} skipDelayDuration={120}>
      {children}
    </Tooltip.Provider>
  )
}

export default function StyledTooltip({ children, label, side = 'top', contentClassName = '' }) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side={side}
          sideOffset={6}
          className={['radix-tooltip-content', contentClassName].filter(Boolean).join(' ')}
        >
          {label}
          <Tooltip.Arrow width={11} height={5} className="radix-tooltip-arrow" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}
