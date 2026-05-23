interface DissolveOverlayProps {
  text: string;
  isVisible: boolean;
  containerHeight: number; // locked height passed from parent
}

export function DissolveOverlay({ text, isVisible, containerHeight }: DissolveOverlayProps) {
  if (!isVisible) return null;

  return (
    <div
      style={{
        height: `${containerHeight}px`,
      }}
      className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none select-none"
    >
      {/* 
        Element 1 — Scanline sweep:
        Translates from bottom to top over 200ms.
      */}
      <div className="absolute top-0 left-0 w-full h-[40%] bg-gradient-to-t from-transparent via-[var(--color-accent-glow)] to-transparent pointer-events-none animate-scanline-sweep z-20" />

      {/* 
        Element 2 — The Text snapshot:
        Exactly matches the textarea typography, padding, and alignment.
        Animates from full opacity to invisible with a vertical drift and blur.
      */}
      <div className="w-full h-full text-center font-mono text-base text-[var(--color-text-primary)] px-3 py-2 whitespace-pre-wrap break-words animate-text-dissolve z-10 leading-normal">
        {text}
      </div>
    </div>
  );
}
