# asharim-portfolio

Interactive engineering-environment portfolio for Sharim Ansari, Senior Full Stack Engineer.
Built with React 18, TypeScript, Vite, Tailwind CSS v4, Motion (`motion/react`), and Lucide icons.

## Commands

```bash
npm install       # install dependencies
npm run dev       # start dev server (http://localhost:5173)
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build locally
```

## The SHARIM.OS layer

Beyond the portfolio content, the site behaves like a small operating system:

- **Boot sequence** — ~1.8s cinematic init on first visit per session (skippable, skipped under reduced motion)
- **System console** — collapsible SHARIM.OS terminal (bottom-left) that narrates navigation and behaviour
- **Command palette** — `Ctrl+K` or `/`; keyboard-navigable; try `sudo explore`
- **Discovery Mode** — toggle via the SYSTEM ONLINE status widget, the palette, or `sudo explore`
- **ENTER SYSTEM** — cinematic dive-through-the-stack intro on the hero
- **Interest selector** — "WHAT BROUGHT YOU HERE?" personalizes a recommended route
- **Section rail** — right-edge navigation dots tracking the active section (desktop)
- **Project modules** — hover readouts, boot sequence on open, EXPLORE/INSPECT/DETAILS cursor verbs
- **AI Gateway simulation** — type prompts or hit RUN SECURITY TEST; fully client-side, nothing leaves the browser
- **Session summary** — per-session recap above the contact CTA (sessionStorage only, no personal data)

All session state lives in `sessionStorage` under the `sharim-os` key — non-sensitive UI state only.
Every animation path respects `prefers-reduced-motion`.

## Structure

```
public/
  Sharim-Ansari-Senior-Full-Stack-Engineer.pdf   # served at /Sharim-Ansari-Senior-Full-Stack-Engineer.pdf (Download Resume buttons)
src/
  data/         # ALL portfolio content — edit these to update the site
  lib/system.ts # SHARIM.OS store: console, sections, discovery, session tracking
  sections/     # one component per page section
  components/   # shared UI (console, palette, boot, cursor, rail, diagrams…)
  hooks/        # count-up, media queries, system observer
```

## Updating content

Everything user-visible is data-driven — edit the files in `src/data/` and rebuild.
To replace the resume, overwrite `public/Sharim-Ansari-Senior-Full-Stack-Engineer.pdf` (keep the filename,
or update `resumeFile` in `src/data/profile.ts`).

Before deploying, replace the canonical URL placeholder in `index.html`
(`<link rel="canonical" … data-placeholder="canonical-url" />`) with the real domain.

## Deploying

`npm run build` produces a fully static site in `dist/` — deploy to any static host
(Vercel, Netlify, Cloudflare Pages, GitHub Pages, S3). No server or environment
variables required. The contact form composes a `mailto:` draft in the visitor's own
mail client; the site itself sends nothing.

## Engineering notes

- 3D-style visuals use canvas/SVG/CSS animation rather than WebGL — deliberate, for
  performance and bundle size (~130KB gzip total JS, code-split per section)
- Animation library is `motion` (`motion/react` imports), the successor to framer-motion
- The system store (`lib/system.ts`) is a `useSyncExternalStore` external store so
  scroll observers and hover events never re-render the component tree
