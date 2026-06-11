import { useState } from 'react';

export function CRTWarmup() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      className="dd-crt-warmup-overlay"
      onAnimationEnd={() => setVisible(false)}
      aria-hidden="true"
    >
      <style>{`
        .dd-crt-warmup-overlay {
          position: fixed;
          inset: 0;
          z-index: 10000;
          background: #000;
          pointer-events: none;
          animation: dd-crt-power-on 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dd-crt-warmup-overlay::before {
          content: "";
          position: absolute;
          width: 100%;
          height: 3px;
          background: var(--dd-accent, #D39858);
          box-shadow: 0 0 15px var(--dd-accent-glow, rgba(211, 152, 88, 0.5));
          animation: dd-crt-line-collapse 0.7s cubic-bezier(0.25, 1, 0.5, 1) forwards,
                     dd-crt-warmup-flicker 0.7s linear forwards;
        }

        @keyframes dd-crt-power-on {
          0% {
            opacity: 1;
            background: #000000;
          }
          40% {
            opacity: 1;
            background: #0b0b0b;
          }
          85% {
            opacity: 0.9;
          }
          100% {
            opacity: 0;
            visibility: hidden;
          }
        }

        @keyframes dd-crt-line-collapse {
          0% {
            transform: scaleX(0) scaleY(1);
            opacity: 0;
          }
          15% {
            transform: scaleX(1) scaleY(1);
            opacity: 1;
          }
          45% {
            transform: scaleX(1) scaleY(0.15);
            opacity: 0.8;
          }
          70% {
            transform: scaleX(0.15) scaleY(0.02);
            opacity: 0.9;
          }
          100% {
            transform: scaleX(0) scaleY(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
