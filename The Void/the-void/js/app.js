// The Void — js/app.js
// Phase 2: Logic, Interaction & Audio

// ==========================================
// 1. Settings System & State Management
// ==========================================

const DEFAULT_SETTINGS = {
  theme: 'expanse',
  receptionMode: 'silence',
  retention: false,
  muted: false,
  ambienceMode: 'off'
};

let settings = { ...DEFAULT_SETTINGS };

function loadSettings() {
  try {
    const raw = localStorage.getItem('void_settings');
    if (raw) {
      const parsed = JSON.parse(raw);
      // Shallow merge to guard against missing fields in future migrations
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (err) {
    console.warn('Failed to load settings, falling back to defaults:', err);
  }
  return { ...DEFAULT_SETTINGS };
}

function saveSettings(newSettings) {
  try {
    localStorage.setItem('void_settings', JSON.stringify(newSettings));
  } catch (err) {
    console.warn('Failed to save settings:', err);
  }
}

function applyTheme(theme) {
  const crtShell = document.getElementById('crt-shell');
  if (!crtShell) return;
  crtShell.classList.remove('theme-expanse', 'theme-deep', 'theme-crimson-nebula');
  crtShell.classList.add(`theme-${theme}`);
}

function setSelected(buttonEl, isSelected) {
  if (!buttonEl) return;
  buttonEl.classList.toggle('settings-option--selected', isSelected);
  const indicator = buttonEl.querySelector('.settings-option-indicator');
  if (indicator) {
    indicator.textContent = isSelected ? '●' : '○';
  }
}

function applySettings(newSettings) {
  settings = newSettings;
  applyTheme(settings.theme);

  // Sync Option 1: Signal Themes
  setSelected(document.getElementById('theme-expanse-btn'), settings.theme === 'expanse');
  setSelected(document.getElementById('theme-deep-btn'), settings.theme === 'deep');
  setSelected(document.getElementById('theme-crimson-nebula-btn'), settings.theme === 'crimson-nebula');

  // Sync Option 2: Reception Mode
  setSelected(document.getElementById('reception-silence-btn'), settings.receptionMode === 'silence');
  setSelected(document.getElementById('reception-acknowledgment-btn'), settings.receptionMode === 'acknowledgment');

  // Sync Option 3: Retention Count
  setSelected(document.getElementById('retention-forget-btn'), settings.retention === false);
  setSelected(document.getElementById('retention-remember-btn'), settings.retention === true);

  // Archive Block display visibility
  const archiveBlock = document.getElementById('archive-block');
  if (archiveBlock) {
    if (settings.retention) {
      archiveBlock.classList.remove('hidden');
      renderArchive();
    } else {
      archiveBlock.classList.add('hidden');
    }
  }

  // Sync Option 4: Sound Preference
  setSelected(document.getElementById('sound-ambient-btn'), settings.muted === false);
  setSelected(document.getElementById('sound-silent-btn'), settings.muted === true);

  // Sync Option 5: Ambient Drone
  setSelected(document.getElementById('ambience-off-btn'), settings.ambienceMode === 'off');
  setSelected(document.getElementById('ambience-tonal-btn'), settings.ambienceMode === 'tonal');
  setSelected(document.getElementById('ambience-textured-btn'), settings.ambienceMode === 'textured');
  setSelected(document.getElementById('ambience-both-btn'), settings.ambienceMode === 'both');
}


// ==========================================
// 2. Date Formatting Native Utility
// ==========================================

function formatFullDate(isoString) {
  if (!isoString) return '—';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).toLowerCase();
}

function formatRelativeDate(isoString) {
  if (!isoString) return '—';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '—';
  
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === now.toDateString()) return 'today';
  if (date.toDateString() === yesterday.toDateString()) return 'yesterday';

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).toLowerCase();
}

function renderArchive() {
  const countDisplay = document.getElementById('archive-count');
  const firstDisplay = document.getElementById('first-transmission-time');
  const recentDisplay = document.getElementById('most-recent-time');

  if (countDisplay) {
    const rawCount = localStorage.getItem('void_count');
    countDisplay.textContent = rawCount ? parseInt(rawCount, 10) : 0;
  }

  if (firstDisplay) {
    const rawFirst = localStorage.getItem('void_first_transmission');
    firstDisplay.textContent = `first transmission: ${formatFullDate(rawFirst)}`;
  }

  if (recentDisplay) {
    const rawRecent = localStorage.getItem('void_most_recent');
    recentDisplay.textContent = `most recent: ${formatRelativeDate(rawRecent)}`;
  }
}

