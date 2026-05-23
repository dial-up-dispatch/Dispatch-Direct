let sharedAudioCtx: AudioContext | null = null;

/**
 * Returns a single, shared AudioContext instance.
 * Automatically handles initializing and resuming the context if suspended.
 */
export function getAudioContext(): AudioContext {
  if (!sharedAudioCtx) {
    sharedAudioCtx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  
  if (sharedAudioCtx.state === 'suspended') {
    // We attempt to resume, though browsers require a user gesture (which is satisfied on keystrokes/clicks)
    sharedAudioCtx.resume().catch((err) => {
      console.warn('Failed to resume AudioContext:', err);
    });
  }
  
  return sharedAudioCtx;
}
