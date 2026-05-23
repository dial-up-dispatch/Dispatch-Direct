// The Void — ambience synthesizer
// All audio is procedurally generated. No samples. No copyright.
import { getAudioContext } from './audio'

type AmbienceMode = 'off' | 'tonal' | 'textured' | 'both'

// Tonal chain
let tonalMasterGain: GainNode | null = null   // master fader — fades to absolute zero
let tonalOscsGain: GainNode | null = null     // intermediate — LFO modulates this
let tonalOscillators: OscillatorNode[] = []
let tonalLfo: OscillatorNode | null = null
let tonalLfoGain: GainNode | null = null

// Texture chain
let textureGain: GainNode | null = null
let textureSource: AudioBufferSourceNode | null = null
let textureFilter: BiquadFilterNode | null = null
let textureLfo: OscillatorNode | null = null
let textureLfoGain: GainNode | null = null

let currentMode: AmbienceMode = 'off'

function buildTonalChain(): void {
  const ctx = getAudioContext()

  // Master fader — this is what fades/mutes. Goes to absolute zero.
  tonalMasterGain = ctx.createGain()
  tonalMasterGain.gain.setValueAtTime(0, ctx.currentTime)
  tonalMasterGain.connect(ctx.destination)

  // Intermediate gain — LFO modulates this, not the master
  tonalOscsGain = ctx.createGain()
  tonalOscsGain.gain.setValueAtTime(0.05, ctx.currentTime)
  tonalOscsGain.connect(tonalMasterGain)

  // Three oscillators — deep open fifth, slightly detuned for organic beating
  const frequencies = [65.41, 98.00, 130.81] // C2, G2, C3
  const detunes = [2, -2, 1.5] // cents

  tonalOscillators = frequencies.map((freq, i) => {
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    osc.detune.setValueAtTime(detunes[i], ctx.currentTime)
    osc.connect(tonalOscsGain!)
    osc.start()
    return osc
  })

  // LFO modulates intermediate gain — 20s breathing cycle
  tonalLfo = ctx.createOscillator()
  tonalLfo.type = 'sine'
  tonalLfo.frequency.setValueAtTime(0.05, ctx.currentTime)

  tonalLfoGain = ctx.createGain()
  tonalLfoGain.gain.setValueAtTime(0.015, ctx.currentTime)

  tonalLfo.connect(tonalLfoGain)
  tonalLfoGain.connect(tonalOscsGain.gain) // modulates intermediate, not master
  tonalLfo.start()
}

function buildTextureChain(): void {
  const ctx = getAudioContext()

  // Generate brown noise buffer — 3 seconds, looped
  const bufferSize = ctx.sampleRate * 3
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)

  // Prime the accumulator — run 500 samples before recording
  let lastOut = 0
  for (let i = 0; i < 500; i++) {
    const white = Math.random() * 2 - 1
    lastOut = (lastOut + (0.02 * white)) / 1.02
  }

  // Record the settled noise
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1
    data[i] = (lastOut + (0.02 * white)) / 1.02
    lastOut = data[i]
    data[i] *= 3.5 // compensate for brown noise quietness
  }

  textureSource = ctx.createBufferSource()
  textureSource.buffer = buffer
  textureSource.loop = true

  // Low-pass filter — only deep frequencies pass
  textureFilter = ctx.createBiquadFilter()
  textureFilter.type = 'lowpass'
  textureFilter.frequency.setValueAtTime(280, ctx.currentTime)
  textureFilter.Q.value = 0.5

  textureGain = ctx.createGain()
  textureGain.gain.setValueAtTime(0, ctx.currentTime)
  textureGain.connect(ctx.destination)

  textureSource.connect(textureFilter)
  textureFilter.connect(textureGain)
  textureSource.start()

  // LFO — moves filter cutoff between ~190hz and ~370hz over 33 seconds
  textureLfo = ctx.createOscillator()
  textureLfo.type = 'sine'
  textureLfo.frequency.setValueAtTime(0.03, ctx.currentTime)

  textureLfoGain = ctx.createGain()
  textureLfoGain.gain.setValueAtTime(90, ctx.currentTime)

  textureLfo.connect(textureLfoGain)
  textureLfoGain.connect(textureFilter.frequency)
  textureLfo.start()
}

const FADE_IN_TIME = 8
const FADE_OUT_TIME = 6
const TONAL_PEAK = 0.08
const TEXTURE_PEAK = 0.06

function fadeTonalIn(): void {
  if (!tonalMasterGain) return
  const ctx = getAudioContext()
  const now = ctx.currentTime  // relative to NOW, not to mount time
  tonalMasterGain.gain.cancelScheduledValues(now)
  tonalMasterGain.gain.setValueAtTime(tonalMasterGain.gain.value, now)
  tonalMasterGain.gain.linearRampToValueAtTime(TONAL_PEAK, now + FADE_IN_TIME)
}

