// Brain Dump Inbox — app.js
// This file is the nervous system. It makes things happen.

const db = {
    get: function(keys, callback) {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            chrome.storage.local.get(keys, callback);
        } else {
            const res = {};
            keys.forEach(function(k) {
                const val = localStorage.getItem(k);
                try { res[k] = val ? JSON.parse(val) : null; } catch(e) { res[k] = val; }
            });
            callback(res);
        }
    },
    set: function(items) {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            chrome.storage.local.set(items);
        } else {
            Object.keys(items).forEach(function(k) {
                const val = typeof items[k] === 'object' ? JSON.stringify(items[k]) : items[k];
                localStorage.setItem(k, val);
            });
        }
    }
};

const dumpInput = document.getElementById('dumpInput');
const dumpButton = document.getElementById('dumpButton');
const pileList = document.getElementById('pileList');

let dumps = [];

// === Mechanical Typewriter Sound Synthesizer (Web Audio API) ===
let audioCtx = null;
let soundEnabled = true;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playClick(pitch = 1.0) {
    if (!soundEnabled) return;
    try {
        initAudio();
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const now = audioCtx.currentTime;

        // 1. High frequency mechanical switches click
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

        // 2. Lower frequency mechanical structural clack
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
        console.warn("Audio Context failed to load: ", e);
    }
}

function playReceived() {
    if (!soundEnabled) return;
    try {
        initAudio();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const now = audioCtx.currentTime;

        const osc1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(320, now);
        osc1.frequency.exponentialRampToValueAtTime(280, now + 0.12);
        gain1.gain.setValueAtTime(0.06, now);
        gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
        osc1.connect(gain1);
        gain1.connect(audioCtx.destination);
        osc1.start(now);
        osc1.stop(now + 0.2);

        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(880, now + 0.05);
        osc2.frequency.exponentialRampToValueAtTime(660, now + 0.15);
        gain2.gain.setValueAtTime(0.03, now + 0.05);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.start(now + 0.05);
        osc2.stop(now + 0.22);
    } catch(e) {
        console.warn('Received sound failed:', e);
    }
}

// === Audio Toggle Controls (Sound On / Off Buttons) ===
const soundOnBtn = document.getElementById('soundOn');
const soundOffBtn = document.getElementById('soundOff');

function updateSoundUI() {
    if (!soundOnBtn || !soundOffBtn) return;
    if (soundEnabled) {
        soundOnBtn.classList.add('active');
        soundOffBtn.classList.remove('active');
    } else {
        soundOffBtn.classList.add('active');
        soundOnBtn.classList.remove('active');
    }
}

if (soundOnBtn) {
    soundOnBtn.addEventListener('click', function() {
        soundEnabled = true;
        db.set({ 'braindump-sound': 'on' });
        updateSoundUI();
        playClick(1.2);
        triggerReaction('sys', 'soundOn');
    });
}

if (soundOffBtn) {
    soundOffBtn.addEventListener('click', function() {
        soundEnabled = false;
        db.set({ 'braindump-sound': 'off' });
        updateSoundUI();
        triggerReaction('sys', 'soundOff');
    });
}

// Attach keyboard typing click triggers to dumpInput
if (dumpInput) {
    dumpInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            addDump();
            return; // Exit before sound logic — addDump handles its own sound
        }

        if (event.key.length === 1 || event.key === 'Backspace') {
            let pitch = 1.0;
            if (event.key === ' ') pitch = 0.8;
            playClick(pitch + (Math.random() * 0.15 - 0.075));
        }
    });
}


// === Personality Terminal Logger System ===
const terminalLogs = document.getElementById('terminalLogs');

const reactions = {
    sys: {
        soundOn: ["Typewriter audio feeds unmuted. Click clack initialized."],
        soundOff: ["Audio levels set to absolute zero. Quiet mode enabled."]
    },
    dump: {
        idea: [
            "Idea captured! Storing neural spark in memory cells.",
            "Eureka! Moss growths activated. Idea database expanded.",
            "Concept logged. Carbonated data levels stable."
        ],
        task: [
            "Task cataloged. Dr Pepper intake recommended to complete.",
            "Task logged. Adding weights to the pile.",
            "Action item received. Processing cognitive buffer."
        ],
        feeling: [
            "Emotional data logged. Empathy systems operating at peak performance.",
            "Feeling registered. Humans require carbonation and breaks.",
            "Vibes confirmed. Feeling matrix balanced."
        ],
        reminder: [
            "Reminder fixed! Storing alarm node in memory crystals.",
            "Notice saved. Storing warning state in block storage.",
            "Notice locked. Alert nodes active."
        ],
        resource: [
            "Resource captured. Indexing link parameters to gateway.",
            "Reference file loaded. Data repository updated.",
            "Link recorded. Local signal index complete."
        ],
        generic: [
            "Dump complete. Neural pathways cleared.",
            "Thought captured. The pile grows.",
            "Memory block written to local storage."
        ]
    },
    delete: [
        "Thought purged. Reclaiming neural address space.",
        "Memory dissolved. Path cleared.",
        "Filing cell cleared. Local memory buffer recycled."
    ],
    theme: {
        moss: "Signal frequency adjusted to Moss. Phosphor levels green.",
        amber: "Signal frequency adjusted to Amber. Warm CRT levels optimal.",
        periwinkle: "Signal frequency adjusted to Periwinkle. Cyber-neon levels active.",
        "algae-copper": "Signal frequency adjusted to Algae-Copper. Rust parameters active."
    },
    export: [
        "Memories extracted. Generating markdown matrix.",
        "Export complete. File downloaded via local gateway.",
        "Thoughts wrapped in neat package. Matrix out."
    ]
};