function incrementRetentionCount() {
  try {
    const rawCount = localStorage.getItem('void_count');
    const current = rawCount ? parseInt(rawCount, 10) : 0;
    localStorage.setItem('void_count', String(current + 1));

    if (!localStorage.getItem('void_first_transmission')) {
      localStorage.setItem('void_first_transmission', new Date().toISOString());
    }
    localStorage.setItem('void_most_recent', new Date().toISOString());

    renderArchive();
  } catch (err) {
    console.warn('Failed to update retention counts:', err);
  }
}


// ==========================================
// 3. Screen Transitions
// ==========================================

let isWiping = false;

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const WIPE_DURATION = () => prefersReducedMotion() ? 200 : 400;
const WIPE_MIDPOINT = () => prefersReducedMotion() ? 100 : 200;

function triggerTransition(showSettings, direction) {
  if (isWiping) return;
  isWiping = true;

  const wipeEl = document.getElementById('screen-wipe');
  if (!wipeEl) return;

  const activeWipeClass = direction === 'wipe-up' ? 'wipe-up' : 'wipe-down';

  // Apply classes to begin shutter sweep
  wipeEl.classList.remove('hidden', 'wipe-up', 'wipe-down');
  wipeEl.classList.add(activeWipeClass);

  // Swap screens at screen-wipe midpoint (maximum visual coverage)
  setTimeout(() => {
    const mainScreen = document.getElementById('main-screen');
    const settingsScreen = document.getElementById('settings-screen');

    if (showSettings) {
      if (mainScreen) mainScreen.classList.add('hidden');
      if (settingsScreen) settingsScreen.classList.remove('hidden');
    } else {
      if (settingsScreen) settingsScreen.classList.add('hidden');
      if (mainScreen) mainScreen.classList.remove('hidden');
    }
  }, WIPE_MIDPOINT());

  // End transition, restore interactions
  setTimeout(() => {
    wipeEl.classList.add('hidden');
    wipeEl.classList.remove('wipe-up', 'wipe-down');
    isWiping = false;
  }, WIPE_DURATION());
}

function openSettings() {
  playStaticPulse(!settings.muted);
  triggerTransition(true, 'wipe-up');
}

function closeSettings() {
  triggerTransition(false, 'wipe-down');
}


// ==========================================
// 4. Response Library (from references/responses.ts)
// ==========================================

const quietWitness = [
  "received.",
  "it was heard.",
  "noted. it joins the others.",
  "acknowledged."
];

const releaseConfirmation = [
  "you don't need to carry that one anymore.",
  "it's handled.",
  "it left you. that's what matters.",
  "it no longer belongs to you."
];

const ancientCosmic = [
  "the void has been holding things since before language existed. this one is safe.",
  "it joins everything that was too big to say out loud.",
  "some things just need somewhere to land.",
  "it settles somewhere very deep."
];

const dryWry = [
  "filed under: things that felt enormous at 2am.",
  "acknowledged. the void remains unmoved. so can you.",
  "the void has received stranger. considerably stranger.",
  "it will not follow you back."
];

const allResponses = [
  ...quietWitness,
  ...releaseConfirmation,
  ...ancientCosmic,
  ...dryWry
];

let lastResponse = null;

function pickResponse() {
  const available = allResponses.filter(r => r !== lastResponse);
  const picked = available[Math.floor(Math.random() * available.length)] ?? allResponses[0];
  lastResponse = picked;
  return picked;
}


// ==========================================
// 5. The Release Ritual & Textarea Logic
// ==========================================

let isSending = false;
let isFocused = false;
let responseTimeout = null;
let responseHideTimeout = null;

function updateCursorVisibility() {
  const voidInput = document.getElementById('void-input');
  const cursorWrapper = document.getElementById('blinking-cursor-wrapper');
  if (!voidInput || !cursorWrapper) return;

  const valueEmpty = voidInput.value.length === 0;
  if (valueEmpty && !isFocused) {
    cursorWrapper.style.opacity = '1';
  } else {
    cursorWrapper.style.opacity = '0';
  }
}

