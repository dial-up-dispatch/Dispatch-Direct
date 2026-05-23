# The Void — Opera Sidebar Extension
### A Dispatch Direct Release · Dial Up Dispatch

_Started: May 2026_

---

## What It Is

The Void is a single-purpose release canvas that lives in your Opera sidebar. It exists to receive the intrusive fragments, loops, and worries living rent-free in your head — and dissolve them. Not organize them. Not solve them. Receive them, and let them go.

It is not a journal. It is not a productivity tool. It has no memory. It is only an ear, vast and silent — always within reach, never in your way.

It is the second official **Dispatch Direct** extension.

---

## Origin

> *"received. the void remains unmoved. so can you."*

The Void was built as a deliberate counterpoint to Brain Dump Inbox. Where Brain Dump *catches*, The Void *consumes*. Where Brain Dump remembers everything, The Void forgets on purpose. The content is physically purged from memory the instant you release it. That's not a missing feature. That's the entire point.

The sidebar is its natural home — present at the edge of your attention, available the moment something surfaces, gone the moment you're done with it.

---

## The One Goal (Opera Compliance)

**Provide a private, ceremonial release space for intrusive thoughts — with no storage, no history, and no trace.**

That's it. One goal. The dissolution *is* the feature.

---

## Browser Support

| Browser | Status | Notes |
|---|---|---|
| Opera One | ✅ v1.0 target | Native `sidebar_action` — this is home |
| Firefox | 🔜 v1.x maybe | Same `sidebar_action` API, natural expansion |
| Chrome | ⏳ future | Different API, separate manifest |
| Edge | — | Not a priority |

---

## What Changes for the Extension Port

### Structural Changes

| Original App | Extension Version |
|---|---|
| Full browser tab, full viewport | Opera sidebar panel, narrow |
| Immersive full-screen experience | Focused, contained sidebar panel |
| Mouse/keyboard interaction | Same — keyboard-first still works perfectly |
| External font loading | Bundled locally |

### What Stays Exactly the Same
- The core ritual — type, release, dissolve
- Generative ambient audio (Web Audio API — drone, texture, or both)
- Synthesized mechanical keystroke clicks with randomized pitch
- Three signal themes: The Expanse · The Deep · Crimson Nebula
- Breathing ambience modes: silence · the drone · the texture · both
- Sound and click toggles
- Optional count mode ("the void remembers" — just a number, never content)
- Zero content storage — thoughts vanish on release, forever
- Settings persistence via localStorage (theme, sound prefs, count toggle only)
- The dissolve animation — the moment of release is sacred
- The voice and copy — "received." "the void remains unmoved."

### What Gets Adapted
- **Layout** — single column, full-height panel. The input lives at the center or bottom. The void breathes around it.
- **Font loading** — bundle locally. No CDN. No external requests.
- **Visual atmosphere** — the full-screen darkness compresses into the sidebar. The breathing, the CRT glow, the signal themes all translate — they just inhabit a narrower space. This might actually feel *more* intimate.
- **Audio context** — Web Audio API works identically in extension panels. No changes needed.

### What Gets Added
- **Manifest v3** — `manifest.json` with `sidebar_action`
- **Icon set** — 16 · 32 · 48 · 128px
- **Privacy policy** — the simplest one we'll ever write
- **Support page** — Dial Up Dispatch Tumblr, Dispatch Direct tag

---

## Manifest Structure

```json
{
  "manifest_version": 3,
  "name": "The Void",
  "version": "1.0.0",
  "description": "A private release space for intrusive thoughts. Type what's in your head. Press Enter. Watch it dissolve. The void stores nothing.",
  "sidebar_action": {
    "default_icon": {
      "16": "icons/icon-16.png",
      "32": "icons/icon-32.png",
      "48": "icons/icon-48.png",
      "64": "icons/icon-64.png",
      "128": "icons/icon-128.png"
    },
    "default_panel": "panel.html",
    "default_title": "The Void"
  },
  "permissions": ["storage"],
  "icons": {
    "16": "icons/icon-16.png",
    "32": "icons/icon-32.png",
    "48": "icons/icon-48.png",
    "64": "icons/icon-64.png",
    "128": "icons/icon-128.png"
  }
}
```

