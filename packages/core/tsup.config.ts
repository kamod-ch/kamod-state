import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    preact: "src/preact.ts",
    middleware: "src/middleware.ts",
    testing: "src/testing.ts",
    signals: "src/signals.ts"
  },
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  target: "es2022",
  external: ["preact", "preact/hooks", "preact/compat", "@preact/signals"]
});
