# The Void — Vivaldi, Chrome & Opera Sidebar Extension

> *received. the void remains unmoved. so can you.*

**The Void** is a private, ceremonial release space for your intrusive thoughts, worries, and loops. It lives directly inside your browser's sidebar—always present at the edge of your attention, but never in your way. When a thought surfaces, you reach sideways, type it, and release it. It dissolves instantly, physically purging from browser memory. The Void stores nothing, exports nothing, and tracks nothing.

This project is a vanilla HTML/CSS/JS port of the original Vite/React/TypeScript application.

---

## 📂 Project Structure

Inside this folder (`/the-void`), you will find the structural framework of the extension:

```
the-void/
├── manifest.opera.json   # Manifest v3 configuration for Opera
├── manifest.chrome.json  # Manifest v3 configuration for Chrome/Vivaldi
├── background.js         # Minimal background service worker for Chrome/Vivaldi
├── panel.html            # Full static HTML structure for the sidebar panel
├── css/
│   └── style.css         # Custom styles, signal themes, and CRT scanline animations
├── js/
│   └── app.js            # Core extension state, user interactions, and audio synthesis logic
├── fonts/
│   └── SpaceMono/        # Locally bundled typographic assets (OFL Space Mono)
└── icons/                # Extension brand asset suite (16px, 32px, 48px, 64px, 128px)
```

---

## 🛠️ Development Setup

Because this project supports multiple browser targets via a **dual-manifest system**, a root `manifest.json` is not committed. 

To load the extension unpacked for local development:
1. Copy the manifest corresponding to your target browser and rename it to `manifest.json` in the `/the-void` directory:
   - **For Chrome & Vivaldi:**
     ```bash
     cp manifest.chrome.json manifest.json
     ```
   - **For Opera:**
     ```bash
     cp manifest.opera.json manifest.json
     ```
2. Open your browser's extensions page (`vivaldi://extensions`, `chrome://extensions`, or `opera://extensions`).
3. Enable **Developer Mode**.
4. Click **Load unpacked** and select the `/the-void` directory.

*(Note: `manifest.json` is ignored by Git in `.gitignore` to prevent committing browser-specific overrides.)*

---

## 📦 Packaging & Unified Build System

The Dispatch Direct workspace uses a unified PowerShell build script located at the repository root (`/build.ps1`). It builds, packages, and zips both **Brain Dump Inbox** and **The Void** for both Chrome/Vivaldi and Opera targets in a single run.

To package the extensions for store release:
1. Open a PowerShell terminal at the repository root.
2. Execute the build script:
   ```powershell
   ./build.ps1
   ```
3. The script automatically handles staging, swapping the correct manifests, excluding development-only files, and generating clean ZIP packages with UNIX-style paths in the repository root:
   - `the-void-chrome.zip` (Chrome/Vivaldi extension, includes `background.js`)
   - `the-void-opera.zip` (Opera extension, excludes `background.js`)
   - `brain-dump-inbox-chrome.zip`
   - `brain-dump-inbox-opera.zip`

---

## 🛰️ Project Status: Phase 3 Complete (Chrome/Vivaldi Adaptation & Unified Build)

We have successfully finished **Phase 3: Chrome/Vivaldi Adaptation & Unified Build System**:
*   **Dual-Manifest Adaptation:** Added `manifest.chrome.json` to utilize the Chrome `sidePanel` API, allowing Vivaldi and Chrome users to load The Void natively in their sidebar panels.
*   **Background Worker Integration:** Wired `background.js` as an MV3 compliant service worker to toggle the side panel when the toolbar action button is clicked.
*   **Unified Build Tooling:** Replaced the legacy build pipeline with a staging-based packaging solution, outputting standard and clean cross-platform ZIP files safely.
*   **Procedural Web Audio Engine Active:** Typing on the keyboard produces satisfying mechanical clacks with pitch variations, releasing a thought plays a deep cosmic sweeping whoosh, and the void breathes procedural drones (subtone fifths) and soft white/brown noise textures.
*   **Release Ritual & Dissolve Active:** Pressing Enter or clicking `[ ENTER ]` locks container bounds, sweeps the scanline filter, dissolves the text with an evaporating blur effect, and completely wipes thought strings from memory in under 420ms (100% privacy compliance).
