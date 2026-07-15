import { defineConfig } from "@kamod-ch/preactpress/config";

export default defineConfig({
  site: { title: "kamod State", description: "Tiny, typed reducer state management built for Preact.", base: "/", url: "http://localhost:4173" },
  markdown: { html: false, emoji: true },
  themeConfig: {
    search: true,
    outline: true,
    nav: [{ text: "Guide", link: "/guide/quick-start" }, { text: "API", link: "/guide/api-reference" }],
    sidebar: [{ text: "Guide", items: [
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
      { text: "ADR", link: "/architecture/0001-mvp-api" }
    ] }]
  }
});