function fadeTonalOut(): Promise<void> {
  return new Promise(resolve => {
    if (!tonalMasterGain) { resolve(); return }
    const ctx = getAudioContext()
    const now = ctx.currentTime
    tonalMasterGain.gain.cancelScheduledValues(now)
    tonalMasterGain.gain.setValueAtTime(tonalMasterGain.gain.value, now)
    tonalMasterGain.gain.linearRampToValueAtTime(0, now + FADE_OUT_TIME)
    setTimeout(resolve, FADE_OUT_TIME * 1000)
  })
}

function fadeTextureIn(): void {
  if (!textureGain) return
  const ctx = getAudioContext()
  const now = ctx.currentTime
  textureGain.gain.cancelScheduledValues(now)
  textureGain.gain.setValueAtTime(textureGain.gain.value, now)
  textureGain.gain.linearRampToValueAtTime(TEXTURE_PEAK, now + FADE_IN_TIME)
}

function fadeTextureOut(): Promise<void> {
  return new Promise(resolve => {
    if (!textureGain) { resolve(); return }
    const ctx = getAudioContext()
    const now = ctx.currentTime
    textureGain.gain.cancelScheduledValues(now)
    textureGain.gain.setValueAtTime(textureGain.gain.value, now)
    textureGain.gain.linearRampToValueAtTime(0, now + FADE_OUT_TIME)
    setTimeout(resolve, FADE_OUT_TIME * 1000)
  })
}

function teardownTonal(): void {
  tonalOscillators.forEach(osc => {
    try { osc.stop(); osc.disconnect() } catch { /* ignore */ }
  })
  tonalOscillators = []
  try { tonalLfo?.stop(); tonalLfo?.disconnect() } catch { /* ignore */ }
  try { tonalLfoGain?.disconnect() } catch { /* ignore */ }
  try { tonalOscsGain?.disconnect() } catch { /* ignore */ }
  try { tonalMasterGain?.disconnect() } catch { /* ignore */ }
  tonalMasterGain = null
  tonalOscsGain = null
  tonalLfo = null
  tonalLfoGain = null
}

function teardownTexture(): void {
  try { textureSource?.stop(); textureSource?.disconnect() } catch { /* ignore */ }
  try { textureFilter?.disconnect() } catch { /* ignore */ }
  try { textureLfo?.stop(); textureLfo?.disconnect() } catch { /* ignore */ }
  try { textureLfoGain?.disconnect() } catch { /* ignore */ }
  try { textureGain?.disconnect() } catch { /* ignore */ }
  textureSource = null
  textureFilter = null
  textureLfo = null
  textureLfoGain = null
  textureGain = null
}

export async function setAmbienceMode(
  mode: AmbienceMode,
  muted: boolean
): Promise<void> {
  if (mode === currentMode) return

  const prevMode = currentMode
  currentMode = mode

  const needsTonal = mode === 'tonal' || mode === 'both'
  const needsTexture = mode === 'textured' || mode === 'both'
  const hadTonal = prevMode === 'tonal' || prevMode === 'both'
  const hadTexture = prevMode === 'textured' || prevMode === 'both'

  // Fade out outgoing chains concurrently — teardown after fade, guarded
  if (hadTonal && !needsTonal) {
    fadeTonalOut().then(() => {
      // Guard: only teardown if mode hasn't switched back
      if (currentMode !== 'tonal' && currentMode !== 'both') {
        teardownTonal()
      }
    })
  }

  if (hadTexture && !needsTexture) {
    fadeTextureOut().then(() => {
      if (currentMode !== 'textured' && currentMode !== 'both') {
        teardownTexture()
      }
    })
  }

  // Build and fade in incoming chains concurrently
  if (mode === 'off') return

  if (needsTonal && !tonalMasterGain) buildTonalChain()
  if (needsTexture && !textureGain) buildTextureChain()

  if (!muted) {
    if (needsTonal) fadeTonalIn()
    if (needsTexture) fadeTextureIn()
  }
}

export function setAmbienceMuted(muted: boolean): void {
  const ctx = getAudioContext()
  const now = ctx.currentTime

  if (muted) {
    // Fade to zero over 2 seconds — instant zero causes click
    if (tonalMasterGain) {
      tonalMasterGain.gain.cancelScheduledValues(now)
      tonalMasterGain.gain.setValueAtTime(tonalMasterGain.gain.value, now)
      tonalMasterGain.gain.linearRampToValueAtTime(0, now + 2)
    }
    if (textureGain) {
      textureGain.gain.cancelScheduledValues(now)
      textureGain.gain.setValueAtTime(textureGain.gain.value, now)
      textureGain.gain.linearRampToValueAtTime(0, now + 2)
    }
  } else {
    // Resume — fade back in if mode is active
    if (currentMode === 'off') return
    if (currentMode === 'tonal' || currentMode === 'both') fadeTonalIn()
    if (currentMode === 'textured' || currentMode === 'both') fadeTextureIn()
  }
}

export function stopAmbience(): void {
  fadeTonalOut().then(teardownTonal)
  fadeTextureOut().then(teardownTexture)
  currentMode = 'off'
}
