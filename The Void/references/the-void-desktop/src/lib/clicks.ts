import { getAudioContext } from './audio';

/**
 * Mechanical typewriter click synthesizer.
 * Generates organic typewriter keyboard sound elements dynamically using the Web Audio API.
 * 
 * @param pitch Dynamic pitch multiplier to introduce realistic mechanical variation.
 * @param soundEnabled Global mute flag (if false, returns immediately).
 */
export function playClick(pitch: number = 1.0, soundEnabled = true): void {
  if (!soundEnabled) return;
  try {
    const audioCtx = getAudioContext();
    const now = audioCtx.currentTime;

    // High frequency mechanical switch click
    const highOsc = audioCtx.createOscillator();
    const highGain = audioCtx.createGain();
    highOsc.type = 'sine';
    highOsc.frequency.setValueAtTime(2000 * pitch, now);
    highOsc.frequency.exponentialRampToValueAtTime(1200 * pitch, now + 0.01);
    highGain.gain.setValueAtTime(0.03, now);
    highGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.01);
    highOsc.connect(highGain);
    highGain.connect(audioCtx.destination);
    highOsc.start(now);
    highOsc.stop(now + 0.015);

    // Low frequency mechanical structural clack
    const lowOsc = audioCtx.createOscillator();
    const lowGain = audioCtx.createGain();
    lowOsc.type = 'triangle';
    lowOsc.frequency.setValueAtTime(140 * pitch, now);
    lowOsc.frequency.exponentialRampToValueAtTime(80 * pitch, now + 0.035);
    lowGain.gain.setValueAtTime(0.15, now);
    lowGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
    lowOsc.connect(lowGain);
    lowGain.connect(audioCtx.destination);
    lowOsc.start(now);
    lowOsc.stop(now + 0.04);
  } catch (e) {
    console.warn('Audio click failed:', e);
  }
}
