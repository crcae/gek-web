'use client'
import { useInView } from '@/lib/hooks/useInView'

export function AnimatedLine({ className = '' }: { className?: string }) {
  const { ref, inView } = useInView()
  return (
    <div
      ref={ref}
      className={`animate-line ${inView ? 'in-view' : ''} ${className}`}
    />
  )
}
