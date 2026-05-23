# Brain Dump Inbox — Opera Sidebar Extension
### A Dispatch Direct Release · Dial Up Dispatch

_Started: May 2026_

---

## What It Is

Brain Dump Inbox is a local-first, sidebar-native thought capture tool for Opera. It lives in the sidebar — always within reach, never in your way. When a thought hits mid-browse, you reach sideways, dump it, and return to what you were doing. No new tab. No context switch. No friction.

It is the first official **Dispatch Direct** extension.

---

## Origin

Brain Dump Inbox began as a learning project — built line by line to understand HTML, CSS, and JavaScript from the ground up. Every feature was added only when it could be fully explained. That origin is part of its soul. It has CRT terminal aesthetics, a personality feed that reacts to your activity, typewriter click sounds, theme switching, and `.md` export.

The extension port is not a rebuild. It's a homecoming. The sidebar is where this was always supposed to live.

---

## The One Goal (Opera Compliance)

**Capture thoughts quickly and retrieve them easily, entirely locally.**

That's it. One goal. Every feature serves that purpose.

---

## Browser Support

| Browser | Status | Notes |
|---|---|---|
| Opera One | ✅ v1.0 target | Native `sidebar_action` API — this is home |
| Firefox | 🔜 v1.x maybe | Same `sidebar_action` API, most compatible expansion path |
| Chrome | ⏳ future consideration | Different `side_panel` API — separate manifest needed |
| Edge | — | Not a priority |

**Decision:** Opera-only for v1.0. Firefox is the natural next step when the time comes — they share the same `sidebar_action` API, so expansion will be low-friction. Chrome is a future conversation.

---

## What Changes for the Extension Port

### Structural Changes

| Original App | Extension Version |
|---|---|
| Standalone browser tab | Opera sidebar panel |
| Full viewport layout | Narrow sidebar width (~360px) |
| Multi-section horizontal layout | Single-column vertical scroll |
| External font loading (Google Fonts) | Bundled locally — no external requests |
| Unlimited localStorage | localStorage scoped to extension origin |

### What Stays Exactly the Same
- CRT terminal aesthetic — Space Mono font, scanline feel, phosphor color themes
- Four themes: Moss · Amber · Periwinkle · Algae-Copper
- Dump input with type selector (idea / task / feeling / reminder / resource)
- The Pile — newest first, deletable entries
- Terminal personality feed — reactive, dry, warm
- Typewriter click sounds — synthesized Web Audio API, no external files
- Sound toggle
- `.md` export
- localStorage persistence — all data stays local, nothing leaves the browser
- `// dump mode` and `// the pile` section labels — these are sacred

### What Gets Adapted
- **Layout** — single column, compact, sidebar-optimized. Header slims down. Controls stack gracefully.
- **Font loading** — Space Mono bundled locally. No Google Fonts CDN. No external requests of any kind.
- **Scrolling** — The Pile scrolls within its container, not the whole panel.
- **Header** — compressed to save vertical space. Logo + title on one line, controls inline.
- **Personality feed** — most recent entry always visible at the bottom. Rest collapsible. The soul stays; the space is respected.

### What Gets Added
- **Manifest v3** — `manifest.json` with `sidebar_action` for Opera's native sidebar API
- **Icon set** — designed icons at 16px, 32px, 48px, 128px
- **Privacy policy** — lightweight, honest. Everything lives in your browser.
- **Support page** — Dial Up Dispatch Tumblr under the Dispatch Direct tag

---

## Manifest Structure

```json
{
  "manifest_version": 3,
  "name": "Brain Dump Inbox",
  "version": "1.0.0",
  "description": "A local-first thought capture tool that lives in your sidebar. Dump ideas, tasks, feelings, and reminders — then export them as Markdown.",
  "sidebar_action": {
    "default_icon": {
      "16": "icons/icon-16.png",
      "32": "icons/icon-32.png",
      "48": "icons/icon-48.png",
      "128": "icons/icon-128.png"
    },
    "default_panel": "panel.html",
    "default_title": "Brain Dump Inbox"
  },
  "permissions": ["storage"],
  "icons": {
    "16": "icons/icon-16.png",
    "32": "icons/icon-32.png",
    "48": "icons/icon-48.png",
    "128": "icons/icon-128.png"
  }
}
```

**Permissions philosophy:** `storage` only. That's it. No host permissions. No tabs. No browsing data. Nothing we don't need.

---

## File Structure

```
brain-dump-inbox/
├── manifest.json
├── panel.html              ← the sidebar panel (replaces index.html)
├── css/
│   └── style.css
├── js/
│   └── app.js
├── fonts/
│   └── SpaceMono/          ← bundled locally, no CDN
│       ├── SpaceMono-Regular.woff2
│       ├── SpaceMono-Bold.woff2
│       └── SpaceMono-Italic.woff2
└── icons/
    ├── icon-16.png
    ├── icon-32.png
    ├── icon-48.png
    └── icon-128.png
```

**No build system required.** Vanilla HTML/CSS/JS. This is intentional — it honors the origin of the project, keeps the code reviewable and readable for Opera's moderators, and keeps the extension lightweight.

---

## Layout — Sidebar Optimized

