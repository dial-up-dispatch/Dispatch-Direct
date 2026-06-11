/**
 * Dispatch Direct — dispatch-audio.ts
 * Reusable Web Audio API synthesizers.
 * 
 * Safe lazy-initialization, autoplay unlockers, volume/mute tracking,
 * and pure code-synthesized sound primitives. Zero asset dependencies.
 */

export interface AudioOptions {
  volume?: number;
}

export interface ClickOptions extends AudioOptions {
  pitch?: number;
}

// Module state parameters
let audioCtx: AudioContext | null = null;
let masterVolume = 0.5;
let isMuted = false;

/**
 * Initializes and unlocks the singleton AudioContext instance.
 * Must be executed in response to a user interaction gesture (click/keydown).
 * 
 * @returns Unlocked AudioContext or null if unsupported.
 */
function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') {
    return null; // Graceful degradation in non-browser scopes (service workers)
  }

  const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) {
    return null;
  }

  try {
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch((err) => {
        console.warn('Dispatch Audio: Failed to resume suspended AudioContext:', err);
      });
    }
    return audioCtx;
  } catch (err) {
    console.warn('Dispatch Audio: Web Audio API initialization failed:', err);
    return null;
  }
}

/**
 * Utility helper that creates a gain node connected to master output.
 * 
 * @param ctx Active context.
 * @param localVolume Element-specific volume coefficient.
 * @returns Connected Gain node or null.
 */
function createSoundChain(ctx: AudioContext, localVolume = 1.0): GainNode | null {
  if (isMuted || !ctx) return null;

  try {
    const gainNode = ctx.createGain();
    // Combined multiplier (local volume * master volume)
    const targetVolume = localVolume * masterVolume;
    gainNode.gain.setValueAtTime(targetVolume, ctx.currentTime);
    gainNode.connect(ctx.destination);
    return gainNode;
  } catch {
    return null;
  }
}

