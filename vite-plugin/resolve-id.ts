import { Plugin } from "vite";
export function resolveId(): Plugin {
  return {
    name: "vite-plugin-resolve-id",
    resolveId(id: string) {
      console.log("resolveId", id);
    },
  };
}