function showResponse() {
  const display = document.getElementById('response-display');
  if (!display) return;

  if (responseTimeout) clearTimeout(responseTimeout);
  if (responseHideTimeout) clearTimeout(responseHideTimeout);

  display.textContent = pickResponse();
  display.classList.remove('hidden', 'response-fade-out');
  display.classList.add('response-fade-in');

  // Force reflow to kickstart CSS animations cleanly
  void display.offsetWidth;

  responseTimeout = setTimeout(() => {
    hideResponse();
  }, 3000);
}

function hideResponse(instant = false) {
  const display = document.getElementById('response-display');
  if (!display || display.classList.contains('hidden')) return;

  if (responseTimeout) clearTimeout(responseTimeout);
  if (responseHideTimeout) clearTimeout(responseHideTimeout);

  if (instant) {
    display.classList.add('hidden');
    display.classList.remove('response-fade-in', 'response-fade-out');
    display.textContent = '';
  } else {
    display.classList.remove('response-fade-in');
    display.classList.add('response-fade-out');

    // Force reflow
    void display.offsetWidth;

    responseHideTimeout = setTimeout(() => {
      display.classList.add('hidden');
      display.classList.remove('response-fade-out');
      display.textContent = '';
    }, 400);
  }
}

function handleSend() {
  const voidInput = document.getElementById('void-input');
  if (isSending || !voidInput || !voidInput.value.trim()) return;

  const inputContainer = document.getElementById('input-container');
  const dissolveOverlay = document.getElementById('dissolve-overlay');
  const dissolveText = document.getElementById('dissolve-text');
  const sendBtn = document.getElementById('send-btn');
  
  if (!inputContainer || !dissolveOverlay || !dissolveText) return;

  const snapshot = voidInput.value;
  const height = inputContainer.getBoundingClientRect().height;

  // Lock input container height to prevent physical page jump
  inputContainer.style.height = `${height}px`;
  dissolveOverlay.style.height = `${height}px`;

  // Set visual copy for dissolve
  dissolveText.textContent = snapshot;

  // Physical content purge for total privacy compliance
  voidInput.value = '';
  voidInput.style.height = 'auto'; // Reset auto-resize height instantly
  voidInput.disabled = true;       // Avoid interaction lock collisions
  isSending = true;

  if (sendBtn) {
    sendBtn.classList.add('is-disabled');
  }

  // Fade out acknowledgment overlay if currently on screen
  hideResponse(true);

  // Force CSS keyframe reflow on both scanline sweep & character blur
  const scanline = dissolveOverlay.querySelector('.dissolve-scanline');
  if (scanline) {
    scanline.classList.remove('animate-scanline-sweep');
    void scanline.offsetWidth; // force redraw
    scanline.classList.add('animate-scanline-sweep');
  }

  dissolveText.classList.remove('animate-text-dissolve');
  void dissolveText.offsetWidth; // force redraw
  dissolveText.classList.add('animate-text-dissolve');

  // Trigger reveal & departure synthesized sound
  dissolveOverlay.classList.remove('hidden');
  playWhoosh(!settings.muted);

  // Complete transmission block after 420ms (sweep duration + cushion)
  setTimeout(() => {
    dissolveOverlay.classList.add('hidden');
    dissolveText.textContent = '';
    inputContainer.style.removeProperty('height');

    isSending = false;
    voidInput.disabled = false;
    if (sendBtn) {
      sendBtn.classList.remove('is-disabled');
    }
    voidInput.focus();
    updateCursorVisibility();

    // Trigger Acknowledgment
    if (settings.receptionMode === 'acknowledgment') {
      showResponse();
    }

    // Increment Counts
    if (settings.retention) {
      incrementRetentionCount();
    }
  }, 420);
}


// ==========================================
// 6. Generative Audio Engine (from references/src/lib/)
// ==========================================

let sharedAudioCtx = null;

function getAudioContext() {
  if (!sharedAudioCtx) {
    sharedAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch((err) => {
      console.warn('Failed to resume AudioContext:', err);
    });
  }
  return sharedAudioCtx;
}

