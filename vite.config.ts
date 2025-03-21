import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { virtualModulePlugin } from "./vite-plugin/virtual-module";
import { resolveId } from "./vite-plugin/resolve-id";
import { markdownPlugin } from "./vite-plugin/markdown";
// import { viteSvgrPlugin } from "./vite-plugin/svgr";
import { viteSvgPlugin } from "./vite-plugin/svg";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    markdownPlugin(),
    // viteSvgrPlugin({}),
    viteSvgPlugin(),
    react(),
    resolveId(),
    virtualModulePlugin(),
  ],
  build: {
    assetsInlineLimit: 0,
  },
});
