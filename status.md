# System Debug Status

**Date**: 2025-07-21
**Updated**: 2025-07-26
**Scope**: TypeScript fixes, preloader, page transitions, cursor cleanup, SplitType animations, branding updates, video lightbox, hero animation, AJAX navigation, custom scrollbar, parallax hover

---

## Changes Made

### js/main.ts
| # | Bug / Feature | Fix / Addition | Status |
|---|---------------|----------------|--------|
| 1 | `gsap.utils.toArray()` returns `unknown[]` — 3 TS errors | Cast results as `HTMLElement[]` | Done |
| 2 | Preloader count interval continues after timeline completes | Added `clearInterval(countInterval)` to `onComplete` | Done |
| 3 | `initPageTransitions` double-RAF for `is-loading` removal fragile | Replaced with `getComputedStyle` forced layout | Done |
| 4 | Cursor `requestAnimationFrame` loop runs forever — no cleanup | Stored RAF ID in `cursorRafId`, cancel on page leave | Done |
| 5 | Double-click on internal links triggers fade-out twice | Added `is-leaving` early return guard | Done |
| 6 | `gsap.from()` on SplitType `.char` elements stuck at `opacity: 0` | Switched to `gsap.fromTo()` with explicit start/end states + empty-length guards | Done |
| 7 | Hero title "Aritra & Ayushman" jumps in — `is-loading` removed before animation completes | Hero title now animates `.hero__title-line` elements from `y: 60, opacity: 0` | Done |
| 8 | `chars.length === 0` early return blocks hero animation | Moved `isHero` check before the `chars.length` guard | Done |
| 9 | Full page reload on every navigation — no page transitions | **AJAX Navigation**: Fetches new page via `fetch()`, parses HTML, replaces `#main` content with animated transition bars. Morph clone from clicked element fills screen during transition. | Done |
| 10 | No custom scrollbar | **Custom Scrollbar**: Creates fixed-position track with gold thumb on right side; updates on scroll/resize; hidden when content fits viewport | Done |
| 11 | No interactive hover on film cards | **Parallax Hover**: 3D tilt effect on film cards using mouse position (rotateX/Y, translate); disabled on mobile | Done |
| 12 | SplitType duplicates nested spans in hero title | Added `if (el.closest('.hero')) return;` skip in `initSplitText()` | Done |

### css/style.css
| # | Bug / Feature | Fix / Addition | Status |
|---|---------------|----------------|--------|
| 1 | `scroll-behavior: smooth` on html conflicts with Lenis | Removed | Done |
| 2 | Incomplete Lenis CSS | Added `html.lenis`, `html.lenis.lenis-smooth`, `html.lenis.lenis-stopped` rules | Done |
| 3 | No CSS for page transitions | Added `body opacity transition`, `.is-loading`, `.is-leaving` rules | Done |
| 4 | Cursor has no fade-in transition | Added `transition: opacity 0.3s` to `.cursor` | Done |
| 5 | `font-variant: small-caps` on `.clients__logo` | Restored (user preference) | Done |
| 6 | Header logo not gold | Added `color: var(--color-gold)` to `.nav__logo-text` | Done |
| 7 | Loader sprocket holes only on left side | Redesigned: holes on both sides (left/right) with `order: -1`/`1` for flex layout | Done |
| 8 | Showreel body text too tight | Adjusted `font-size`, `line-height: 1.9`, added `letter-spacing: 0.01em` | Done |
| 9 | BTR slider images cause layout thrashing | Added `transform: translateZ(0)` for GPU compositing; simplified `will-change` | Done |
| 10 | No AJAX transition overlay styles | Added `.ajax-transition`, `.ajax-transition__bar`, `.ajax-morph` styles | Done |
| 11 | No custom scrollbar styles | Added `.custom-scrollbar`, `.custom-scrollbar__thumb` styles + `html` scrollbar customization (`scrollbar-width`, `::-webkit-scrollbar`) | Done |

### css/animations.css
| # | Addition | Description | Status |
|---|----------|-------------|--------|
| 1 | Parallax hover on film cards | `.film-card .film-card__image` with `perspective: 800px`, `transform-style: preserve-3d`; hover state `translateZ(10px)` | Done |

### css/filmography.css
| # | Addition | Description | Status |
|---|----------|-------------|--------|
| 1 | Video lightbox styles | `.video-lightbox`, close button, responsive | Done |

