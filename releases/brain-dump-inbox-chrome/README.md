# Brain Dump Inbox — Sidebar Extension Port

This is the first official extension release for **Dispatch Direct** — taking the original standalone thought-capture playground and bringing it home to the browser sidebar.

The original application was built line-by-line to master HTML, CSS, and JavaScript foundations. This port maintains that sacred learning spirit while adapting it for a compact browser panel and elevating its retro-terminal atmosphere.

---

## 📺 What lives in the Sidebar?

Brain Dump Inbox is a sidebar-native console. When an idea strikes, a task surfaces, or a resource is discovered mid-browse:
1. Reach sideways.
2. Dump it.
3. Keep moving.

No new tab, no context switching, completely local, and entirely offline.

---

## 🚀 Elevated Foundations (The Extension Port Upgrades)

Here is a plain-language explanation of the engineering upgrades introduced during the sidebar extension port:

### 1. Dual-Chassis Browser Architecture
* **What it is:** A browser configuration system that targets multiple browser families using customized manifest rules. We support Opera's native sidebar API and Chrome/Vivaldi's side panel API simultaneously.
* **Why it helps:** You can run your thought-capture box in the vertical sidebar dock of Opera, or pinned in the toolbar tray of Chrome and Vivaldi. The core app code remains 100% the same; only the manifest bridges adapt.

### 2. High-Reliability Local Storage (`chrome.storage.local`)
* **What it is:** A robust browser extension storage API. While standard webpages use `localStorage` (which the browser can occasionally clear during cache sweeps), we upgraded the database to extension-scoped local storage.
* **Why it helps:** Absolute reliability. Your thoughts, logs, themes, and sound toggles are anchored securely inside the extension origin. Nothing ever leaves your machine, and it cannot be cleared by typical browsing sweeps.

### 3. Transparent Offline Debug Wrapper (`db`)
* **What it is:** A small adapter in our JavaScript (`js/app.js`) that automatically checks if it is running inside a browser extension or a standard tab. If the extension API is missing, it falls back to standard `localStorage` dynamically.
* **Why it helps:** It preserves our ability to open `panel.html` in a normal browser tab during development, making the app highly debuggable without needing to pack and load the extension after every single line we write.

### 4. Dynamic Text Dissolve Overlay
* **What it is:** An animation layer that takes the exact text from the input box, places it inside a transparent container aligned precisely on top of the input, and animates it dissolving upwards and out of view.
* **Why it helps:** We use JavaScript (`offsetTop`, `offsetLeft`, `offsetWidth`) to calculate the exact dimensions of the input box on the fly, creating a seamless visual illusion that your thoughts are vaporizing directly out of the keyboard and into the terminal screen.

### 5. Targeted Pile Printing
* **What it is:** Passing a specific entry ID to `renderDumps(newId)` so only the newly added item gets the `.printing` class and plays the retro entry-print slide animation.
* **Why it helps:** It prevents a chaotic "global printing flash" where every single item in your pile re-animates from scratch whenever you add or delete a thought.

### 6. Dual-Tone Confirmation Sound (`playReceived`)
* **What it is:** A synthesized Web Audio API sound module separate from standard key clicks. It plays a soft, decaying low-pitched frequency ramp followed closely by a high-pitched shimmer.
* **Why it helps:** It serves as a satisfying, mechanical "carriage return confirmation" when your thought is safely committed to the pile.

### 7. Unified Async Initialization
* **What it is:** Bundling our async storage queries into a single `db.get` call on load, setting the theme, sound preference, and pile list, and then executing our staggered `bootSequence()` console logs.
* **Why it helps:** It completely eliminates "theme flashing" (where the panel starts green and snaps to Amber or Periwinkle a split-second later) and ensures all components are fully calibrated before the mechanical relays arm.

---

## 🛠️ The Local File Matrix

```
brain-dump-inbox/
├── manifest.json            ← Active loaded manifest (default: Chrome/Vivaldi)
├── manifest.chrome.json     ← Chrome/Vivaldi specific side panel manifest
├── manifest.opera.json      ← Opera specific native sidebar manifest
├── background.js            ← Minimal MV3 side panel service worker
├── panel.html              ← Sidebar document layout
├── css/
│   └── style.css           ← Phosphor aesthetics & scrollbar rules
├── js/
│   └── app.js              ← Nervous system, sound synthesizers & storage
├── fonts/
│   └── SpaceMono/          ← Space Mono typeface, bundled locally
│       ├── SpaceMono-Regular.woff2
│       ├── SpaceMono-Bold.woff2
│       ├── SpaceMono-Italic.woff2
│       └── SpaceMono-BoldItalic.woff2
└── icons/                  ← Phosphor pixel-art PNG icons
    ├── icon-16.png
    ├── icon-32.png
    ├── icon-48.png
    └── icon-128.png
```

