import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { virtualModulePlugin } from "./vite-plugin/virtual-module";
import { resolveId } from "./vite-plugin/resolve-id";
import { markdownPlugin } from "./vite-plugin/markdown";
import { viteSvgrPlugin } from "./vite-plugin/svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    markdownPlugin(),
    viteSvgrPlugin({}),
    react(),
    resolveId(),
    virtualModulePlugin(),
  ],
});