export const audio = {
  /**
   * Set the master volume scaling factor.
   * @param volume Value between 0.0 (silent) and 1.0 (loud).
   */
  setVolume(volume: number): void {
    masterVolume = Math.max(0, Math.min(1, volume));
  },

  /**
   * Get the current master volume level.
   * @returns Master volume scalar.
   */
  getVolume(): number {
    return masterVolume;
  },

  /**
   * Toggle the muted state.
   * @param muted True to mute, false to unmute.
   */
  setMuted(muted: boolean): void {
    isMuted = !!muted;
  },

  /**
   * Check if audio is currently muted.
   * @returns Mute status.
   */
  isMuted(): boolean {
    return isMuted;
  },

  /**
   * Safe pre-unlock hook.
   * Call this inside core user interaction handlers to bootstrap the AudioContext.
   */
  unlock(): void {
    getAudioContext();
  },

  /**
   * Synthesizes a mechanical typewriter clack sound.
   * Detuning/pitch variation makes it sound tactile and dynamic.
   * 
   * @param options Configurations
   */
  playClick(options: ClickOptions = {}): void {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const pitch = options.pitch ?? (0.85 + Math.random() * 0.3);
    const localVol = options.volume ?? 1.0;
    const now = ctx.currentTime;

    try {
      // 1. High frequency mechanical switch click
      const highGain = createSoundChain(ctx, 0.02 * localVol);
      if (highGain) {
        const highOsc = ctx.createOscillator();
        highOsc.type = 'sine';
        highOsc.frequency.setValueAtTime(2000 * pitch, now);
        highOsc.frequency.exponentialRampToValueAtTime(1200 * pitch, now + 0.01);

        highGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.01);
        highOsc.connect(highGain);
        highOsc.start(now);
        highOsc.stop(now + 0.015);
      }

      // 2. Lower frequency structural typewriter clack
      const lowGain = createSoundChain(ctx, 0.12 * localVol);
      if (lowGain) {
        const lowOsc = ctx.createOscillator();
        lowOsc.type = 'triangle';
        lowOsc.frequency.setValueAtTime(140 * pitch, now);
        lowOsc.frequency.exponentialRampToValueAtTime(80 * pitch, now + 0.035);

        lowGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
        lowOsc.connect(lowGain);
        lowOsc.start(now);
        lowOsc.stop(now + 0.04);
      }
    } catch {
      // Silently absorb audio synthesis errors
    }
  },

  /**
   * Synthesizes a classic dual-tone phosphor confirm chime.
   * 
   * @param options Configurations
   */
  playChime(options: AudioOptions = {}): void {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const localVol = options.volume ?? 1.0;
    const now = ctx.currentTime;

    try {
      // Base Tone
      const gain1 = createSoundChain(ctx, 0.05 * localVol);
      if (gain1) {
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(320, now);
        osc1.frequency.exponentialRampToValueAtTime(280, now + 0.12);
        gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
        osc1.connect(gain1);
        osc1.start(now);
        osc1.stop(now + 0.2);
      }

      // High Harmonics Confirm
      const gain2 = createSoundChain(ctx, 0.025 * localVol);
      if (gain2) {
        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(880, now + 0.05);
        osc2.frequency.exponentialRampToValueAtTime(660, now + 0.15);
        gain2.gain.setValueAtTime(0.025 * localVol * masterVolume, now + 0.05);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
        osc2.connect(gain2);
        osc2.start(now + 0.05);
        osc2.stop(now + 0.22);
      }
    } catch {
      // Fail gracefully
    }
  },

  /**
   * Synthesizes a cosmic sweeping departure whoosh.
   * 
   * @param options Configurations
   */
  playWhoosh(options: AudioOptions = {}): void {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const localVol = options.volume ?? 1.0;
    const now = ctx.currentTime;

    try {
      // Primary oscillator vast sweep
      const gain1 = createSoundChain(ctx, 0.0001 * localVol);
      if (gain1) {
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(180, now);
        osc1.frequency.exponentialRampToValueAtTime(40, now + 0.40);

        gain1.gain.linearRampToValueAtTime(0.1 * localVol * masterVolume, now + 0.03);
        gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.40);
        osc1.connect(gain1);
        osc1.start(now);
        osc1.stop(now + 0.42);
      }

      // Sub-bass warm drop
      const gain2 = createSoundChain(ctx, 0.0001 * localVol);
      if (gain2) {
        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(90, now);
        osc2.frequency.exponentialRampToValueAtTime(20, now + 0.40);

        gain2.gain.linearRampToValueAtTime(0.02 * localVol * masterVolume, now + 0.03);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.40);
        osc2.connect(gain2);
        osc2.start(now);
        osc2.stop(now + 0.42);
      }
    } catch {
      // Fail gracefully
    }
  },

  /**
   * Synthesizes a bandpass filtered white noise burst.
   * Perfect for CRT transitions and screen wipes.
   * 
   * @param options Configurations
   */
  playStatic(options: AudioOptions = {}): void {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const localVol = options.volume ?? 1.0;
    const now = ctx.currentTime;

    try {
      // Generate a small buffer of white noise
      const bufferSize = ctx.sampleRate * 0.08; // 80ms duration
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const gain = createSoundChain(ctx, 0.0001 * localVol);
      if (gain) {
        const source = ctx.createBufferSource();
        source.buffer = buffer;

        // Apply bandpass filter to isolate higher static register frequencies
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 2400;
        filter.Q.value = 0.8;

        gain.gain.linearRampToValueAtTime(0.04 * localVol * masterVolume, now + 0.02);
        gain.gain.linearRampToValueAtTime(0.0001, now + 0.08);

        source.connect(filter);
        filter.connect(gain);

        source.start(now);
        source.stop(now + 0.09);
      }
    } catch {
      // Fail gracefully
    }
  },

  /**
   * Tear down all contextual audio nodes and shut down AudioContext.
   */
  teardown(): void {
    try {
      if (audioCtx) {
        audioCtx.close().then(() => {
          audioCtx = null;
        });
      }
    } catch {
      audioCtx = null;
    }
  }
};
