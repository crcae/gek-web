'use client'
import { useInView } from '@/lib/hooks/useInView'

interface Props {
  children: React.ReactNode
  animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right'
  delay?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  className?: string
}

export function AnimatedSection({
  children,
  animation = 'fade-up',
  delay = 0,
  className = '',
}: Props) {
  const { ref, inView } = useInView()

  return (
    <div
      ref={ref}
      className={`animate-${animation} ${inView ? 'in-view' : ''} ${
        delay ? `stagger-${delay}` : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
