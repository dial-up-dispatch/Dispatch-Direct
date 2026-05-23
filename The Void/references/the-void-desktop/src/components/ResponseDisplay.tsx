interface ResponseDisplayProps {
  text: string | null
  isVisible: boolean
}

export function ResponseDisplay({ text, isVisible }: ResponseDisplayProps) {
  if (!isVisible && text === null) return null

  return (
    <div
      className={`fixed left-1/2 -translate-x-1/2 font-mono text-[0.8rem] text-[var(--color-text-dim)] tracking-[0.08em] text-center max-w-[min(480px,80vw)] pointer-events-none select-none z-20 ${
        isVisible ? 'response-fade-in' : 'response-fade-out'
      }`}
      style={{ top: 'calc(50% + 110px)' }}
    >
      {text}
    </div>
  )
}