---

## 📦 Developer Target Environments (Switching Manifests)

When loading or packing the extension locally, the browser expects a file named `manifest.json`. Since we support multiple browsers, copy the manifest target you want to test over the active `manifest.json` file.

### 1. Developing / Packaging for Chrome and Vivaldi:
Copy the Chrome manifest configuration to make it active:
* **Windows (PowerShell):**
  ```powershell
  Copy-Item manifest.chrome.json manifest.json
  ```
* **macOS / Linux (Terminal):**
  ```bash
  cp manifest.chrome.json manifest.json
  ```
Then open `chrome://extensions`, enable **"Developer mode"**, click **"Load unpacked"**, and select the `brain-dump-inbox` directory.

### 2. Developing / Packaging for Opera One:
Copy the Opera manifest configuration to make it active:
* **Windows (PowerShell):**
  ```powershell
  Copy-Item manifest.opera.json manifest.json
  ```
* **macOS / Linux (Terminal):**
  ```bash
  cp manifest.opera.json manifest.json
  ```
Then open `opera://extensions`, enable **"Developer mode"**, click **"Load unpacked"**, and select the `brain-dump-inbox` directory.

---

## 🎨 Phase 002 — The Continuous Terminal (Surface Redesign)

In this phase, we completed a visual restoration to elevate the sidebar's visual weight and atmospheric hierarchy:
* **The Continuous Screen Surface:** Overhauled the fragmented box interface in favor of a unified retro CRT screen surface, dividing sections with thin horizontal phosphor rules.
* **The Minimalist Prompt:** Set input styles to borderless inline rows with no left margins, making your thoughts the hero. The standby block cursor and dissolve vaporization particles sit flush with typing baselines.
* **Expanding Settings Console:** Cleaned up visual noise by hiding volume adjustments and CRT screen color themes inside a collapsible settings dashboard tray.
* **Interactive Theme Dots:** Replaced traditional browser selects with organic signal dots to instantly cycle between moss, amber, periwinkle, or algae themes.
* **Custom Dropdown Selector:** Created a bespoke retro select component in pure HTML/CSS/JS that inherits theme variable color shifts and glows.
* **Collapsible Log Console:** Compressed typewriter boot messages and AI personality logs into a single-line prompt preview. Toggle the console header to slide open full history lists.

---

## ⚡ Phase 003 — Polish, Signals & Icons (Tactile Refinements)

In this phase, we introduced tactile polish, elastic visual loops, and custom-rendered assets to maximize peripheral immersion:
* **The Ambient Signal Indicator:** Relocated the connection status dot to the upper right corner of the app header. It operates like a physical power LED on hardware — present and glowing in your peripheral vision without crowding your typing space.
* **Elastic Panel Transitions:** Overhauled the Settings expansion tray and Terminal Activity feed. They now slide open and fade in with an organic, liquid transition that matches the tactile feel of physical dials, eliminating hard visual jumps when tuning settings.
* **Scroll History Restoration:** Re-introduced deep vertical scroll parameters to terminal log rows, guaranteeing developer activities and boot sequencing notes are always scrollable when open.
* **Programmatic CRT Icons:** Generated a brand new, custom pixel-art icon grid using zero-dependency browser-based canvas geometry. The icon models a glowing, phosphor-green CRT terminal monitor displaying a command prompt (`>`) and a centered, dual-lobe brain outline.
* **Space Mono Licensing:** Bundled the SIL Open Font License 1.1 directly in our docs, securing full legal compliance for offline font distributions.

---

## 🔗 Phase 004 — Chrome/Vivaldi Manifest Port (Cross-Browser Capabilities)

In this phase, we expanded target environments by introducing dynamic sidebar capability in Google Chrome and Vivaldi:
* **Declarative Side Panel Activation:** Introduced modern background task management via Chrome's native `side_panel` and `action` components. Clicking the toolbar icon opens our interface instantly.
* **Platform Manifest Isolation:** Segmented specific browser requirements into isolated manifests, preventing runtime load conflicts between browsers while keeping our core frontend code 100% unified.

---

## 🔋 Operating Philosophy

* **No sync. No clouds. No accounts.**
* **No libraries. No frameworks. Vanilla only.**
* **Honoring the learning process, line by line.**
* **Powered by Dr Pepper.**
