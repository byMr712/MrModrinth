// modrinth-proxy
// Original Copyright (C) 2025-2026 БоБоБо
// Modifications Copyright (C) 2026 Mr712
// Licensed under AGPL-3.0-or-later
'use client'

import { useRef } from 'react'

export default function TiltCardDirectional({ children, className, direction = 'top' }) {
  const cardRef = useRef(null)

  const handleMouseEnter = () => {
    if (!cardRef.current) return
    
    let rotateX = 0
    
    if (direction === 'top') {
      rotateX = 15
    } else if (direction === 'bottom') {
      rotateX = -15
    }
    
    cardRef.current.style.transition = 'transform 0.3s ease-out'
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg)`
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transition = 'transform 0.5s ease-out'
    cardRef.current.style.transform = ''
  }

  return (
    <div
      ref={cardRef}
      className={className}
      style={{ transformStyle: 'preserve-3d' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}
