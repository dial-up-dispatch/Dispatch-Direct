# Phase Report: Phase 001 — Scaffold and Port
### Brain Dump Inbox · Opera Sidebar Extension Port
*Prepared: May 2026 · Dispatch Direct Release*

---

## 📺 Overview of Accomplishments

Phase 001 has successfully port-migrated the standalone **Brain Dump Inbox** web app into a robust, offline-first, high-atmosphere **Opera Sidebar Extension**. 

All structural code files have been written directly inside the `brain-dump-inbox/` workspace. The local signal is fully established, Manifest V3 is compliant, and the CRT phosphor glow is humming elegantly inside its new vertical chassis.

---

## 🛠️ What Changed

1. **Manifest V3 Setup (`manifest.json`):**
   * Registered a compliant MV3 architecture utilizing the native Opera `"sidebar_action"` API schema.
   * Locked permissions down strictly to `"storage"`, keeping our security surface at an absolute minimum.
   
2. **Local Font Loading (`panel.html`):**
   * Severed all external preconnect and CDN links to Google Fonts.
   * Declared four localized `@font-face` blocks inside `<head>` sourcing local WOFF2 files directly from `fonts/SpaceMono/` to guarantee absolute offline capabilities.
   
3. **Sidebar-Adaptive HTML Structure (`panel.html`):**
   * Configured viewport metadata with a custom dark color scheme tag.
   * Created `<div class="dump-input-wrapper">` inside the input row to enable relative coordinate tracking.
   * Added the `<div id="blockCursor">` terminal prompt standby cursor inside the wrapper.
   * Added the `<div id="dissolveOverlay">` text vaporization tray inside the dump zone panel.
   
4. **Retro Responsive CSS (`css/style.css`):**
   * Removed standard document grid constraints, allowing the viewport to adapt cleanly down to standard sidebar widths (`300px` to `360px`).
   * Configured `.pile-list` to lock at a scrollable `40vh` max-height to ensure the sidebar layout never scrolls globally.
   * Combined scanline and vignette gradients on the `body::after` layer with comma-separated values.
   * Upgraded the `--green-crt` opacity to `0.06` across **all four color themes** (Moss, Amber, Periwinkle, and Algae-Copper) for deeper phosphor density.
   * Bound a subtle, irregular `panel-flicker` animation directly to `body::after` to create a realistic CRT screen oscillation without impacting text legibility.
   * Added styling rules for the blinking block cursor, status dot pulse, dissolve upward vapor effect, and targeted slide printing.
   
5. **High-Resilience Storage Core (`js/app.js`):**
   * Implemented the `db` transparent adapter at the top of the script. It automatically detects if it is running inside an packed extension or a local debugging browser tab, falling back to standard `localStorage` dynamically so testing is completely uninhibited.
   * Consolidated all load processes into a unified `db.get` transaction. This loads the pile, theme, and sound preferences together, preventing visual visual snapping.
   * Intercepted `Enter` key keydown actions, preventing muddy click sounds and cleanly committing the thought.
   * Built the dynamic coordinates positioning algorithm in `addDump()` so that the dissolve overlay overlays perfectly on top of the text input regardless of window sizing.
   * Updated `renderDumps(newId)` to accept a target entry ID, preventing chaotic re-printing of the entire pile.
   
6. **Live Synthesizer confirmation (`js/app.js`):**
   * Created the `playReceived()` confirmation tone—a decaying low-frequency sine-wave sweep followed by a high-frequency shimmer.
   
7. **Scaffolded Retropixel Icons (`icons/`):**
   * Created custom placeholder icons at `16px`, `32px`, `48px`, and `128px` using a custom, pure Node.js generator script. The icons draw a dark phosphor grid with a bright green terminal block cursor centered.

---

## 🕯️ What Was Intentionally NOT Changed

* **The Cybernetic Personality:** The original reactions dictionary (`startup`, `sys`, `dump`, `delete`, `theme`, `export`) is completely intact.
* **The Synthesizer Mechanics:** The core mechanical click synthesizer (switch clicks + plastic structural clacks) remains exactly as originally designed.
* **Sacred Labels:** The `// dump mode` and `// the pile` section headers were preserved strictly.
* **Zero Dependencies:** The app remains 100% vanilla HTML, CSS, and JS—completely reviewable, incredibly lightweight, and satisfyingly simple.