// Clicks: mechanical tactile synthesizer (from clicks.ts)
function playClick(pitch = 1.0, soundEnabled = true) {
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

// Whoosh: cosmic sweep departure synthesizer (from whoosh.ts)
function playWhoosh(soundEnabled = true) {
  if (!soundEnabled) return;
  try {
    const audioCtx = getAudioContext();
    const now = audioCtx.currentTime;
    
    // Primary Oscillator: Vast base tone
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(180, now);
    osc1.frequency.exponentialRampToValueAtTime(40, now + 0.40);
    gain1.gain.setValueAtTime(0.0001, now);
    gain1.gain.linearRampToValueAtTime(0.12, now + 0.03);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.40);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    
    // Secondary Oscillator: Sub-harmonic hum
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(90, now);
    osc2.frequency.exponentialRampToValueAtTime(20, now + 0.40);
    gain2.gain.setValueAtTime(0.0001, now);
    gain2.gain.linearRampToValueAtTime(0.024, now + 0.03);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.40);
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    
    osc1.start(now);
    osc1.stop(now + 0.42);
    osc2.start(now);
    osc2.stop(now + 0.42);
  } catch (e) {
    console.warn('Audio whoosh failed:', e);
  }
}

// Static Pulse: CRT charge transition sound (from staticPulse.ts)
function playStaticPulse(soundEnabled = true) {
  if (!soundEnabled) return;
  try {
    const audioCtx = getAudioContext();
    const now = audioCtx.currentTime;

    const bufferSize = audioCtx.sampleRate * 0.08; // 80ms
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = audioCtx.createBufferSource();
    source.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 2400;
    filter.Q.value = 0.8;

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.04, now + 0.02);
    gain.gain.linearRampToValueAtTime(0, now + 0.08);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    source.start(now);
    source.stop(now + 0.09);
  } catch (e) {
    console.warn('Audio static pulse failed:', e);
  }
}

// Ambience: generative multi-mode background synth (from ambience.ts)
let tonalMasterGain = null;
let tonalOscsGain = null;
let tonalOscillators = [];
let tonalLfo = null;
let tonalLfoGain = null;

let textureGain = null;
let textureSource = null;
let textureFilter = null;
let textureLfo = null;
let textureLfoGain = null;

let currentMode = 'off';

const FADE_IN_TIME = 8;
const FADE_OUT_TIME = 6;
const TONAL_PEAK = 0.08;
const TEXTURE_PEAK = 0.06;

function buildTonalChain() {
  const ctx = getAudioContext();
  
  tonalMasterGain = ctx.createGain();
  tonalMasterGain.gain.setValueAtTime(0, ctx.currentTime);
  tonalMasterGain.connect(ctx.destination);

  tonalOscsGain = ctx.createGain();
  tonalOscsGain.gain.setValueAtTime(0.05, ctx.currentTime);
  tonalOscsGain.connect(tonalMasterGain);

  const frequencies = [65.41, 98.00, 130.81]; // C2, G2, C3
  const detunes = [2, -2, 1.5]; // cents detuning for mechanical beating

  tonalOscillators = frequencies.map((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.detune.setValueAtTime(detunes[i], ctx.currentTime);
    osc.connect(tonalOscsGain);
    osc.start();
    return osc;
  });

  // Breathing LFO — 20s cycle
  tonalLfo = ctx.createOscillator();
  tonalLfo.type = 'sine';
  tonalLfo.frequency.setValueAtTime(0.05, ctx.currentTime);

  tonalLfoGain = ctx.createGain();
  tonalLfoGain.gain.setValueAtTime(0.015, ctx.currentTime);

  tonalLfo.connect(tonalLfoGain);
  tonalLfoGain.connect(tonalOscsGain.gain);
  tonalLfo.start();
}

