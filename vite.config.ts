import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { virtualModulePlugin } from "./vite-plugin/virtual-module";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), virtualModulePlugin()],
});
