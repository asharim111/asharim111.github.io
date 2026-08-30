import { defineConfig, type Plugin, type Connect } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

/**
 * Build provenance, stamped at compile time.
 *
 * CI env wins (it is authoritative and survives a shallow checkout); local git
 * is the fallback; a dev build that has neither still produces something
 * renderable rather than throwing. GITHUB_RUN_ID is what turns the footer
 * stamp into a link to the actual deploy run.
 */
function git(command: string, fallback: string) {
  try {
    return execSync(command, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim() || fallback;
  } catch {
    return fallback;
  }
}

const buildInfo = {
  sha: (process.env.GITHUB_SHA ?? "").slice(0, 7) || git("git rev-parse --short HEAD", "local"),
  branch: process.env.GITHUB_REF_NAME ?? git("git rev-parse --abbrev-ref HEAD", "local"),
  time: new Date().toISOString(),
  runId: process.env.GITHUB_RUN_ID ?? "",
  repo: process.env.GITHUB_REPOSITORY ?? "asharim111/asharim-portfolio",
};

/**
 * Dev/preview parity with GitHub Pages.
 *
 * Vite's dev server has SPA fallback on by default: any unknown path returns
 * index.html with a 200, so `public/404.html` — which is what Pages actually
 * serves in production — never gets exercised locally. This middleware serves
 * that same file, with a real 404 status, for navigation requests that don't
 * resolve, matching production behaviour.
 *
 * Only browser navigations are intercepted, and only when the path doesn't
 * resolve to a real file, so Vite's module graph, HMR endpoints, and assets in
 * public/ are left alone. Note this deliberately does NOT exempt paths just
 * because they carry an extension: `/wp-admin/login.php` must 404, not fall
 * back to index.html with a 200 (a soft 404).
 */
function githubPages404(): Plugin {
  const isFile = (p: string) => {
    try {
      return fs.statSync(p).isFile();
    } catch {
      return false;
    }
  };

  const handler =
    (page: string, roots: string[]): Connect.NextHandleFunction =>
    (req, res, next) => {
      const raw = (req.url || "/").split("?")[0];

      if (req.method !== "GET" && req.method !== "HEAD") return next();
      // Navigations send `Accept: text/html`; module/asset fetches do not.
      if (!(req.headers.accept || "").includes("text/html")) return next();
      if (raw === "/" || raw === "/index.html") return next();
      // Vite internals: /@vite/client, /@react-refresh, /node_modules/…
      if (/^\/(@|node_modules\/|src\/|__vite|\.vite)/.test(raw)) return next();

      let rel: string;
      try {
        rel = decodeURIComponent(raw);
      } catch {
        rel = raw; // malformed escape — treat as a literal miss
      }

      // Serve real files normally. Resolve first so `..` can't escape a root.
      for (const root of roots) {
        const target = path.resolve(root, "." + rel);
        if (target.startsWith(path.resolve(root)) && isFile(target)) return next();
      }

      if (!isFile(page)) return next();

      res.statusCode = 404;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(fs.readFileSync(page));
    };

  return {
    name: "github-pages-404",
    configureServer(server) {
      const root = server.config.root;
      const pub = server.config.publicDir;
      server.middlewares.use(
        handler(path.resolve(pub, "404.html"), [pub, root])
      );
    },
    configurePreviewServer(server) {
      const out = path.resolve(server.config.root, server.config.build.outDir);
      server.middlewares.use(handler(path.resolve(out, "404.html"), [out]));
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), githubPages404()],
  define: {
    __BUILD_SHA__: JSON.stringify(buildInfo.sha),
    __BUILD_BRANCH__: JSON.stringify(buildInfo.branch),
    __BUILD_TIME__: JSON.stringify(buildInfo.time),
    __BUILD_RUN_ID__: JSON.stringify(buildInfo.runId),
    __BUILD_REPO__: JSON.stringify(buildInfo.repo),
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          motion: ["motion"],
        },
      },
    },
  },
});