function buildTextureChain() {
  const ctx = getAudioContext();

  // Procedural Brown Noise Buffer — 3 seconds
  const bufferSize = ctx.sampleRate * 3;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  // Stabilize browser buffer accumulator
  let lastOut = 0;
  for (let i = 0; i < 500; i++) {
    const white = Math.random() * 2 - 1;
    lastOut = (lastOut + (0.02 * white)) / 1.02;
  }

  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    data[i] = (lastOut + (0.02 * white)) / 1.02;
    lastOut = data[i];
    data[i] *= 3.5;
  }

  textureSource = ctx.createBufferSource();
  textureSource.buffer = buffer;
  textureSource.loop = true;

  textureFilter = ctx.createBiquadFilter();
  textureFilter.type = 'lowpass';
  textureFilter.frequency.setValueAtTime(280, ctx.currentTime);
  textureFilter.Q.value = 0.5;

  textureGain = ctx.createGain();
  textureGain.gain.setValueAtTime(0, ctx.currentTime);
  textureGain.connect(ctx.destination);

  textureSource.connect(textureFilter);
  textureFilter.connect(textureGain);
  textureSource.start();

  // Sweep filter LFO — 33s cycle
  textureLfo = ctx.createOscillator();
  textureLfo.type = 'sine';
  textureLfo.frequency.setValueAtTime(0.03, ctx.currentTime);

  textureLfoGain = ctx.createGain();
  textureLfoGain.gain.setValueAtTime(90, ctx.currentTime);

  textureLfo.connect(textureLfoGain);
  textureLfoGain.connect(textureFilter.frequency);
  textureLfo.start();
}

function fadeTonalIn() {
  if (!tonalMasterGain) return;
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  tonalMasterGain.gain.cancelScheduledValues(now);
  tonalMasterGain.gain.setValueAtTime(tonalMasterGain.gain.value, now);
  tonalMasterGain.gain.linearRampToValueAtTime(TONAL_PEAK, now + FADE_IN_TIME);
}

function fadeTonalOut() {
  return new Promise((resolve) => {
    if (!tonalMasterGain) { resolve(); return; }
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    tonalMasterGain.gain.cancelScheduledValues(now);
    tonalMasterGain.gain.setValueAtTime(tonalMasterGain.gain.value, now);
    tonalMasterGain.gain.linearRampToValueAtTime(0, now + FADE_OUT_TIME);
    setTimeout(resolve, FADE_OUT_TIME * 1000);
  });
}

function fadeTextureIn() {
  if (!textureGain) return;
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  textureGain.gain.cancelScheduledValues(now);
  textureGain.gain.setValueAtTime(textureGain.gain.value, now);
  textureGain.gain.linearRampToValueAtTime(TEXTURE_PEAK, now + FADE_IN_TIME);
}

function fadeTextureOut() {
  return new Promise((resolve) => {
    if (!textureGain) { resolve(); return; }
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    textureGain.gain.cancelScheduledValues(now);
    textureGain.gain.setValueAtTime(textureGain.gain.value, now);
    textureGain.gain.linearRampToValueAtTime(0, now + FADE_OUT_TIME);
    setTimeout(resolve, FADE_OUT_TIME * 1000);
  });
}

function teardownTonal() {
  tonalOscillators.forEach((osc) => {
    try { osc.stop(); osc.disconnect(); } catch (e) {}
  });
  tonalOscillators = [];
  try { tonalLfo?.stop(); tonalLfo?.disconnect(); } catch (e) {}
  try { tonalLfoGain?.disconnect(); } catch (e) {}
  try { tonalOscsGain?.disconnect(); } catch (e) {}
  try { tonalMasterGain?.disconnect(); } catch (e) {}
  tonalMasterGain = null;
  tonalOscsGain = null;
  tonalLfo = null;
  tonalLfoGain = null;
}

function teardownTexture() {
  try { textureSource?.stop(); textureSource?.disconnect(); } catch (e) {}
  try { textureFilter?.disconnect(); } catch (e) {}
  try { textureLfo?.stop(); textureLfo?.disconnect(); } catch (e) {}
  try { textureLfoGain?.disconnect(); } catch (e) {}
  try { textureGain?.disconnect(); } catch (e) {}
  textureSource = null;
  textureFilter = null;
  textureLfo = null;
  textureLfoGain = null;
  textureGain = null;
}

function setAmbienceMode(mode, muted) {
  if (mode === currentMode) return Promise.resolve();

  const prevMode = currentMode;
  currentMode = mode;

  const needsTonal = mode === 'tonal' || mode === 'both';
  const needsTexture = mode === 'textured' || mode === 'both';
  const hadTonal = prevMode === 'tonal' || prevMode === 'both';
  const hadTexture = prevMode === 'textured' || prevMode === 'both';

  // Fade out outgoing chains concurrently
  if (hadTonal && !needsTonal) {
    fadeTonalOut().then(() => {
      if (currentMode !== 'tonal' && currentMode !== 'both') {
        teardownTonal();
      }
    });
  }

  if (hadTexture && !needsTexture) {
    fadeTextureOut().then(() => {
      if (currentMode !== 'textured' && currentMode !== 'both') {
        teardownTexture();
      }
    });
  }

  if (mode === 'off') return Promise.resolve();

  if (needsTonal && !tonalMasterGain) buildTonalChain();
  if (needsTexture && !textureGain) buildTextureChain();

  if (!muted) {
    if (needsTonal) fadeTonalIn();
    if (needsTexture) fadeTextureIn();
  }

  return Promise.resolve();
}

