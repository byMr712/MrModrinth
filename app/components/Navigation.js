// modrinth-proxy
// Original Copyright (C) 2025-2026 БоБоБо
// Modifications Copyright (C) 2026 Mr712
// Licensed under AGPL-3.0-or-later
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
export default function Navigation() {
  const pathname = usePathname()
  const [indicator, setIndicator] = useState({ left: 0, width: 0, height: 0, opacity: 0, color: 'modrinth-green' })
  const prevPathnameRef = useRef(null)
  const navRef = useRef(null)
  const scrollRef = useRef(null)
  const linksRef = useRef({})
  const [hasAnimated, setHasAnimated] = useState(false)

  const getColorForPath = (path) => {
    if (path.startsWith('/discover/mods') || path.startsWith('/mods') || path.startsWith('/mod/')) return 'modrinth-green'
    if (path.startsWith('/discover/resourcepacks') || path.startsWith('/resourcepacks') || path.startsWith('/resourcepack/')) return 'purple'
    if (path.startsWith('/discover/datapacks') || path.startsWith('/datapacks') || path.startsWith('/datapack/')) return 'orange'
    if (path.startsWith('/discover/shaders') || path.startsWith('/shaders') || path.startsWith('/shader/')) return 'cyan'
    if (path.startsWith('/discover/modpacks') || path.startsWith('/modpacks') || path.startsWith('/modpack/')) return 'red'
    if (path.startsWith('/discover/plugins') || path.startsWith('/plugins') || path.startsWith('/plugin/')) return 'blue'
    return 'modrinth-green'
  }

  const isActive = (path) => {
    if (path === '/') return pathname === '/'
    if (path === '/discover/mods') {
      return pathname.startsWith('/discover/mods') || pathname.startsWith('/mods') || pathname.startsWith('/mod/')
    }
    if (path === '/discover/resourcepacks') {
      return pathname.startsWith('/discover/resourcepacks') || pathname.startsWith('/resourcepacks') || pathname.startsWith('/resourcepack/')
    }
    if (path === '/discover/datapacks') {
      return pathname.startsWith('/discover/datapacks') || pathname.startsWith('/datapacks') || pathname.startsWith('/datapack/')
    }
    if (path === '/discover/shaders') {
      return pathname.startsWith('/discover/shaders') || pathname.startsWith('/shaders') || pathname.startsWith('/shader/')
    }
    if (path === '/discover/modpacks') {
      return pathname.startsWith('/discover/modpacks') || pathname.startsWith('/modpacks') || pathname.startsWith('/modpack/')
    }
    if (path === '/discover/plugins') {
      return pathname.startsWith('/discover/plugins') || pathname.startsWith('/plugins') || pathname.startsWith('/plugin/')
    }
    return pathname.startsWith(path)
  }

  useEffect(() => {
    const updateIndicator = () => {
      requestAnimationFrame(() => {
        const activeKey = Object.keys(linksRef.current).find(key => isActive(key))
        if (activeKey && linksRef.current[activeKey]) {
          const element = linksRef.current[activeKey]
          const navElement = navRef.current
          if (element && navElement) {
            if (prevPathnameRef.current !== null && prevPathnameRef.current !== pathname) {
              setHasAnimated(true)
            }
            
            setIndicator({
              left: element.offsetLeft,
              width: element.offsetWidth,
              height: element.offsetHeight,
              opacity: 1,
              color: getColorForPath(pathname)
            })

            const scrollElement = scrollRef.current
            if (scrollElement && scrollElement.classList.contains('nav-links-scroll--can-scroll')) {
              const linkLeft = element.offsetLeft
              const linkRight = linkLeft + element.offsetWidth
              const viewLeft = scrollElement.scrollLeft
              const viewRight = viewLeft + scrollElement.clientWidth
              if (linkLeft < viewLeft || linkRight > viewRight) {
                const targetLeft = linkRight > viewRight
                  ? linkRight - scrollElement.clientWidth
                  : linkLeft
                scrollElement.scrollTo({
                  left: Math.max(0, targetLeft),
                  behavior: hasAnimated ? 'smooth' : 'auto',
                })
              }
            }
            
            prevPathnameRef.current = pathname
          }
        } else {
          setIndicator(prev => ({ ...prev, opacity: 0 }))
        }
      })
    }

    updateIndicator()
    
    const timeoutId = setTimeout(() => {
      updateIndicator()
    }, 100)
    
    const handleResize = () => {
      updateIndicator()
    }

    const scrollElement = scrollRef.current
    const handleScroll = () => {
      updateIndicator()
    }
    
    window.addEventListener('resize', handleResize)
    scrollElement?.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', handleResize)
      scrollElement?.removeEventListener('scroll', handleScroll)
    }
  }, [pathname])

  useEffect(() => {
    const scrollEl = scrollRef.current
    const navEl = navRef.current
    if (!scrollEl || !navEl) return

    const syncScrollability = () => {
      const overflowPx = navEl.scrollWidth - scrollEl.clientWidth
      const overflows = overflowPx > 12
      scrollEl.classList.toggle('nav-links-scroll--can-scroll', overflows)
      if (!overflows && scrollEl.scrollLeft !== 0) {
        scrollEl.scrollLeft = 0
      }
    }

    const lockScrollWhenIdle = () => {
      if (!scrollEl.classList.contains('nav-links-scroll--can-scroll')) {
        scrollEl.scrollLeft = 0
      }
    }

    syncScrollability()

    const resizeObserver = new ResizeObserver(syncScrollability)
    resizeObserver.observe(scrollEl)
    resizeObserver.observe(navEl)
    window.addEventListener('resize', syncScrollability)
    scrollEl.addEventListener('scroll', lockScrollWhenIdle, { passive: true })

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', syncScrollability)
      scrollEl.removeEventListener('scroll', lockScrollWhenIdle)
    }
  }, [pathname])

  const getGradientClass = (color) => {
    const gradients = {
      'modrinth-green': 'from-modrinth-green/20 to-modrinth-green-light/20',
      'purple': 'from-purple-500/10 to-pink-500/10',
      'orange': 'from-orange-500/10 to-amber-500/10',
      'cyan': 'from-cyan-500/10 to-blue-500/10',
      'red': 'from-red-500/10 to-rose-500/10',
      'blue': 'from-blue-500/10 to-cyan-500/10',
      'yellow': 'from-yellow-500/10 to-amber-500/10',
      'emerald': 'from-emerald-500/10 to-teal-500/10',
      server: 'from-indigo-500/10 to-violet-500/10',
    }
    return gradients[color] || gradients['modrinth-green']
  }

  return (
    <div
      ref={scrollRef}
      className="nav-links-scroll hidden min-w-0 lg:block"
    >
      <div ref={navRef} className="relative flex w-max flex-nowrap items-center gap-0.5 md:gap-1">
        <div 
          className={`nav-indicator absolute rounded-lg bg-gradient-to-r pointer-events-none ${getGradientClass(indicator.color)} ${hasAnimated ? 'transition-all duration-700 ease-out' : ''}`}
          style={{
            left: `${indicator.left}px`,
            width: `${indicator.width}px`,
            height: `${indicator.height}px`,
            opacity: indicator.opacity,
            transform: 'translateZ(0)',
            top: '0',
            zIndex: 0
          }}
        />
      
      <Link 
        ref={el => linksRef.current['/discover/mods'] = el}
        href="/discover/mods" 
        className="group relative px-2.5 md:px-4 py-2 rounded-lg transition-all duration-300 whitespace-nowrap z-10 hover:bg-[rgba(var(--color-green-rgb),0.08)] dark:hover:bg-[rgba(var(--color-green-rgb),0.1)]">
        <span className={`text-xs md:text-sm font-semibold transition-colors flex items-center gap-1.5 ${isActive('/discover/mods') || isActive('/mods') ? 'text-modrinth-green' : 'text-gray-700 dark:text-gray-300 group-hover:text-[color:var(--color-green-hover)] dark:group-hover:text-modrinth-green-light'}`}>
          <svg className="hidden sm:inline w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16"></path>
            <path d="M3.29 7 12 12l8.71-5M12 22V12"></path>
          </svg>
          <span>Моды</span>
        </span>
      </Link>
      
      <Link 
        ref={el => linksRef.current['/discover/resourcepacks'] = el}
        href="/discover/resourcepacks" 
        className="group relative px-2.5 md:px-4 py-2 rounded-lg transition-all duration-300 whitespace-nowrap z-10 hover:bg-purple-500/10 dark:hover:bg-purple-500/10">
        <span className={`text-xs md:text-sm font-semibold transition-colors flex items-center gap-1.5 ${isActive('/discover/resourcepacks') || isActive('/resourcepacks') ? 'text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400'}`}>
          <svg className="hidden sm:inline w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3"></path>
            <path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7M14.5 17.5 4.5 15"></path>
          </svg>
          <span>Ресурспаки</span>
        </span>
      </Link>
      
      <Link 
        ref={el => linksRef.current['/discover/datapacks'] = el}
        href="/discover/datapacks" 
        className="group relative px-2.5 md:px-4 py-2 rounded-lg transition-all duration-300 whitespace-nowrap z-10 hover:bg-orange-500/10 dark:hover:bg-orange-500/10">
        <span className={`text-xs md:text-sm font-semibold transition-colors flex items-center gap-1.5 ${isActive('/discover/datapacks') || isActive('/datapacks') ? 'text-orange-600 dark:text-orange-400' : 'text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400'}`}>
          <svg className="hidden sm:inline w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"></path>
          </svg>
          <span>Датапаки</span>
        </span>
      </Link>
      
      <Link 
        ref={el => linksRef.current['/discover/shaders'] = el}
        href="/discover/shaders" 
        className="group relative px-2.5 md:px-4 py-2 rounded-lg transition-all duration-300 whitespace-nowrap z-10 hover:bg-cyan-500/10 dark:hover:bg-cyan-500/10">
        <span className={`text-xs md:text-sm font-semibold transition-colors flex items-center gap-1.5 ${isActive('/discover/shaders') || isActive('/shaders') ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-700 dark:text-gray-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-400'}`}>
          <svg className="hidden sm:inline w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="6" cy="15" r="4"></circle>
            <circle cx="18" cy="15" r="4"></circle>
            <path d="M14 15a2 2 0 0 0-2-2 2 2 0 0 0-2 2M2.5 13 5 7c.7-1.3 1.4-2 3-2M21.5 13 19 7c-.7-1.3-1.5-2-3-2"></path>
          </svg>
          <span>Шейдеры</span>
        </span>
      </Link>
      
      <Link 
        ref={el => linksRef.current['/discover/modpacks'] = el}
        href="/discover/modpacks" 
        className="group relative px-2.5 md:px-4 py-2 rounded-lg transition-all duration-300 whitespace-nowrap z-10 hover:bg-red-500/10 dark:hover:bg-red-500/10">
        <span className={`text-xs md:text-sm font-semibold transition-colors flex items-center gap-1.5 ${isActive('/discover/modpacks') || isActive('/modpacks') ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400'}`}>
          <svg className="hidden sm:inline w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 22v-9M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.66 1.66 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z"></path>
            <path d="M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13"></path>
            <path d="M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.64 1.64 0 0 0 1.63 0z"></path>
          </svg>
          <span>Модпаки</span>
        </span>
      </Link>
      
      <Link 
        ref={el => linksRef.current['/discover/plugins'] = el}
        href="/discover/plugins" 
        className="group relative px-2.5 md:px-4 py-2 rounded-lg transition-all duration-300 whitespace-nowrap z-10 hover:bg-blue-500/10 dark:hover:bg-blue-500/10">
        <span className={`text-xs md:text-sm font-semibold transition-colors flex items-center gap-1.5 ${isActive('/discover/plugins') || isActive('/plugins') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>
          <svg className="hidden sm:inline w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 22v-5M9 8V2M15 8V2M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"></path>
          </svg>
          <span>Плагины</span>
        </span>
      </Link>

      <Link 
        ref={el => linksRef.current['/whothisfile'] = el}
        href="/whothisfile" 
        className="group relative px-2.5 md:px-4 py-2 rounded-lg transition-all duration-300 whitespace-nowrap z-10 hover:bg-[rgba(var(--color-green-rgb),0.08)] dark:hover:bg-[rgba(var(--color-green-rgb),0.1)]">
        <span className={`text-xs md:text-sm font-semibold transition-colors flex items-center gap-1.5 ${isActive('/whothisfile') ? 'text-modrinth-green' : 'text-gray-700 dark:text-gray-300 group-hover:text-[color:var(--color-green-hover)] dark:group-hover:text-modrinth-green-light'}`}>
          <svg className="hidden sm:inline w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"></path>
          </svg>
          <span>Что за файл?</span>
        </span>
      </Link>

      <Link 
        ref={el => linksRef.current['/about'] = el}
        href="/about" 
        className="group relative px-2.5 md:px-4 py-2 rounded-lg transition-all duration-300 whitespace-nowrap z-10 hover:bg-[rgba(var(--color-green-rgb),0.08)] dark:hover:bg-[rgba(var(--color-green-rgb),0.1)]">
        <span className={`text-xs md:text-sm font-semibold transition-colors flex items-center gap-1.5 ${isActive('/about') ? 'text-modrinth-green' : 'text-gray-700 dark:text-gray-300 group-hover:text-[color:var(--color-green-hover)] dark:group-hover:text-modrinth-green-light'}`}>
          <svg className="hidden sm:inline w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4M12 8h.01"></path>
          </svg>
          <span>О программе</span>
        </span>
      </Link>

      <span className="mx-1 h-5 w-px shrink-0 bg-gray-300/60 dark:bg-gray-700/60" aria-hidden />

      <Link
        href="/settings"
        aria-label="Настройки"
        title="Настройки"
        className={`group relative flex items-center px-2.5 py-2 rounded-lg transition-all duration-300 z-10 ${pathname.startsWith('/settings') ? 'text-modrinth-green' : 'text-gray-500 dark:text-gray-400 hover:text-[color:var(--color-green-hover)] dark:hover:text-modrinth-green-light'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-5 h-5">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      </Link>

      </div>
    </div>
  )
}
