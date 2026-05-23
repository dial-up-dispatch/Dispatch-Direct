import { cn } from '../lib/cn'

interface BlinkingCursorProps {
  className?: string
}

export function BlinkingCursor({ className }: BlinkingCursorProps) {
  return (
    <span
      className={cn(
        'inline-block w-[10px] h-[18px] bg-[var(--color-accent)] blink-cursor-animation align-middle',
        className
      )}
    />
  )
}