**Permissions philosophy:** `storage` only — and only for settings (theme, sound prefs, optional count). Never for content. Content is never stored.

---

## File Structure

```
the-void/
├── manifest.json
├── panel.html                ← the sidebar panel
├── css/
│   └── style.css
├── js/
│   └── app.js
├── fonts/
│   └── [chosen font]/        ← bundled locally
│       └── *.woff2
└── icons/
    ├── icon-16.png
    ├── icon-32.png
    ├── icon-48.png
    ├── icon-64.png
    └── icon-128.png
```

**No build system required.** Vanilla HTML/CSS/JS. Same reasoning as Brain Dump Inbox — honors the origin, readable for moderators, lightweight.

---

## Layout — Sidebar Panel

The Void's layout is the inverse of Brain Dump Inbox. Less structure. More space. The input is the only real element — everything else is atmosphere around it.

```
┌─────────────────────────────┐
│                             │
│   ·  ·  ·  the void  ·  ·  │  ← minimal header, title only
│                             │
│  ┌───────────────────────┐  │
│  │                       │  │
│  │  type what's in your  │  │
│  │  head.                │  │
│  │                       │  │  ← breathing textarea, center stage
│  └───────────────────────┘  │
│                             │
│        [ RELEASE ]          │  ← or just Enter key
│                             │
│  ·  ·  ·  ·  ·  ·  ·  ·  · │  ← signal/breathing indicator, bottom
│  🔊  ≋  ◉ expanse      ···  │  ← sound · breathing · signal · count
└─────────────────────────────┘
```

The dissolve happens in place — the text fades, collapses, gone. "received." appears briefly. Then silence.

---

## Signal Themes

| Theme | Feel | Color |
|---|---|---|
| the expanse | cold, vast, the quiet between stars | deep blue-black, ice accent |
| the deep | ancient, weighted, something older than words | near-black, deep teal accent |
| crimson nebula | slow burn, distant light, something ending beautifully | dark, deep crimson accent |

Themes use CSS custom properties on `body[data-signal]`. Same pattern as Brain Dump Inbox themes.

---

## Audio System

Web Audio API, fully generative, fully synthesized. No audio files. No external requests. Everything computed in the browser.

| Mode | What It Does |
|---|---|
| silence | just the dark |
| the drone | deep procedural tones, something ancient underneath |
| the texture | noise shaped into something vast and soft |
| both | the drone inside the dark. the full depth. |

Keystroke clicks: synthesized mechanical sounds, randomized pitch per keystroke. Same approach as Brain Dump Inbox.

Audio context initializes on first user interaction (browser requirement). Handles gracefully if interaction hasn't happened yet.

---

## The Release Ritual

This is the core interaction. It must feel right.

1. User types. Each keystroke has a mechanical voice.
2. User presses `Enter` (not `Shift+Enter`) or clicks `[ RELEASE ]`
3. The text dissolves — animation: fade + collapse, ~400ms
4. "received." appears briefly in the void
5. Input clears. Silence returns. The void breathes.
6. If count mode is on, the number increments silently.

**Nothing is stored.** The content never touches localStorage. It lives only in the DOM and in the AudioContext for the duration of the keystroke — then it's gone.

---

## Data & Privacy

**The simplest privacy policy we will ever write.**

| Key | Contents |
|---|---|
| `void-signal` | Active signal theme |
| `void-breathing` | Active breathing mode |
| `void-sound` | Sound on/off |
| `void-clicks` | Click sounds on/off |
| `void-count-enabled` | Whether count mode is on |
| `void-count` | A number. Just a number. |
| `void-first-transmission` | Timestamp of first use (if count enabled) |
| `void-last-transmission` | Timestamp of most recent use (if count enabled) |

That's everything. No content. Never content.

**Privacy policy statement (for submission):**
> The Void stores nothing you type. Ever. Your thoughts are dissolved the moment you release them and are never written to any storage. The only data stored locally is your settings preferences and, if you enable it, a count of how many times you've used The Void. No data is transmitted to any server. No account is required.

---

## Opera Store Listing

**Name:** The Void

**Category:** Entertainment (possibly Productivity — lean toward Entertainment given the acceptance criteria "valuable functionality" framing)

**Version:** 1.0.0