### js/filmography.ts
| # | Addition | Description | Status |
|---|----------|-------------|--------|
| 1 | Video lightbox open/close | Click film card → embed Vimeo in lightbox; close via X, click outside, or Escape | Done |

### pages/filmography.html
| # | Change | Description | Status |
|---|--------|-------------|--------|
| 1 | Added `data-vimeo` attribute to all 6 film cards | Vimeo video ID for lightbox embed | Done |
| 2 | Changed `<a>` to `<div>` on `.film-card__link` | Prevents navigation, opens lightbox instead | Done |
| 3 | Added video lightbox HTML | `.video-lightbox` container with close button and player div | Done |

### index.html
| # | Change | Description | Status |
|---|--------|-------------|--------|
| 1 | Footer name: "Alexander Noir" → "Small Town Studio" | Branding update | Done |
| 2 | All email: "hello@alexandernoir.com" → "hello@smalltimestudio.com" | Branding update | Done |
| 3 | Client logos: "SONY SPORTS" etc → lowercase with `font-variant: small-caps` | Branding update | Done |
| 4 | Awards section: replaced with 6 new brand/celebrity entries | Content update | Done |
| 5 | Section title: "Brands & Artists" → "Brands & Collaborations" | Content update | Done |
| 6 | "Featured Films" → "Featured Work" | Content update | Done |
| 7 | Loader sprocket holes restructured | Added left + right sprocket hole columns with 12 spans each | Done |
| 8 | Film card image: Vimeo thumbnail → local asset | Changed to `/assets/filmography/online-legal.PNG` | Done |

### All pages (about, contact, film, filmography, journal, 404)
| # | Change | Description | Status |
|---|--------|-------------|--------|
| 1 | Footer name: "Alexander Noir" → "Small Town Studio" | Branding update (capital S) | Done |
| 2 | All email: "hello@alexandernoir.com" → "hello@smalltimestudio.com" | Branding update | Done |

---

## Known Issues

| # | Issue | Status | Description |
|---|-------|--------|-------------|
| 1 | Hero title animation still not smooth | Open | Despite moving `is-loading` removal to hero `onComplete` and switching to `.hero__title-line` animation, the title still appears to jump. Possible cause: loader `onComplete` fires at timeline build time, not after fade-out CSS transition finishes. Needs further investigation — may require tying hero reveal to loader's CSS `transitionend` event instead of GSAP timeline `onComplete`. |

---

## Architecture Notes

### AJAX Navigation System
- Uses event delegation on `document` to intercept internal link clicks
- Fetches target page via `fetch()`, parses with `DOMParser`, replaces `#main` innerHTML
- Transition overlay: two bars (top/bottom) slide in/out with GSAP
- Morph clone: captures clicked element's image, animates to fill viewport during transition
- Browser back/forward handled via `popstate` listener
- All page features re-initialized via `reinitializePage()` after content swap
- `ScrollTrigger` instances killed before re-init to prevent memory leaks

### Custom Scrollbar
- Fixed-position track on right side (desktop only, `window.innerWidth >= 768`)
- Gold thumb (`var(--color-gold)`) with 0.4 opacity, 0.8 on hover
- Updates on scroll and resize via `requestAnimationFrame`
- Default scrollbar styled via `::-webkit-scrollbar` and `scrollbar-width`

### Parallax Hover
- `perspective: 800px` on `.film-card__image` container
- Mouse position mapped to `rotateX`, `rotateY`, `x`, `y` transforms
- GSAP animates with `power2.out` on move, `power3.out` on leave
- Disabled on mobile (`window.innerWidth < 768`)

---

## Files Changed
- `js/main.ts` — 12 changes (8 original fixes + AJAX navigation + custom scrollbar + parallax hover + SplitType hero skip)
- `js/filmography.ts` — rewritten (filter + video lightbox)
- `css/style.css` — 11 changes (Lenis, transitions, cursor, small-caps, gold logo, loader, showreel, BTR, AJAX overlay, scrollbar)
- `css/animations.css` — parallax hover keyframes
- `css/filmography.css` — video lightbox styles added
- `index.html` — branding + content updates + loader restructure + film card image
- `pages/filmography.html` — Vimeo lightbox integration
- `pages/about.html` — branding update
- `pages/contact.html` — branding update
- `pages/film.html` — branding update
- `pages/journal.html` — branding update
- `pages/404.html` — branding update

## Files NOT Changed (no issues found)
- `css/variables.css` — design tokens correct
- `css/components.css` — component styles correct
- `vite.config.ts` — build config correct
- `tsconfig.json` — TypeScript config correct
