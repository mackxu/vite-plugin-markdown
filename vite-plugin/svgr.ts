import { createFilter, FilterPattern } from "@rollup/pluginutils";
import type { Plugin } from "vite";
import { transformWithEsbuild } from "vite";
import fs from "fs";

export function viteSvgrPlugin({
  include = "**/*.svg?react",
  exclude,
}: {
  include?: FilterPattern;
  exclude?: FilterPattern;
}): Plugin {
  const filter = createFilter(include, exclude);
  const postfixRE = /[?#].*$/s;
  return {
    name: "vite-svgr-plugin",
    enforce: "pre",
    async load(id: string) {
      if (!filter(id)) {
        return null;
      }
      const { transform } = await import("@svgr/core");
      const { default: jsx } = await import("@svgr/plugin-jsx");
      const filePath = id.replace(postfixRE, "");
      const source = await fs.promises.readFile(filePath, "utf-8");
      // const SvgReact = props => <svg></svg>
      const componentCode = await transform(
        source,
        { icon: true },
        {
          filePath,
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
    },
  };
}
