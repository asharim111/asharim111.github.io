# Deployment Guide — Sharim Ansari Portfolio

> Assessment and hosting options for this project.
> Written 2026-08-21. Free-tier limits change; re-verify before committing to a provider.

---

## 1. Verdict: Is GitHub Pages good for THIS site?

**Yes — it's a near-perfect fit.** This isn't a generic "static sites work on Pages"
answer; here is what was actually checked in this repo:

| Requirement checked | Finding | Pages compatible? |
| --- | --- | --- |
| Backend / server code | None. No Express, no API routes. | ✅ |
| Runtime data fetching | No `fetch(`, no `axios` anywhere in `src/` | ✅ |
| Environment variables / secrets | No `import.meta.env.*`, no `process.env` | ✅ |
| Client-side routing | **No router.** Single-page scroll with anchor sections | ✅ (big win — see §1.1) |
| Contact form backend | None needed — `src/sections/Contact.tsx:25` opens a `mailto:` draft | ✅ |
| Build output size | `dist/` ≈ **778 KB** (limit is 1 GB) | ✅ |
| Assets | `favicon.svg` + one 289 KB PDF in `public/` | ✅ |
| Server-side headers / redirects | Not used | ✅ |

Bottom line: this is a pure client-rendered static bundle. GitHub Pages serves it
with free HTTPS, a global CDN, custom-domain support, and zero cost — with no
feature of the site left behind.

### 1.1 Why "no router" matters

Most React SPAs break on GitHub Pages because Pages has no rewrite rules — a deep
link like `/projects` returns a hard 404 instead of falling back to `index.html`.
The usual workaround is the ugly `404.html` redirect hack or switching to
`HashRouter`.

**This site sidesteps that entirely.** Navigation is in-page anchor scrolling
(`#about`, `#projects`, …), so every URL is just `/` plus a fragment. The fragment
never reaches the server. No hack required.

---

## 2. Two things you MUST fix before deploying to Pages

These are real, repo-specific breakages — not boilerplate warnings.

### ⚠️ Issue 1 — The base path (this WILL break the site)

Your remote is `https://github.com/asharim111/asharim-portfolio.git`, so Pages will
serve the site at:

```
https://asharim111.github.io/asharim-portfolio/
```

That trailing `/asharim-portfolio/` is a **subdirectory**. But `dist/index.html`
currently requests assets from the domain root:

```html
<script type="module" crossorigin src="/assets/index-D7mLHFRX.js"></script>
<link rel="icon" href="/favicon.svg" />
```

The browser resolves `/assets/...` to `asharim111.github.io/assets/...` — which
does not exist. **Result: a blank white page.**

You have two ways out.

#### Option A — Rename the repo to a user site (recommended)

Rename the GitHub repo to exactly **`asharim111.github.io`**. GitHub then serves it
at the domain root:

```
https://asharim111.github.io/
```

The base path stays `/`, **nothing in the code needs to change**, and you get the
cleaner URL for a personal portfolio. You get one user site per GitHub account.

#### Option B — Keep the repo name and set a base

Add `base` to `vite.config.ts`:

```ts
export default defineConfig({
  base: "/asharim-portfolio/",   // must match the repo name, leading + trailing slash
  plugins: [react(), tailwindcss()],
  // ...rest unchanged
});
```

Vite rewrites the paths inside `index.html` automatically. **But it does not rewrite
string literals in your TypeScript** — which brings us to Issue 2.

### ✅ Issue 2 — The hardcoded resume path (FIXED)

> **Resolved.** `src/data/profile.ts:19` now uses `import.meta.env.BASE_URL`.
> Kept here for context. Original problem:

`src/data/profile.ts:19` contained:

```ts
resumeFile: "/Sharim-Ansari-Resume.pdf",
```

This is a plain string, so Vite leaves it untouched regardless of the `base` setting.
Under Option B it resolves to `asharim111.github.io/Sharim-Ansari-Resume.pdf` →
**404, and the "Download Resume" buttons silently fail** in the Navbar, Hero, and
Command Palette.

Fix — make it base-aware:

```ts
resumeFile: `${import.meta.env.BASE_URL}Sharim-Ansari-Resume.pdf`,
```

`BASE_URL` already ends in a slash, so do **not** add one. This is correct under
both Option A (`/`) and Option B (`/asharim-portfolio/`), and works on every host
in this document.

> Under Option A this isn't strictly required — but do it anyway, so the project
> stops depending on being at the domain root.

### ✅ Canonical URL + social preview card (FIXED)

Both done, targeting **Option A** (`https://asharim111.github.io/`):

- **Canonical** — placeholder replaced; the stale comment and the
  `data-placeholder="canonical-url"` attribute were removed.
