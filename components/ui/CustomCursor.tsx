'use client'
import { useEffect, useRef } from 'react'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Solo en desktop
    if (window.matchMedia('(pointer: coarse)').matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = 0, mouseY = 0
    let ringX = 0, ringY = 0

    const moveCursor = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.left = `${mouseX}px`
      dot.style.top = `${mouseY}px`
    }

    // Ring sigue con lag suave
    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      ring.style.left = `${ringX}px`
      ring.style.top = `${ringY}px`
      requestAnimationFrame(animateRing)
    }
    animateRing()

    // Hover en elementos interactivos con delegación dinámica
    const addHover = () => {
      dot.classList.add('hovering')
      ring.classList.add('hovering')
    }
    const removeHover = () => {
      dot.classList.remove('hovering')
      ring.classList.remove('hovering')
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return

      // Si el cursor está sobre un diálogo modal o admin modal, ocultar dot/ring para permitir cursor nativo sin interferencias
      const isInsideModal = target.closest('[role="dialog"], .admin-modal, [data-modal="true"]')
      if (isInsideModal) {
        dot.style.opacity = '0'
        ring.style.opacity = '0'
        return
      } else {
        dot.style.opacity = '1'
        ring.style.opacity = '0.6'
      }

      const isInteractive = target.closest('a, button, [role="button"], input, textarea, select, label')
      if (isInteractive) {
        addHover()
      } else {
        removeHover()
      }
    }

    const handleMouseLeave = () => {
      dot.style.opacity = '0'
      ring.style.opacity = '0'
    }

    const handleMouseEnter = () => {
      dot.style.opacity = '1'
      ring.style.opacity = '0.6'
    }

    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)
    window.addEventListener('mousemove', moveCursor)

    return () => {
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      window.removeEventListener('mousemove', moveCursor)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}
