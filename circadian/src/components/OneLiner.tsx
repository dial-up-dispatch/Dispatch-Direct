import { useEffect, useRef, useState } from 'react';
import { useTimer } from '../lib/TimerContext';
import { getOneLiner } from '../lib/oneliner';
import type { OneLinerTrigger } from '../lib/oneliner';

export function OneLiner() {
  const { status, mode, elapsed } = useTimer();

  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const prevStatusRef = useRef(status);
  const prevElapsedRef = useRef(elapsed);
  const prevModeRef = useRef(mode);

  const fadeOutTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearTextTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const triggerMessage = (type: OneLinerTrigger) => {
      // Cancel any active timeouts
      if (fadeOutTimeoutRef.current) clearTimeout(fadeOutTimeoutRef.current);
      if (clearTextTimeoutRef.current) clearTimeout(clearTextTimeoutRef.current);

      const text = getOneLiner(type);
      setMessage(text);
      setVisible(true);

      // Start fade out after 300ms fade-in + 3000ms hold = 3300ms
      fadeOutTimeoutRef.current = setTimeout(() => {
        setVisible(false);

        // Clear text after 500ms fade-out finishes
        clearTextTimeoutRef.current = setTimeout(() => {
          setMessage(null);
        }, 500);
      }, 3300);
    };

    const prevStatus = prevStatusRef.current;
    const prevElapsed = prevElapsedRef.current;
    const prevMode = prevModeRef.current;

    // 1. Start transition: standby -> active (timer mode only)
    if (status === 'active' && prevStatus === 'standby' && mode === 'timer') {
      triggerMessage('start');
    }
    // 2. Complete transition: active -> complete
    else if (status === 'complete' && prevStatus === 'active') {
      triggerMessage('complete');
    }
    // 3. Stop transition: active/paused -> standby (only if logged, i.e., elapsed >= 10)
    else if (status === 'standby' && (prevStatus === 'active' || prevStatus === 'paused')) {
      if (prevElapsed >= 10) {
        // Route correct stop category using prevMode
        const triggerType: OneLinerTrigger = prevMode === 'timer' ? 'stop' : 'stopwatch-stop';
        triggerMessage(triggerType);
      }
    }

    // Update refs for next render
    prevStatusRef.current = status;
    prevElapsedRef.current = elapsed;
    prevModeRef.current = mode;
  }, [status, mode, elapsed]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (fadeOutTimeoutRef.current) clearTimeout(fadeOutTimeoutRef.current);
      if (clearTextTimeoutRef.current) clearTimeout(clearTextTimeoutRef.current);
    };
  }, []);

  return (
    <div className="w-full flex items-center justify-center h-5 mt-2">
      <span
        className={`dd-text-dimmed dd-text-xs dd-text-lowercase tracking-wider transition-opacity ease-in-out ${
          visible ? 'duration-300 opacity-100' : 'duration-500 opacity-0'
        }`}
      >
        {message || ''}
      </span>
    </div>
  );
}