function logReaction(message) {
    if (!terminalLogs) return;
    
    const logItem = document.createElement('div');
    logItem.className = 'log-item';
    
    const now = new Date();
    const timeString = now.toTimeString().split(' ')[0];
    
    logItem.innerHTML = `<span style="opacity: 0.5;">[${timeString}]</span> > ${message}`;
    
    terminalLogs.appendChild(logItem);
    terminalLogs.scrollTop = terminalLogs.scrollHeight;

    if (feedLatest) {
        feedLatest.textContent = `> ${message}`;
    }
}

function triggerReaction(category, subcategory = null) {
    let list = [];
    if (subcategory && reactions[category] && reactions[category][subcategory]) {
        list = reactions[category][subcategory];
    } else if (reactions[category]) {
        list = Array.isArray(reactions[category]) ? reactions[category] : reactions[category].generic;
    }
    
    if (list && list.length > 0) {
        const msg = list[Math.floor(Math.random() * list.length)];
        logReaction(msg);
    }
}


// === Core Logic Functions ===
function addDump() {
    const text = dumpInput.value.trim();
    const type = currentDumpType;
    if (text === '') return;

    // Trigger dissolve — map overlay exactly to input position
    const overlay = document.getElementById('dissolveOverlay');
    if (overlay) {
        overlay.style.top = dumpInput.offsetTop + 'px';
        overlay.style.left = dumpInput.offsetLeft + 'px';
        overlay.style.width = dumpInput.offsetWidth + 'px';
        overlay.style.height = dumpInput.offsetHeight + 'px';
        overlay.innerHTML = `<div class="dissolve-text">${text}</div>`;
        overlay.classList.add('dissolving');

        setTimeout(function() {
            overlay.classList.remove('dissolving');
            overlay.innerHTML = '';
        }, 420);
    }

    playClick(0.7);

    const newDump = {
        id: Date.now(),
        text: text,
        type: type
    };

    dumps.push(newDump);
    dumpInput.value = '';
    updateCursor();
    renderDumps(newDump.id);
    saveDumps();
    triggerReaction('dump', type);
    playReceived();
}

if (dumpButton) {
    dumpButton.addEventListener('click', addDump);
}

function renderDumps(newId = null) {
    const pileCount = document.getElementById('pileCount');
    if (pileCount) {
        pileCount.textContent = dumps.length > 0 ? `(${dumps.length})` : '';
    }

    pileList.innerHTML = '';

    if (dumps.length === 0) {
        pileList.innerHTML = '<p class="empty-state">the pile is empty.</p>';
        return;
    }

    dumps.forEach(function(dump) {
        const item = document.createElement('div');
        item.className = 'pile-item';
        item.innerHTML = `
            <span class="pile-type">${dump.type}</span>
            <span class="pile-text">${dump.text}</span>
            <button class="pile-delete" data-id="${dump.id}">x</button>
        `;

        if (dump.id === newId) {
            item.classList.add('printing');
            setTimeout(function() { item.classList.remove('printing'); }, 300);
        }

        pileList.appendChild(item);
    });
}

function deleteDump (id) {
    dumps = dumps.filter(function(dump) {
        return dump.id !== id;
    });
    saveDumps();
    renderDumps();
    
    // Play light click sound
    playClick(1.5);
    triggerReaction('delete');
}

if (pileList) {
    pileList.addEventListener('click', function(event) {
        if (event.target.classList.contains('pile-delete')) {
            const id = Number(event.target.dataset.id);
            deleteDump(id);
        }
    });
}

function saveDumps() {
    db.set({ 'braindump-dumps': dumps });
}

function exportDumps() {
    if (dumps.length === 0) return;

    const date = new Date().toISOString().split('T')[0];

    let markdown = `# brain dump inbox\nexported: ${date}\n\n`;

    dumps.forEach(function(dump){
        markdown += `## ${dump.type}\n${dump.text}\n\n`;
    });

    const blob = new Blob([markdown], { type: 'text/markdown'});
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `brain-dump-${date}.md`;
    link.click();

    URL.revokeObjectURL(url);
    
    playClick(1.1);
    triggerReaction('export');
}

const exportButton = document.getElementById('exportButton');
if (exportButton) {
    exportButton.addEventListener('click', exportDumps);
}

// === Theming System (Signals) ===
function applyTheme(themeName) {
    document.body.setAttribute('data-theme', themeName);
    updateThemeDots(themeName);
}

