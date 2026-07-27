import { defineConfig } from "@kamod-ch/preactpress/config";

const isGithubPagesBuild =
  process.env.GITHUB_ACTIONS === "true" || process.env.KAMOD_DOCS_BASE === "github-pages";
const base = isGithubPagesBuild ? "/kamod-state/" : "/";
const url = isGithubPagesBuild ? "https://kamod-ch.github.io" : "http://localhost:4173";

export default defineConfig({
  theme: "./theme/Layout.tsx",
  site: {
    title: "kamod State",
    description: "Tiny, typed reducer state management built for Preact.",
    base,
    url,
  },
  markdown: { html: false, emoji: true },
  head: [
    ["link", { rel: "icon", href: `${base}favicon.svg`, type: "image/svg+xml" }],
    ["link", { rel: "apple-touch-icon", href: `${base}favicon.svg` }],
    ["link", { rel: "stylesheet", href: `${base}styles/logo.css` }],
  ],
  themeConfig: {
    search: true,
    outline: true,
    nav: [
      { text: "Guide", link: "/guide/quick-start" },
      { text: "API", link: "/guide/api-reference" },
    ],
    sidebar: [
      {
        text: "Guide",
        items: [
          { text: "Introduction", link: "/" },
          { text: "Installation", link: "/guide/installation" },
          { text: "Quick Start", link: "/guide/quick-start" },
          { text: "Store", link: "/guide/store" },
          { text: "useSelector", link: "/guide/use-selector" },
          { text: "Middleware", link: "/guide/middleware" },
          { text: "SSR", link: "/guide/ssr" },
          { text: "Signals integration", link: "/guide/signals" },
          { text: "Testing", link: "/guide/testing" },
          { text: "TypeScript", link: "/guide/typescript" },
          { text: "API reference", link: "/guide/api-reference" },
          { text: "Comparison", link: "/guide/comparison" },
          { text: "Tool-state migration", link: "/examples/tool-state/README" },
          { text: "ADR", link: "/architecture/0001-mvp-api" },
        ],
      },
    ],
  },
});