---

## ⚠️ Discovered Risks & Architectural Concerns

> [!WARNING]
> **Audio Context Autoplay Policies:**
> Modern browser engines block `AudioContext` generation until a user interaction (such as a click or keypress) occurs. Our initialization checks handle this by calling `audioCtx.resume()` during click events, but the boot sequence does not trigger sounds dynamically to avoid throwing engine warnings.

> [!IMPORTANT]
> **Extension Scoped Storage Quirks:**
> `chrome.storage.local` is incredibly resilient, but it is separate from normal browser cookie sweeps. If a user completely uninstalls the extension, its local storage is purged. Users should be encouraged to utilize the `.md` export option frequently.

---

## 🎨 Emotional & UX Concerns
* **The Standby Cursor:** Having a blinking cursor visible when the input is empty and unfocused is highly atmospheric. However, if the cursor blinks directly over placeholder text, it could create minor legibility overlap. In this phase, we positioned it at `left: 0.85rem` inside the input box to represent a standard prompt invitation.
* **Flicker Sensitivity:** The `panel-flicker` is restricted to `0.94` - `1.0` opacity over an `8s` duration and target-bound strictly to the background overlay. This prevents rapid strobing and ensures users do not experience cognitive fatigue.

---

## 🔒 Privacy & Security Controls
* **Zero Network Calls:** The extension makes absolutely zero `fetch`, `XMLHttpRequest`, or external script requests.
* **Scoped Storage:** Standard host permissions (`<all_urls>`, `tabs`, etc.) are completely omitted. The extension is sandboxed entirely to its own viewport.

---

## 💡 Teachable Moment: Transparent Storage Bridges
When writing browser extensions, developers often crash into a frustrating wall: extension APIs (like `chrome.storage.local`) only exist when the extension is packed and running in the browser sidebar. If you double-click `panel.html` to test a simple style tweak in a standard tab, the browser throws an error: `TypeError: Cannot read properties of undefined (reading 'storage')`.

To solve this, we implemented a **Transparent Storage Bridge** (`db`). By writing a lightweight helper object at the very top of `js/app.js` that checks for the presence of extension APIs:
```javascript
if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    // Write/read to native secure extension storage
} else {
    // Gracefully fall back to standard localStorage
}
```
We enjoy the best of both worlds. The application is completely compliant and secure when deployed, yet retains its light, friction-free web origin during local design iterations.

---

## ⏳ Remaining Risks & Recommended Next Steps

1. **Space Mono License Audit:** Confirm OFL (Open Font License) files are documented cleanly.
2. **Review Icon Assets:** The generated retropixel icons are fully valid PNGs and ready for local loading, but future aesthetic phases should refine these icons into stylized CRT frames or custom branded logos.
3. **Verify Sidebar Width Bounds:** Test minimum sidebar resizing boundaries inside Opera to ensure controls wrap smoothly.

---

## 🎨 Two Creative Next Steps

### 1. The Carbonated Terminal Glitch (Emotional/Atmospheric)
Introduce a rare, highly atmospheric "signal degradation" micro-interaction. If the user types exceptionally fast (e.g. over 80 Words Per Minute), have the terminal activity feed temporarily print a series of dry, frantic warning comments (e.g., `> warning: neural buffer overflowing! intake more Dr Pepper.`) with a rapid, highly randomized phosphor screen twitch. It rewards high-speed typing with organic cybernetic playfulness.

### 2. Physical Carriage Return Bell (Audio Synthesis)
Extend the Web Audio API to synthesize a retro mechanical typewriter bell chime when a thought is successfully dumped. Instead of a simple software sweep, we can mathematically model a physical high-resonance strike (a metallic "ding!") using a high-pitch sine wave combined with a rapid decay bandpass filter. It brings the tactile satisfaction of an old-school Remington typewriter directly into the digital sidebar.
