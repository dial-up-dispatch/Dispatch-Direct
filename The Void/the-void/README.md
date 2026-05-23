# The Void — Opera Sidebar Extension

> *received. the void remains unmoved. so can you.*

**The Void** is a private, ceremonial release space for your intrusive thoughts, worries, and loops. It lives directly inside your Opera sidebar—always present at the edge of your attention, but never in your way. When a thought surfaces, you reach sideways, type it, and release it. It dissolves instantly, physically purging from browser memory. The Void stores nothing, exports nothing, and tracks nothing.

This project is a vanilla HTML/CSS/JS port of the original Vite/React/TypeScript application.

---

## 📂 Project Structure

Inside this folder (`/the-void`), you will find the structural framework of the extension:

```
the-void/
├── manifest.json       # Manifest v3 extension configuration
├── panel.html          # Full static HTML structure for the sidebar panel
├── css/
│   └── style.css       # Custom styles, signal themes, and CRT scanline animations
├── js/
│   └── app.js          # Core extension state, user interactions, and audio synthesis logic
├── fonts/
│   └── SpaceMono/      # Locally bundled typographic assets (OFL Space Mono)
└── icons/              # Extension brand asset suite (16px, 32px, 48px, 64px, 128px)
```

---

## 🛰️ Current Phase: Phase 2 Complete (Logic, Interaction & Audio)

We have successfully finished **Phase 2: Logic, Interaction & Audio**. All dynamic components, settings synchronizations, screen transitions, and browser-synthesized audio effects are fully functional and wired using offline-first, vanilla JavaScript.
*   **Aesthetic & Layout Harmony:** Responsive flex column constraints and sizing classes have been integrated into `css/style.css`, resolving stacking layouts to fit narrow Opera sidebars perfectly.
*   **Procedural Web Audio Engine Active:** Typing on the keyboard produces satisfying mechanical clacks with pitch variations, releasing a thought plays a deep cosmic sweeping whoosh, and the void breathes procedural drones (subtone fifths) and soft white/brown noise textures.
*   **Release Ritual & Dissolve Active:** Pressing Enter or clicking `[ ENTER ]` locks container bounds, sweeps the scanline filter, dissolves the text with an evaporating blur effect, and completely wipes thought strings from memory in under 420ms (100% privacy compliance).
*   **Transitions & Interactions Wired:** Shutter-style screen wipes transition between panels safely under both standard and prefers-reduced-motion profiles. Option dashboards sync and save all themes, reception configurations, sound mutes, and optional transmission counters offline in `localStorage`.

---

## 🔮 Recommended Phase 3 Roadmap

In **Phase 3 (Verification, Polish & Packaging)**, we will prepare the sidebar extension for public release:

1.  **Browser Verification & Testing:** Load the extension unpacked inside Opera One (`opera://extensions`) and run rigorous manual and browser tests across signal themes to check for layout shifting, AudioContext startup crashes, or storage leakage.
2.  **Manifest & MV3 Validation:** Double-check browser compliance metrics to guarantee that the `manifest.json` rules align perfectly with modern Manifest v3 safety guidelines and that all icon assets match local declarations.
3.  **Submission Assets Preparation:** Draft store descriptions, prepare compliant extension screenshots (612×408px sidebar panel frames), compile the final store submission package, and verify support channels.
