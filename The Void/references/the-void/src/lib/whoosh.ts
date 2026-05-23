import { getAudioContext } from './audio';

/**
 * Synthesizes a soft, cosmic departure "whoosh" sound using pure Web Audio API oscillators.
 * No asset files, libraries, or network queries are involved.
 * 
 * Specs:
 * - Two pure sine oscillators (Primary and Secondary running at exactly half frequency).
 * - Frequency sweep: 180Hz down to 40Hz (Primary), 90Hz down to 20Hz (Secondary).
 * - Gain curve: 30ms linear fade-in to peak, followed by a 370ms smooth exponential decay.
 * - Silent catch block to absorb audio context startup exceptions gracefully.
 * 
 * @param soundEnabled Global mute check parameter.
 */
export function playWhoosh(soundEnabled: boolean = true): void {
  if (!soundEnabled) return;
  
  try {
    const audioCtx = getAudioContext();
    const now = audioCtx.currentTime;
    
    // Primary Oscillator: Vast, hollow base tone
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(180, now);
    osc1.frequency.exponentialRampToValueAtTime(40, now + 0.40);
    
    // Gain envelope 1: 30ms fade-in to 0.12, decay to 0.0001 over remaining 370ms
    gain1.gain.setValueAtTime(0.0001, now);
    gain1.gain.linearRampToValueAtTime(0.12, now + 0.03);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.40);
    
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    
    // Secondary Oscillator: Sub-harmonic hum (exactly half frequency and 20% gain)
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(90, now);
    osc2.frequency.exponentialRampToValueAtTime(20, now + 0.40);
    
    // Gain envelope 2: 30ms fade-in to 0.024, decay to 0.0001 over remaining 370ms
    gain2.gain.setValueAtTime(0.0001, now);
    gain2.gain.linearRampToValueAtTime(0.024, now + 0.03);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.40);
    
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    
    // Playback schedule (oscillators run up to now + 0.42 to allow the decay tail to finish)
    osc1.start(now);
    osc1.stop(now + 0.42);
    
    osc2.start(now);
    osc2.stop(now + 0.42);
  } catch (e) {
    // Silence audio exceptions per specification
    console.warn('Audio whoosh failed:', e);
  }
}
