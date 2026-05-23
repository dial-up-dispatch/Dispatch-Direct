// Static pulse — brief CRT charge sound on settings reveal
import { getAudioContext } from './audio'

export function playStaticPulse(soundEnabled: boolean = true): void {
  if (!soundEnabled) return
  try {
    const audioCtx = getAudioContext()
    const now = audioCtx.currentTime

    // Bandpass-filtered noise burst
    const bufferSize = audioCtx.sampleRate * 0.08 // 80ms of noise
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const source = audioCtx.createBufferSource()
    source.buffer = buffer

    // Bandpass filter — center around 2400hz, gives it a thin electronic quality
    const filter = audioCtx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 2400
    filter.Q.value = 0.8

    // Gain envelope — very quiet, brief fade in and out
    const gain = audioCtx.createGain()
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.04, now + 0.02)
    gain.gain.linearRampToValueAtTime(0, now + 0.08)

    source.connect(filter)
    filter.connect(gain)
    gain.connect(audioCtx.destination)

    source.start(now)
    source.stop(now + 0.09)
  } catch {
    // Silent fail
  }
}
