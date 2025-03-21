import { transformWithEsbuild } from "vite";
import { Plugin } from "vite";
import fs from "fs";

// transform好处是svg单独打包
export function viteSvgPlugin(): Plugin {
  const postfixRE = /[?#].*$/s;
  return {
    name: "vite-svg-plugin",
    enforce: "pre",
    async transform(code, id) {
      if (id.endsWith(".svg?react")) {
        const filePath = id.replace(postfixRE, "");
        const source = await fs.promises.readFile(filePath, "utf-8");

        const { transform } = await import("@svgr/core");
        const { default: jsx } = await import("@svgr/plugin-jsx");

        const componentCode = await transform(
          source,
          { icon: true },
          {
            filePath: id,
            caller: {
              defaultPlugins: [jsx],
            },
            componentName: "SvgReactComponent",
          }
        );
        const result = await transformWithEsbuild(componentCode, id, {
          loader: "jsx",
          jsx: "automatic",
        });
        return {
          code: result.code,
          map: null,
        };
      }
    },
  };
}
