import type { ReactNode } from 'react'

interface CRTShellProps {
  children: ReactNode
}

export function CRTShell({ children }: CRTShellProps) {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      {/* Primary container for application content */}
      <div className="relative z-10 w-full h-full overflow-auto">
        {children}
      </div>
      
      {/* Visual overlay containing scanlines, radial vignette, and fractal noise */}
      <div className="screen-effects" />
    </div>
  )
}