**Summary:**
> A private release space for intrusive thoughts. Type what's in your head. Press Enter. Watch it dissolve. The Void stores nothing — not a single word.

**Description:**
> The Void lives in your Opera sidebar, always within reach. When something is taking up space in your head — an intrusive thought, a looping worry, a feeling you can't name — you reach sideways, type it, and release it. Watch it dissolve. Hear it go. Return to what you were doing.
>
> It is not a journal. It is not a productivity tool. It has no memory. It exists only to receive.
>
> Three signal atmospheres: The Expanse (cold, vast), The Deep (ancient, weighted), Crimson Nebula (slow burn, distant light). Generative ambient audio synthesized live in the browser — no audio files, no loops, nothing that ever repeats exactly. Mechanical keystroke sounds with randomized pitch. A dissolve animation that makes the release feel real.
>
> The Void stores nothing you type. Your words vanish the moment you release them. Settings and an optional use count are the only things that ever touch your browser's storage.
>
> The Void is a Dispatch Direct extension — tools that live beside you.

**Support page:** Dial Up Dispatch Tumblr — Dispatch Direct tag

---

## Icon Direction

The Void's icon should feel like staring into something that stares back — but gently.

**Concept:** A dark circle or void shape with the faintest suggestion of depth or light at the center. Not a black hole emoji. Something designed. Minimal. Slightly unnerving. Beautiful at small sizes.

**Alternate concept:** A single dissolving or fading element — a dot, a word fragment, something in the act of disappearing.

**Sizes needed:** 16 · 32 · 48 · 64 · 128px

**Note:** 64px is required by Opera for submission. All five sizes must be present in both `sidebar_action.default_icon` and the top-level `icons` block in `manifest.json`.

**Style:** Anti-aliased PNG with transparent background. Dark-first — this icon lives best on dark sidebar backgrounds.

---

## Screenshots Needed (for submission)

1. **Panel in sidebar** — Opera browser with The Void open in the sidebar, mid-dissolve or at rest. Dark, atmospheric. 612×408px.
2. **Signal themes** — three signal themes shown, demonstrating the visual range.

---

## Addressing the "Valuable Functionality" Criterion

Opera's acceptance criteria say extensions can't just be a static page or a button linking to a website — they must provide valuable functionality.

The Void provides:
- Generative real-time audio synthesis (Web Audio API)
- Animated dissolution interaction
- Theme switching with distinct visual atmospheres
- Optional persistent count with timestamps
- A deliberate, purposeful UX pattern (release ritual)

The *intentional absence* of storage is a feature, not a gap. The description should make this clear. Frame it as a *mindfulness tool* and *focus companion* — the dissolution is the functionality.

---

## Phase Roadmap

**v1.0 — Ship It**
- Sidebar-optimized layout
- Full audio system intact
- All three signal themes
- Dissolve animation
- Count mode
- Bundled fonts
- Manifest v3
- Icons (16 · 32 · 48 · 64 · 128px — all five required for Opera submission)
- Store listing ready

**v1.1 — Nice to Have**
- Breathing animation synced to audio
- Additional signal themes
- Firefox support

**v2.0 — Dispatch Direct Cohesion**
- Shared theme language with Brain Dump Inbox (where it makes sense)
- Possible: "send to Brain Dump" option for the rare thought that should be caught instead of released

---

## What We're Not Doing

- No content storage. Ever. This is non-negotiable.
- No export. There is nothing to export. That's the point.
- No React. No build system. Vanilla.
- No external requests of any kind.
- No gamification. No streaks. No rewards. The void doesn't celebrate you. It just receives you.

---

## Open Questions

- [ ] Does the full-screen breathing/atmosphere translate well to sidebar dimensions? (Answer: probably yes — need to test)
- [ ] Font choice — The Void used a specific typeface. Confirm font name, confirm OFL/free license for bundling.
- [ ] The dissolve animation — confirm CSS transition approach from the original and port directly
- [ ] Category decision: Entertainment vs Productivity? Lean Entertainment but worth deciding before submission.
- [ ] "received." copy — does this need to change at all for the sidebar context? Probably not.

---

_The Void · Dispatch Direct · Dial Up Dispatch · May 2026 · fueled by Dr Pepper_