function saveTheme(themeName) {
    db.set({ 'braindump-theme': themeName });
}

function updateThemeDots(activeTheme) {
    const dots = document.querySelectorAll('.theme-dot');
    dots.forEach(function(dot) {
        if (dot.dataset.theme === activeTheme) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

const themeDots = document.querySelectorAll('.theme-dot');
themeDots.forEach(function(dot) {
    dot.addEventListener('click', function() {
        const selected = dot.dataset.theme;
        applyTheme(selected);
        saveTheme(selected);
        updateThemeDots(selected);
        if (reactions.theme[selected]) {
            logReaction(reactions.theme[selected]);
        }
    });
});

// === Settings Panel Toggle ===
const settingsToggle = document.getElementById('settingsToggle');
const settingsPanel = document.getElementById('settingsPanel');
let settingsOpen = false;

if (settingsToggle) {
    settingsToggle.addEventListener('click', function() {
        settingsOpen = !settingsOpen;
        settingsPanel.classList.toggle('open', settingsOpen);
        settingsToggle.textContent = settingsOpen
            ? '// settings ▲'
            : '// settings ▾';
        playClick(0.9);
    });
}

// === Custom Select Dropdown ===
let currentDumpType = 'idea';

const dumpTypeTrigger = document.getElementById('dumpTypeTrigger');
const dumpTypeMenu = document.getElementById('dumpTypeMenu');
const dumpTypeLabel = document.getElementById('dumpTypeLabel');
const dumpTypeSelect = document.getElementById('dumpTypeSelect');
let dumpMenuOpen = false;

function closeDumpMenu() {
    dumpMenuOpen = false;
    dumpTypeMenu.classList.remove('open');
    dumpTypeTrigger.classList.remove('open');
}

if (dumpTypeTrigger) {
    dumpTypeTrigger.addEventListener('click', function(e) {
        e.stopPropagation();
        dumpMenuOpen = !dumpMenuOpen;
        dumpTypeMenu.classList.toggle('open', dumpMenuOpen);
        dumpTypeTrigger.classList.toggle('open', dumpMenuOpen);
        playClick(0.85);
    });
}

const dumpTypeOptions = document.querySelectorAll('.custom-select-option');
dumpTypeOptions.forEach(function(option) {
    option.addEventListener('click', function() {
        currentDumpType = option.dataset.value;
        dumpTypeLabel.textContent = currentDumpType;
        dumpTypeOptions.forEach(function(o) { o.classList.remove('selected'); });
        option.classList.add('selected');
        closeDumpMenu();
        playClick(0.9);
    });
});

if (dumpTypeSelect) {
    document.addEventListener('click', function(e) {
        if (!dumpTypeSelect.contains(e.target)) {
            closeDumpMenu();
        }
    });
}

// === Block Cursor Behavior ===
const blockCursor = document.getElementById('blockCursor');

function updateCursor() {
    if (!blockCursor) return;
    if (dumpInput.value.length === 0 && document.activeElement !== dumpInput) {
        blockCursor.classList.add('visible', 'blinking');
    } else {
        blockCursor.classList.remove('visible', 'blinking');
    }
}

if (dumpInput) {
    dumpInput.addEventListener('focus', updateCursor);
    dumpInput.addEventListener('blur', updateCursor);
    dumpInput.addEventListener('input', updateCursor);
}

// === Terminal Feed Collapse ===
const feedHeader = document.getElementById('feedHeader');
const feedChevron = document.getElementById('feedChevron');
const feedLatest = document.getElementById('feedLatest');
let feedOpen = false;

if (feedHeader) {
    feedHeader.addEventListener('click', function() {
        feedOpen = !feedOpen;
        terminalLogs.classList.toggle('open', feedOpen);
        feedChevron.classList.toggle('open', feedOpen);
        if (feedLatest) {
            feedLatest.style.display = feedOpen ? 'none' : 'block';
        }
        playClick(0.85);
    });
}

// === Boot Sequence ===
function bootSequence() {
    const bootMessages = [
        "initializing neural buffer...",
        "scanlines calibrated. phosphor levels nominal.",
        "typewriter relays armed.",
        "local signal confirmed. no cloud. no noise.",
        "brain dump inbox online. ready to receive."
    ];

    bootMessages.forEach(function(msg, i) {
        setTimeout(function() {
            logReaction(msg);
        }, i * 320);
    });
}

// === Unified Initialization Flow ===
db.get(['braindump-dumps', 'braindump-theme', 'braindump-sound'], function(result) {
    // Load dumps
    if (result['braindump-dumps']) {
        dumps = result['braindump-dumps'];
    }
    renderDumps();

    // Load sound preference
    soundEnabled = result['braindump-sound'] !== 'off';
    updateSoundUI();

    // Load theme
    const initialTheme = result['braindump-theme'] || 'moss';
    applyTheme(initialTheme);
    updateThemeDots(initialTheme);

    // Update block cursor initial state
    updateCursor();

    // Everything loaded — fire boot sequence
    bootSequence();
});
