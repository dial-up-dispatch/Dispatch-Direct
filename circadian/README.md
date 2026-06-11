# >circadian_

*A focus timer that lives beside you in the browser sidebar. Nothing more. Nothing less.*

---

## What >circadian_ Is

`>circadian_` is a quiet session utility designed specifically for browser sidebars. It features two clean modes (Timer and Stopwatch), an ambient CRT-inspired hardware presence, procedural sound synthesis, and a strict local-first data architecture. 

Your data stays in your browser. Your exports are plain markdown. No accounts, no syncing, no cloud dependencies.

This project is built using:
- **React 19 + TypeScript** for UI layout
- **Vite 6** for project bundling
- **Tailwind CSS v4** for utility layouts
- **Web Audio API** for procedural typing click and chime audio synthesis

---

### What's Live in Phase 1 (Timer Core)

- **Persistent Timing Engine**: The countdown (Timer) and count-up (Stopwatch) engine runs globally. Switch between the focus view and logs at the bottom freely—your sessions will continue running perfectly in the background.
- **Vacuum-Tube CRT Screen Warm-Up**: On initial startup, a beautiful retro cathode-ray tube warm-up sequence flashes a glowing horizontal phosphor line that collapses and fades out to reveal the terminal shell.
- **Coordinated Settings**: Changing your timer duration, sliding the volume levels, toggling mute, or swapping color themes in the Settings panel will instantly synchronize and update your Timer view controls.
- **Focus Pulse Breathing**: The status line breathing light accelerates dynamically when active to mirror a focused breathing rhythm, freezes solid when paused, and returns to a gentle, slow rhythm when on standby.

---

### What's Live in Phase 2 (Memory, Tags, & History)

- **LocalStorage State Persistence**: Theme selections, volume preferences, custom focus tag registries, and session configurations persist natively inside your browser. Refreshing or rebooting your browser maintains your workspace.
- **Tag Focus Registry**: Assign tags to your sessions in real-time. Add tags inline via typewriter-style input prompts or clean up outdated items with hover-deletion.
- **Chronological History Logs**: Review completed focus intervals and stopwatch count-ups grouped dynamically. Filter entries reactively by selected tags.
- **Local Markdown Logs Export**: Extract stashed sessions instantly as a clean, date-grouped `.md` file, perfect for logging in Obsidian or plain-text catalogs.
- **Accidental Start Safeguards**: The engine filters out micro-starts (sessions manual-stopped under 10 seconds), preventing trash data from cluttering your historical logs.
- **Destructive Data Controls**: Reset context states and purge stashed histories securely via confirmation modals in settings.

---

### What's Live in Phase 3 (Personality & Sound)

- **Randomized One-Liner Messaging**: Emotional presence with context-specific messages on start, completion, and stop transitions, fading in and out naturally.
- **Synthesized Audio Wireup**: Procedural mechanics play typing clicks in inputs and soft completion chimes, respecting user mute/volume levels.
- **Global Keyboard Shortcuts**: Control focus sessions instantly with `Space` (play/pause), `M` (mute), and `Escape` (settings overlay control) keys.
- **Visual Micro-Refinements**: Smooth status transitions, active glow brightness enhancements, and a cleaned-up settings close button interface.

---

### What's Live in Phase 4 (Settings & Export)

- **Snappy Settings Transitions**: Open and collapse settings smoothly with a 200ms slide transition, fully compatible with reduced motion accessibility fallbacks.
- **Keyboard Shortcut Guards**: Locks out play/pause and mute commands during slide and collapse transitions to prevent accidental background actions.
- **In-App Data Purge Controls**: Replaced native browser confirmation dialogues with a custom in-app warning overlay in the circadian design voice.
- **CRT Television Collapse Ritual**: Triggers a synthesized whoosh sound and a horizontal phosphor line vertical collapse sequence that shrinks to a single center dot when confirming a full clear-data action.

---

### What's Live in Phase 5 (Polish & Ship Readiness)

- **CRT Warmup Flicker Instability**: Adds realistic phosphor line startup stutters and 1–2 brief moments where the line almost fails before catching, giving it an authentic vintage hardware flavor.
- **Typewriter Click Pitch Detuning**: Implements subtle randomized pitch variation per keypress, making typing tags feel tactile like a physical mechanical keyboard.
- **Horizontal Jitter on Purge**: Adds a 150ms micro horizontal shake to the screen container at the end of the collapse sequence, simulating the final static discharge of a discharging CRT screen.
- **Double-Logging Resolution**: Fixes a core bug where naturally completed timer sessions were double-logged when resetting back to standby.
- **Custom Retro Scrollbars**: Defines thin CRT-themed scrollbar visual styles inside the history tab session lists for browsers.
- **Prerequisite Cleanups & Build Readiness**: Resolves all typescript `any` definitions, catches, and fast-refresh warnings for a clean compile.

---

## Folder Structure

```txt
circadian/
├── public/                 # Static assets copied directly to build
│   ├── icons/              # Extension logo icons (16px, 48px, 128px)
│   └── manifest.json       # Manifest V3 extension configuration schema
├── src/                    # Source code directory
│   ├── components/         # Modular layout views (Timer, History, Settings)
│   ├── fonts/              # Custom monospace and variable typography assets
│   ├── hooks/              # Custom hooks (e.g. useLocalStorage wrapper)
│   ├── lib/                # Shared utilities, procedural audio, and constants
│   ├── styles/             # Foundations CSS stylesheets and signals variables
│   ├── types.ts            # Core TypeScript model interfaces
│   ├── App.tsx             # Main viewport component and router shell
│   └── main.tsx            # Application launch entry point
├── package.json            # Node project dependency descriptor
└── vite.config.ts          # Vite bundler configurations
```

---

## Running Locally

To start developing and testing features:

1. **Install Dependencies**:
   ```bash
   pnpm install
   ```
2. **Start Local Development Server**:
   ```bash
   pnpm dev
   ```
   *Note: Open `http://localhost:5173` in a standard browser tab to utilize Hot Module Replacement (HMR) for visual styling updates.*

---

## Data Storage & Local Testing

* Everything is kept in your browser's local sandbox.
* **To load the app as a Chrome Extension**:
  1. Compile the production bundle:
     ```bash
     pnpm build
     ```
  2. Open Google Chrome and navigate to `chrome://extensions/`.
  3. Enable **Developer mode** (top right).
  4. Click **Load unpacked** (top left) and select the generated `/dist` directory.
  5. Pin the extension and open it inside your sidebar panels!

---

*// circadian · Dial Up Dispatch · May 2026 · fueled by Dr Pepper*