- **`public/og-image.png`** — a 1200×630 card (147 KB) generated to match the site:
  the `@theme` palette from `index.css` (ink `#05070d`, cyan `#22d3ee`, violet
  `#8b5cf6`, mint `#34d399`), the 44px technical grid from `.grid-bg`, and the real
  Space Grotesk / Inter / JetBrains Mono webfonts.
- **Meta tags added** — `og:url`, `og:locale`, `og:image` (+ `:type`, `:width`,
  `:height`, `:alt`), `twitter:image`, `twitter:image:alt`. `twitter:card` was
  already `summary_large_image`, which is the correct pairing.

Two things to know about these tags:

1. **`og:image` must be an absolute URL.** LinkedIn and X fetch it from their own
   servers, where a root-relative `/og-image.png` has no host to resolve against.
   This is why the value is hardcoded to the domain rather than using `BASE_URL`.
2. **If you change the deploy URL, these tags do not follow.** Swapping to a custom
   domain or Option B means updating the absolute URLs in `index.html`.

**Scrapers cache aggressively.** If you regenerate the image later, the platforms
will keep serving the old one. Either rename the file (`og-image-v2.png`) or force
a re-scrape:

- LinkedIn — [Post Inspector](https://www.linkedin.com/post-inspector/)
- X — [Card Validator](https://cards-dev.twitter.com/validator)
- Facebook/Meta — [Sharing Debugger](https://developers.facebook.com/tools/debug/)

Verify these **after** the site is live — the scrapers must be able to reach the URL.

---

## 3. Deploying to GitHub Pages — step by step

`dist` is listed in `.gitignore:83`, and it should stay that way. Don't commit the
build. Use GitHub Actions to build on push instead.

### Step 1 — Apply the fixes from §2

Pick Option A or B, and patch `profile.ts`.

### Step 2 — Add the workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

# Let an in-flight deploy finish; never run two at once.
concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci
      - run: npm run build          # runs `tsc -b && vite build`

      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Note that `npm run build` runs `tsc -b` first, and `tsconfig.app.json` has
`noUnusedLocals` and `noUnusedParameters` enabled. **An unused import will fail the
deploy.** Run `npm run build` locally before pushing.

### Step 3 — Enable Pages

Repo → **Settings** → **Pages** → **Source: GitHub Actions**. (Not the older
"Deploy from a branch" option.)

### Step 4 — Push

```bash
git add -A
git commit -m "chore: add GitHub Pages deployment"
git push origin main
```

Watch the **Actions** tab. The first deploy takes ~1–2 minutes; the URL appears in
the Pages settings once it's live.

### Step 5 (optional) — Custom domain

Settings → Pages → Custom domain → e.g. `sharimansari.dev`. At your DNS registrar:

| Type | Name | Value |
| --- | --- | --- |
| `A` | `@` | `185.199.108.153` |
| `A` | `@` | `185.199.109.153` |
| `A` | `@` | `185.199.110.153` |
| `A` | `@` | `185.199.111.153` |
| `CNAME` | `www` | `asharim111.github.io` |

Then tick **Enforce HTTPS** once the certificate provisions (can take up to 24 h).
With a custom domain at the apex the site sits at `/`, so revert `base` to `/` if
you took Option B.

---

## 4. GitHub Pages — limits and honest downsides

| Aspect | Detail |
| --- | --- |
| Cost | Free |
| Site size | 1 GB (you're at ~0.08 % of it) |
| Bandwidth | 100 GB/month soft limit |
| Builds | 10/hour soft limit |
| HTTPS | Free, automatic, custom domains included |
| Private repos | ❌ Pages from a **private** repo requires a paid GitHub plan |

**Where it falls short:**

- **No control over HTTP headers.** You cannot set CSP, HSTS, or cache-control.
  For a portfolio this is a non-issue; for anything security-sensitive it isn't.
- **No redirects or rewrites.** No `_redirects` file, no server-side rewrite rules.
  ~~Locks you out of client-side routing later.~~ **Addressed** — see §4.1.
- **No preview deployments.** Every provider in §5 gives you a unique URL per pull
  request. Pages does not.
- **No server-side anything.** No functions, no forms, no edge logic. If you later
  want a real contact form instead of `mailto:`, you'll need a third-party service
  (Formspree, Web3Forms) or a different host.
- **Static IP-based CDN**, generally slower TTFB than Cloudflare's edge network.

### 4.1 ✅ Routing fallback — `public/404.html`

GitHub Pages serves `404.html` (with a genuine HTTP 404 status) for any path that
doesn't exist. `public/404.html` uses that as a three-stage resolver:

| Requested path | Result |
| --- | --- |
| `/projects`, `/contact`, … | → `/#projects` — a real anchor on the homepage |
| A path listed in `SPA_ROUTES` | → encoded, then restored by `index.html` |
| Anything else | → a branded 404 page, HTTP 404 preserved |

**Why not the standard hack.** The usual `spa-github-pages` snippet routes *every*
unknown URL into the app. With no router, that renders your homepage under a wrong
URL — a **soft 404**. Google indexes those as thin duplicates and you lose the real
"this page doesn't exist" signal. So stage 2 is gated behind an explicit allowlist:

```js
var SPA_ROUTES = [];   // empty = feature off; unknown URLs stay real 404s
```

**Stage 1 is a genuine win today.** `github.com/asharim111` visitors who guess
`/projects` currently hit a dead end; now they land on the right section.

**When you add a router later**, this is the whole migration:

1. Add the route to `SPA_ROUTES` in `public/404.html` (top-level segment only —
   `"blog"` covers `/blog/any/depth`).
2. Nothing else. The decoder in `index.html` already restores the path via
   `history.replaceState` before the app mounts, so the router sees the correct
   URL on first render. Query strings, hashes, and `&` are handled.

**Verified**, not assumed — 19 unit tests over the resolver and the decoder
(including round-trips and an XSS case), plus browser runs:

- `/projects` → `/#projects`, app mounts, `#projects` present ✅
- `/wp-admin/login.php` → URL unchanged, branded 404, app not loaded, `noindex` ✅
- No horizontal overflow at 360 / 390 / 414 / 768 / 1024 px ✅

### 4.2 Seeing the 404 page locally

Vite's dev server has SPA fallback on by default: **every** unknown path returns
`index.html` with a `200`, so `public/404.html` never renders locally — visiting
`localhost:5173/3fdreg` just showed the homepage.

`vite.config.ts` now registers a small `githubPages404()` plugin that reproduces
Pages' behaviour in both `npm run dev` and `npm run preview`: a navigation to a
path that doesn't resolve to a real file gets `404.html` with a genuine 404
status. It only intercepts `Accept: text/html` GET/HEAD requests and checks the
filesystem first, so Vite's module graph, HMR endpoints, and everything in
`public/` are untouched.

One deliberate detail: it does **not** exempt paths that merely have an
extension. An early version did, which let `/wp-admin/login.php` fall through to
the SPA fallback and return `200` — a soft 404 in dev that production wouldn't
have produced.

| Local URL | Result |
| --- | --- |
| `/` | 200, the app |
| `/3fdreg` | 404, the diagnostic page |
| `/projects` | 404 → client-side redirect to `/#projects` |
| `/favicon.svg`, `/og-image.png`, the résumé PDF | 200 |
| `/wp-admin/login.php` | 404 |

This required `@types/node` (dev-only) for `fs`/`path` in the config; it isn't in
the bundle.

### 4.3 Design

The page is a **SHARIM.OS diagnostic screen**, not a generic error page. It reuses
the site's own idioms so it doesn't read as a different site: the `SA` tile and
`SHARIM // ANSARI` wordmark from `Navbar`, the gradient headline treatment and
button styles from `Hero`, the `>_ [ ... ]` terminal prompt, and a panel modelled
on `BootScreen` (`SHARIM.OS v7.0`, status rows, module checks) that reports the
failed path instead of a boot sequence.

**Behaviour ported from the app**, so the page feels like the site rather than
just borrowing its colours:

| Source | What was ported |
| --- | --- |
| `ParticleField.tsx` | Constellation canvas — same 0.55 density, 130px link distance, identical colours |
| `CustomCursor.tsx` | Cyan dot + trailing ring (0.18 lerp), 28 / 40 / 56px for default / hover / labelled, contextual verb over `[data-cursor]` zones |
| `Magnetic.tsx` | Buttons nudge toward the pointer at 0.18 strength |
| `index.css` | `::selection` tint, the 10px technical scrollbar, `scroll-behavior`, and the global reduced-motion block |

The route chips are annotated `data-cursor="open"`, so the ring expands and shows
`OPEN` over them — the same treatment `Projects` (`view`), `Skills` (`details`),
and `ArchitectureLab` (`inspect`) use.

Note the site does **not** hide the native cursor — the dot and ring are drawn on
top of it. The port matches that, and uses the same
`(min-width: 1024px) and (pointer: fine)` gate as `useIsDesktop`, so touch devices
and small screens get the plain cursor.

It has to be standalone: Pages serves this file directly, so it can't import from
the React bundle. Everything above is therefore duplicated as plain CSS/JS —
**if you change the theme colours or these interactions, update `public/404.html`
too.** All three effects are disabled under `prefers-reduced-motion`.

Two implementation notes:

- The requested path is echoed with `textContent`, never `innerHTML` — it's
  attacker-controlled, and a 404 page that interpolates `location.pathname` into
  markup is a stored-XSS vector.
- If `path` is empty (404.html served *at* the root, meaning `index.html` is
  missing) it renders the 404 rather than redirecting to `/` — that redirect would
  loop forever. This was caught by the browser test, not by inspection.

If you move to Option B or a custom domain, update `BASE` at the top of
`public/404.html` to match `vite.config.ts`.

---

## 5. Free alternatives

All of these are genuinely free for a site this size and, unlike Pages, all support
redirects, custom headers, and PR preview deployments.

### Cloudflare Pages — best overall alternative

| | |
| --- | --- |
| Bandwidth | **Unlimited** |
| Builds | 500/month |
| Custom domain + HTTPS | ✅ Free |
| Private repos | ✅ Free |
| Preview deploys | ✅ Per branch/PR |
| Headers / redirects | ✅ `_headers` and `_redirects` files in `public/` |

Setup: Cloudflare dashboard → Workers & Pages → Connect to Git → pick the repo.
Build command `npm run build`, output directory `dist`. The base path stays `/`, so
**no code changes are needed at all** — it deploys the repo exactly as-is.

Fastest CDN of the bunch, and unlimited bandwidth means a portfolio that goes viral
on Hacker News costs you nothing.

### Netlify

| | |
| --- | --- |
| Bandwidth | 100 GB/month |
| Build minutes | 300/month |
| Custom domain + HTTPS | ✅ Free |
| Preview deploys | ✅ |
| Bonus | **Netlify Forms** — 100 submissions/month free |

That Forms feature is the interesting one for you: it would let you replace the
`mailto:` handoff in `Contact.tsx` with a real form that emails you, no backend.
`mailto:` is a genuine friction point — it fails outright for visitors on webmail
with no configured desktop client.

### Vercel

| | |
| --- | --- |
| Bandwidth | 100 GB/month |
| Custom domain + HTTPS | ✅ Free |
| Preview deploys | ✅ Best-in-class DX |
| ⚠️ Licence | Hobby tier is **non-commercial use only** |

Excellent product, near-zero-config for Vite. But read that last row: if your
portfolio advertises freelance availability or consulting services, Vercel may
consider it commercial use. A pure "here is my work history" page is generally
fine. Cloudflare has no such restriction.

### Others, briefly

- **Render (Static Sites)** — free, 100 GB/month, connects to Git. Solid, less
  polished than the three above.
- **Firebase Hosting** — free Spark tier, ~10 GB/month transfer. Good CDN, but
  requires the Firebase CLI and a Google Cloud project. Overkill here.
- **GitLab Pages / Codeberg Pages** — viable if you'd rather not be on GitHub.
  Codeberg is free and non-commercial-friendly.
- **Surge.sh** — dead simple (`surge dist/`), but HTTPS on a custom domain is paid.

---

## 6. Recommendation

**Deploy to GitHub Pages using Option A** (rename the repo to
`asharim111.github.io`). Reasons:

1. Your code already lives on GitHub — one platform, one push, no extra account.
2. `asharim111.github.io` is a clean, credible URL for a developer portfolio, and
   costs nothing.
3. Option A needs **zero source changes** — no `base`, no path juggling.
4. This site uses none of the features Pages lacks.

**Consider Cloudflare Pages instead if** you want unlimited bandwidth, PR previews,
or expect to add client-side routing later. It also deploys this repo as-is with no
changes, so it's an equally low-friction starting point.

**Nothing stops you from doing both** — point Cloudflare at the same repo and run
them in parallel. Whichever you pick, apply the `profile.ts` fix from §2 so the
resume download stops depending on the site sitting at the domain root.

### Pre-flight checklist

- [x] ~~Patch `src/data/profile.ts:19` to use `import.meta.env.BASE_URL`~~
- [x] ~~Replace the `example.com` canonical URL~~ → `https://asharim111.github.io/`
- [x] ~~Add an `og:image` to `public/` and reference it in `index.html`~~
- [x] ~~Run `npm run build` locally~~ — passes, `dist/og-image.png` emitted
- [ ] **Rename the GitHub repo to `asharim111.github.io`** (Option A — the meta tags
      already assume this URL, so the repo name is now the thing that has to match)
- [ ] Add `.github/workflows/deploy.yml`
- [ ] Settings → Pages → Source: **GitHub Actions**
- [ ] Push to `main`, watch the Actions tab
- [ ] Open the live URL and test: resume download, favicon, anchor nav, mobile layout
- [ ] Confirm the 404 fallback live: `/projects` → `/#projects`, `/nope` → 404 page
- [ ] Run the live URL through LinkedIn Post Inspector and X Card Validator