function setAmbienceMuted(muted) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  if (muted) {
    // 2s linear fade-out to prevent instant speaker pop click
    if (tonalMasterGain) {
      tonalMasterGain.gain.cancelScheduledValues(now);
      tonalMasterGain.gain.setValueAtTime(tonalMasterGain.gain.value, now);
      tonalMasterGain.gain.linearRampToValueAtTime(0, now + 2);
    }
    if (textureGain) {
      textureGain.gain.cancelScheduledValues(now);
      textureGain.gain.setValueAtTime(textureGain.gain.value, now);
      textureGain.gain.linearRampToValueAtTime(0, now + 2);
    }
  } else {
    if (currentMode === 'off') return;
    if (currentMode === 'tonal' || currentMode === 'both') fadeTonalIn();
    if (currentMode === 'textured' || currentMode === 'both') fadeTextureIn();
  }
}

function stopAmbience() {
  fadeTonalOut().then(teardownTonal);
  fadeTextureOut().then(teardownTexture);
  currentMode = 'off';
}


// ==========================================
// 7. Initialization & Event Listeners
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  const loadedSettings = loadSettings();
  applySettings(loadedSettings);

  // Initialize Input Element Behaviors
  const voidInput = document.getElementById('void-input');
  if (voidInput) {
    voidInput.focus();
    updateCursorVisibility();

    // Auto-resize + cursor visibility check + new input response dismiss
    voidInput.addEventListener('input', (e) => {
      voidInput.style.height = 'auto';
      voidInput.style.height = `${voidInput.scrollHeight}px`;
      updateCursorVisibility();

      // If typing while acknowledgment text is visible, fade it out instantly
      const display = document.getElementById('response-display');
      if (display && !display.classList.contains('hidden')) {
        hideResponse();
      }
    });

    voidInput.addEventListener('focus', () => {
      isFocused = true;
      updateCursorVisibility();
    });

    voidInput.addEventListener('blur', () => {
      isFocused = false;
      updateCursorVisibility();
    });

    // Keys audio clacks + Enter transmissions
    voidInput.addEventListener('keydown', (e) => {
      const isModifier = e.ctrlKey || e.altKey || e.metaKey;
      const isSystemKey = [
        'Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Escape',
        'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
        'Tab', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6',
        'F7', 'F8', 'F9', 'F10', 'F11', 'F12'
      ].includes(e.key);

      if (!isModifier && !isSystemKey) {
        // tactile clack pitch variation
        playClick(0.95 + Math.random() * 0.1, !settings.muted);
      }

      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });
  }

  // Send Trigger click
  const sendBtn = document.getElementById('send-btn');
  if (sendBtn) {
    sendBtn.addEventListener('click', handleSend);
  }

  // Dashboard Transitions
  const openBtn = document.getElementById('settings-open-btn');
  if (openBtn) {
    openBtn.addEventListener('click', openSettings);
  }

  const closeBtn = document.getElementById('settings-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeSettings);
  }

  // Escape key trapping
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const confirmBlock = document.getElementById('archive-confirm-block');
      const clearBtn = document.getElementById('archive-clear-btn');
      const settingsScreen = document.getElementById('settings-screen');

      if (confirmBlock && !confirmBlock.classList.contains('hidden')) {
        // Trap Esc to close warning modal first
        confirmBlock.classList.add('hidden');
        if (clearBtn) clearBtn.classList.remove('hidden');
      } else if (settingsScreen && !settingsScreen.classList.contains('hidden')) {
        // Return to panel
        closeSettings();
      }
    }
  });

  // Global Keyboard Mute (M / m)
  window.addEventListener('keydown', (e) => {
    if ((e.key === 'm' || e.key === 'M') && e.target?.id !== 'void-input') {
      const updated = { ...settings, muted: !settings.muted };
      saveSettings(updated);
      applySettings(updated);
      setAmbienceMuted(updated.muted);
    }
  });

  // ==========================================
  // Settings Screen Button Click Listeners
  // ==========================================

  // Option 1: Themes
  const themeButtons = ['theme-expanse-btn', 'theme-deep-btn', 'theme-crimson-nebula-btn'];
  themeButtons.forEach((id) => {
    const btn = document.getElementById(id);
    btn?.addEventListener('click', () => {
      const val = btn.dataset.value;
      const updated = { ...settings, theme: val };
      saveSettings(updated);
      applySettings(updated);
    });
  });

  // Option 2: Reception Mode
  const receptionButtons = ['reception-silence-btn', 'reception-acknowledgment-btn'];
  receptionButtons.forEach((id) => {
    const btn = document.getElementById(id);
    btn?.addEventListener('click', () => {
      const val = btn.dataset.value;
      const updated = { ...settings, receptionMode: val };
      saveSettings(updated);
      applySettings(updated);
    });
  });

  // Option 3: Retention Mode (Remember/Forget)
  const retentionButtons = ['retention-forget-btn', 'retention-remember-btn'];
  retentionButtons.forEach((id) => {
    const btn = document.getElementById(id);
    btn?.addEventListener('click', () => {
      const val = btn.dataset.value === 'true';
      const updated = { ...settings, retention: val };
      saveSettings(updated);
      applySettings(updated);
    });
  });

  // Option 4: Sound Preference (Ambient/Silent)
  const soundButtons = ['sound-ambient-btn', 'sound-silent-btn'];
  soundButtons.forEach((id) => {
    const btn = document.getElementById(id);
    btn?.addEventListener('click', () => {
      const val = btn.dataset.value === 'true';
      const updated = { ...settings, muted: val };
      saveSettings(updated);
      applySettings(updated);
      setAmbienceMuted(updated.muted);
    });
  });

  // Option 5: Generative Ambience Mode
  const ambienceButtons = ['ambience-off-btn', 'ambience-tonal-btn', 'ambience-textured-btn', 'ambience-both-btn'];
  ambienceButtons.forEach((id) => {
    const btn = document.getElementById(id);
    btn?.addEventListener('click', () => {
      const val = btn.dataset.value;
      const updated = { ...settings, ambienceMode: val };
      saveSettings(updated);
      applySettings(updated);
      setAmbienceMode(updated.ambienceMode, updated.muted);
    });
  });

  // Archive interactions
  const clearBtn = document.getElementById('archive-clear-btn');
  const confirmBlock = document.getElementById('archive-confirm-block');
  const confirmYes = document.getElementById('archive-confirm-yes');
  const confirmNo = document.getElementById('archive-confirm-no');

  clearBtn?.addEventListener('click', () => {
    clearBtn.classList.add('hidden');
    confirmBlock?.classList.remove('hidden');
  });

  confirmNo?.addEventListener('click', () => {
    confirmBlock?.classList.add('hidden');
    clearBtn?.classList.remove('hidden');
  });

  confirmYes?.addEventListener('click', () => {
    localStorage.removeItem('void_count');
    localStorage.removeItem('void_first_transmission');
    localStorage.removeItem('void_most_recent');

    // Instantly reset DOM metrics
    const countDisplay = document.getElementById('archive-count');
    if (countDisplay) countDisplay.textContent = '0';

    const firstDisplay = document.getElementById('first-transmission-time');
    if (firstDisplay) firstDisplay.textContent = 'first transmission: —';

    const recentDisplay = document.getElementById('most-recent-time');
    if (recentDisplay) recentDisplay.textContent = 'most recent: —';

    confirmBlock?.classList.add('hidden');
    clearBtn?.classList.remove('hidden');
  });

  // ==========================================
  // 8. One-Time Interaction Wake listener
  // ==========================================
  
  function initAudio() {
    // Wake or construct context
    getAudioContext();

    // Immediately kickstart breathing layers if user had it turned on previously
    setAmbienceMode(settings.ambienceMode, settings.muted);

    // Clean up listeners immediately to avoid redundant fires
    document.body.removeEventListener('click', initAudio);
    document.body.removeEventListener('keydown', initAudio);
  }

  document.body.addEventListener('click', initAudio);
  document.body.addEventListener('keydown', initAudio);
});