```
┌─────────────────────────────┐
│ 📺 brain dump inbox    🔊 ▾ │  ← slim header, sound + theme controls inline
├─────────────────────────────┤
│ // dump mode                │
│ ┌─────────────────────────┐ │
│ │ what's in your head?    │ │  ← text input, full width
│ └─────────────────────────┘ │
│ [idea ▾]  [ dump it ]       │  ← type select + button on same row
│                   [export]  │  ← export tucked below, right-aligned
├─────────────────────────────┤
│ // the pile          (3)    │  ← entry count badge
│ ┌─────────────────────────┐ │
│ │ • idea · 2m ago    [x]  │ │
│ │   your thought here     │ │
│ │─────────────────────────│ │
│ │ • task · 1h ago    [x]  │ │
│ │   another thought       │ │
│ └─────────────────────────┘ │  ← scrollable container
├─────────────────────────────┤
│ // terminal activity feed ▾ │  ← collapsible, chevron toggle
│ > signal received.          │  ← most recent entry always visible
└─────────────────────────────┘
```

---

## Theme System

Themes use CSS custom properties on `body[data-theme]`. Same system as the original app, no changes needed — just confirm all four themes render correctly in the narrower sidebar viewport.

| Theme | Accent | Feel |
|---|---|---|
| moss | green phosphor | default, earthy |
| amber | warm amber | late night, warm |
| periwinkle | soft blue-purple | cool, calm |
| algae-copper | teal + copper | weird and good |

---

## Sound System

Web Audio API, fully synthesized, no external audio files. Typewriter click on keypress, randomized pitch variation for organic feel. Sound toggle persists to localStorage. No changes needed from original implementation — it already satisfies the "no external files" requirement.

---

## Data & Privacy

**Nothing leaves the browser. Ever.**

| Key | Contents |
|---|---|
| `braindump-theme` | Active theme name |
| `braindump-sound` | Sound on/off preference |
| `braindump-entries` | The pile — array of dump entries |

Export produces a `.md` file generated client-side via Blob. No server. No network request. No account.

**Privacy policy statement (for submission):**
> Brain Dump Inbox stores all data locally in your browser using localStorage. No data is transmitted to any server. No account is required. If you clear your browser data, your entries will be cleared. Export your pile as Markdown anytime to keep a permanent copy.

---

## Opera Store Listing

**Name:** Brain Dump Inbox

**Category:** Productivity

**Version:** 1.0.0

**Summary:**
> A local-first thought capture tool that lives in your Opera sidebar. Dump ideas, tasks, feelings, and reminders the moment they surface — then export everything as Markdown.

**Description:**
> Brain Dump Inbox lives in your Opera sidebar, always within reach. When a thought hits mid-browse — an idea, a task, a feeling, a reminder — you reach sideways, type it, tag it, and return to what you were doing. No new tab. No context switch. No lost thought.
>
> The interface is a CRT terminal — Space Mono font, phosphor glow, scanline aesthetic. Four color themes: Moss, Amber, Periwinkle, and Algae-Copper. Typewriter click sounds synthesized live in the browser. A personality feed that reacts to everything you do with dry, warm commentary.
>
> Everything stays local. No servers. No accounts. No data leaves your browser. Export your entire pile as a Markdown file anytime.
>
> Brain Dump Inbox is a Dispatch Direct extension — tools that live beside you.

**Support page:** Dial Up Dispatch Tumblr — Dispatch Direct tag

---

## Icon Direction

The icon needs to feel like Brain Dump Inbox — CRT terminal energy, not generic productivity app.

**Concept:** A tiny CRT monitor or terminal screen with a blinking cursor or a single thought fragment visible. Phosphor green on dark background. Recognizable at 16px.

**Sizes needed:** 16 · 32 · 48 · 128px

**Style:** Clean, anti-aliased PNG with transparent background. Consistent style across all sizes.

---

## Screenshots Needed (for submission)

1. **Panel in sidebar** — full Opera browser window showing the sidebar open with Brain Dump Inbox active, a few entries in the pile. 612×408px, white background browser theme.
2. **Themes showcase** — four theme variants side by side or in sequence.

---

## Phase Roadmap

**v1.0 — Ship It**
- Sidebar-optimized layout
- All original features intact
- Bundled fonts
- Manifest v3
- Icons
- Store listing ready

**v1.1 — Nice to Have**
- Entry search / filter
- Keyboard shortcut to open sidebar
- Count badge on sidebar icon showing pile size
- Firefox support (manifest is already compatible — low lift)

**v2.0 — Brain Dial Bridge**
- When Brain Dial extension exists, optional handoff: "send to Brain Dial prose"
- Shared theme preference across Dispatch Direct extensions

---

## What We're Not Doing

- No sync. No cloud. No accounts.
- No React. No build system. Vanilla only. Honors the origin.
- No feature creep. One goal.
- No external requests of any kind.
- No Chrome or Edge support in v1. Not a priority.

---

## Open Questions

- [ ] Test sidebar minimum/maximum width constraints in Opera One
- [ ] Space Mono license check — confirm OFL allows bundling in extension (almost certainly yes, but verify)
- [ ] Confirm `storage` permission covers localStorage in Opera's MV3 implementation or if it's implicit

---

_Brain Dump Inbox · Dispatch Direct · Dial Up Dispatch · May 2026 · fueled by Dr Pepper_
