# Film Director Portfolio

A cinematic, A24-inspired multi-page portfolio website for a film director. Built with Vite + TypeScript + GSAP + Lenis + SplitType.

## Tech Stack

- **Build**: Vite 5 + TypeScript
- **Animation**: GSAP 3 (ScrollTrigger, SplitText)
- **Smooth Scroll**: Lenis
- **Text Effects**: SplitType
- **Video**: Plyr.js
- **Style**: Pure CSS (no framework)

## Pages

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Hero showreel, film grid, manifesto, awards, clients, BTS, contact CTA |
| About | `pages/about.html` | Portrait, bio, timeline, philosophy |
| Filmography | `pages/filmography.html` | Interactive catalog with filters |
| Film | `pages/film.html` | Project page: hero video, synopsis, gallery, BTS, credits |
| Journal | `pages/journal.html` | Visual essays with category filters |
| Contact | `pages/contact.html` | Animated background, inquiry form |
| 404 | `pages/404.html` | "Scene Missing" error page |

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
film-director-portfolio/
├── index.html                 # Home page
├── package.json
├── tsconfig.json
├── vite.config.ts
├── css/
│   ├── variables.css          # Design tokens
│   ├── style.css              # Reset + base styles + all page styles
│   ├── animations.css         # Keyframes + reveal classes
│   ├── components.css         # Reusable UI components
│   ├── about.css              # About page styles
│   ├── filmography.css        # Filmography page styles
│   ├── film.css               # Film detail page styles
│   ├── journal.css            # Journal page styles
│   ├── contact.css            # Contact page styles
│   └── 404.css                # 404 page styles
├── js/
│   ├── main.ts                # Core app (loader, scroll, cursor, nav)
│   ├── filmography.ts         # Filmography filter logic
│   ├── gallery.ts             # Lightbox for film stills
│   ├── journal.ts             # Journal filter logic
│   └── contact.ts             # Contact form handling
├── pages/
│   ├── about.html
│   ├── filmography.html
│   ├── film.html
│   ├── journal.html
│   ├── contact.html
│   └── 404.html
├── data/
│   ├── filmography.json       # Film catalog data
│   ├── journal.json           # Journal entries
│   ├── awards.json            # Awards data
│   └── clients.json           # Client list
├── assets/
│   ├── images/                # SVG placeholder images
│   ├── icons/                 # SVG favicon
│   ├── fonts/                 # Custom fonts (if any)
│   ├── audio/                 # Ambient sound (placeholder)
│   ├── videos/                # Video posters/trailers (placeholder)
│   └── shaders/               # GLSL shaders (film grain, chromatic, etc.)
└── dist/                      # Build output
```

## Design System

### Colors
- **Black**: `#050505` — primary background
- **Gold**: `#b8934b` — accent color
- **Blood**: `#7a2331` — secondary accent
- **White**: `#f5f0e8` — text color

### Typography
- **Display**: Cormorant Garamond (headings, titles)
- **Body**: Inter (paragraphs, UI)
- **Mono**: JetBrains Mono (labels, captions)

### Features
- Film leader countdown loader
- Custom cursor with VIEW/PLAY/OPEN states
- Fullscreen navigation with background video
- Smooth scroll with Lenis
- Scroll-triggered reveal animations
- Film grain + dust particle overlays
- Parallax effects
- Film scratch + projector beam effects
- GLSL shader effects (progressive enhancement)
- Reduced motion support (`prefers-reduced-motion`)

## Placeholder Assets

All images, videos, and audio are SVG/text placeholders. Replace with real assets:

1. **Images**: Replace SVG files in `assets/images/` with real JPG/WebP
2. **Videos**: Add MP4 files to `assets/videos/`
3. **Audio**: Add ambient sound MP3 to `assets/audio/`
4. **Fonts**: Google Fonts loaded via CDN (Cormorant Garamond, Inter, JetBrains Mono)

## License

MIT License. See [LICENSE](LICENSE) for details.
