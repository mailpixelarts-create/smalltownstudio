# System Debug Status

**Date**: 2025-07-21
**Scope**: TypeScript fixes, preloader, page transitions, cursor cleanup, SplitType animations, branding updates, video lightbox, hero animation

---

## Changes Made

### js/main.ts
| # | Bug | Fix | Lines |
|---|-----|-----|-------|
| 1 | `gsap.utils.toArray()` returns `unknown[]` — 3 TS errors on `.section-label`, `[data-split="chars"]`, `[data-split="lines"]` | Cast results as `HTMLElement[]` | 126, 141, 158 |
| 2 | Preloader count interval continues after GSAP timeline completes | Added `clearInterval(countInterval)` to timeline top-level `onComplete` | 38 |
| 3 | `initPageTransitions` double-RAF for `is-loading` removal fragile | Replaced with `getComputedStyle` forced layout | 402-404 |
| 4 | Cursor `requestAnimationFrame` loop runs forever — no cleanup on navigation | Stored RAf ID in `cursorRafId`, cancel on page leave | 10, 333, 416 |
| 5 | Double-click on internal links triggers fade-out twice | Added `is-leaving` early return guard | 414 |
| 6 | `gsap.from()` on SplitType `.char` elements stuck at `opacity: 0; y: 100%` — titles truncated | Switched to `gsap.fromTo()` with explicit start/end states + empty-length guards | 141-172 |
| 7 | Hero title "Aritra & Ayushman" jumps in — `is-loading` removed before char animation completes | Hero title now animates `.hero__title-line` elements from `y: 60, opacity: 0`; body `is-loading` removed only after `onComplete` | 144-178 |
| 8 | `chars.length === 0` early return blocks hero animation | Moved `isHero` check before the `chars.length` guard | 142-143 |

### css/style.css
| # | Bug | Fix | Lines |
|---|-----|-----|-------|
| 1 | `scroll-behavior: smooth` on html conflicts with Lenis | Removed | 10-15 |
| 2 | Incomplete Lenis CSS | Added `html.lenis`, `html.lenis.lenis-smooth`, `html.lenis.lenis-stopped` rules | 17-27 |
| 3 | No CSS for page transitions | Added `body opacity transition`, `.is-loading`, `.is-leaving` rules | 29-48 |
| 4 | Cursor has no fade-in transition | Added `transition: opacity 0.3s` to `.cursor` | 191 |
| 5 | `font-variant: small-caps` on `.clients__logo` | Restored `font-variant: small-caps` (user preference) | 761 |
| 6 | Header logo not gold | Added `color: var(--color-gold)` to `.nav__logo-text` | 283 |

### css/filmography.css
| # | Addition | Lines |
|---|----------|-------|
| 1 | Video lightbox styles (`.video-lightbox`, close button, responsive) | 38-82 |

### js/filmography.ts
| # | Addition | Description |
|---|----------|-------------|
| 1 | Video lightbox open/close | Click film card → embed Vimeo in lightbox; close via X, click outside, or Escape |

### pages/filmography.html
| # | Change | Description |
|---|--------|-------------|
| 1 | Added `data-vimeo` attribute to all 6 film cards | Vimeo video ID for lightbox embed |
| 2 | Changed `<a>` to `<div>` on `.film-card__link` | Prevents navigation, opens lightbox instead |
| 3 | Added video lightbox HTML | `.video-lightbox` container with close button and player div |

### index.html
| # | Change | Description |
|---|--------|-------------|
| 1 | Footer name: "Alexander Noir" → "Small Town studio" | Branding update |
| 2 | All email: "hello@alexandernoir.com" → "hello@smalltimestudio.com" | Branding update |
| 3 | Client logos: "SONY SPORTS" etc → lowercase with `font-variant: small-caps` | Branding update |
| 4 | Awards section: replaced with 6 new brand/celebrity entries | Content update |
| 5 | Section title: "Brands & Artists" → "Brands & Collaborations" | Content update |
| 6 | "Featured Films" → "Featured Work" | Content update |

### All 6 pages (about, contact, film, filmography, journal, 404)
| # | Change | Description |
|---|--------|-------------|
| 1 | Footer name: "Alexander Noir" → "Small Town studio" | Branding update |
| 2 | All email: "hello@alexandernoir.com" → "hello@smalltimestudio.com" | Branding update |

---

## Known Issues

| # | Issue | Status | Description |
|---|-------|--------|-------------|
| 1 | Hero title animation still not smooth | Open | Despite moving `is-loading` removal to hero `onComplete` and switching to `.hero__title-line` animation, the title still appears to jump. Possible cause: loader `onComplete` fires at timeline build time, not after fade-out CSS transition finishes. Needs further investigation — may require tying hero reveal to loader's CSS `transitionend` event instead of GSAP timeline `onComplete`. |

---

## Files Changed
- `js/main.ts` — 8 fixes (TS types, preloader interval, page transitions, cursor cleanup, double-click guard, SplitType fromTo, hero line animation, hero guard reorder)
- `js/filmography.ts` — rewritten (filter + video lightbox)
- `css/style.css` — 6 changes (Lenis, transitions, cursor, small-caps, gold logo)
- `css/filmography.css` — video lightbox styles added
- `index.html` — branding + content updates
- `pages/filmography.html` — Vimeo lightbox integration
- `pages/about.html` — branding update
- `pages/contact.html` — branding update
- `pages/film.html` — branding update
- `pages/journal.html` — branding update
- `pages/404.html` — branding update

## Files NOT Changed (no issues found)
- `css/variables.css` — design tokens correct
- `css/animations.css` — keyframes and reveals correct
- `css/components.css` — component styles correct
- `vite.config.ts` — build config correct
