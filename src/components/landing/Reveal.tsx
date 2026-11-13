import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '~/lib/utils'

type Direction = 'up' | 'left' | 'right'

type RevealProps = {
  children: ReactNode
  /** Where the content slides in from. */
  direction?: Direction
  /** Milliseconds to wait once it scrolls into view (use to stagger siblings). */
  delay?: number
  className?: string
}

const HIDDEN: Record<Direction, string> = {
  up: 'translate-y-8',
  left: '-translate-x-12',
  right: 'translate-x-12',
}

/**
 * Slides and fades its content in the first time it scrolls into view.
 *
 * It renders fully visible on the server and for anyone who prefers reduced motion,
 * and only hides content that starts below the fold, so nothing flashes on load
 * and nothing is lost if scripts don't run.
 */
export default function Reveal({
  children,
  direction = 'up',
  delay = 0,
  className,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  // idle: untouched · hidden: waiting offscreen · shown: animating in
  const [phase, setPhase] = useState<'idle' | 'hidden' | 'shown'>('idle')

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Already on screen when the page loads: leave it be.
    if (element.getBoundingClientRect().top < window.innerHeight * 0.9) return

    setPhase('hidden')
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setPhase('shown')
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={phase === 'shown' ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(
        phase === 'hidden' && `opacity-0 ${HIDDEN[direction]}`,
        phase === 'shown' &&
          'translate-x-0 translate-y-0 opacity-100 transition-[opacity,translate] duration-700 ease-out',
        className
      )}
    >
      {children}
    </div>
  )
}
