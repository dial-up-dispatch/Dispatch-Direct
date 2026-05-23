import { useEffect } from 'react'

interface ScreenWipeProps {
  direction: 'bottom-to-top' | 'top-to-bottom'
  onComplete: () => void
  duration: number  // passed from App.tsx
}

export function ScreenWipe({ direction, onComplete, duration }: ScreenWipeProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, duration)
    return () => clearTimeout(timer)
  }, [onComplete, duration])

  const isUp = direction === 'bottom-to-top'

  return (
    <div
      className={`fixed inset-0 z-50 pointer-events-none bg-[var(--color-accent-glow)] ${
        isUp
          ? 'wipe-up border-t border-[var(--color-accent)]'
          : 'wipe-down border-b border-[var(--color-accent)]'
      }`}
    />
  )
}
