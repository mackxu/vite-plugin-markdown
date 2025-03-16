import type { Plugin, ResolvedConfig } from "vite";

const virtualFibModuleId = "virtual:fib"; // 虚拟模块的 ID
const resolvedFibVirtualModuleId = "\0" + virtualFibModuleId; // 解析后的虚拟模块 ID

const virtualEnvModuleId = "virtual:env";
const resolvedVirtualEnvModuleId = "\0" + virtualEnvModuleId;

export function virtualModulePlugin(): Plugin {
  let config: ResolvedConfig;
  return {
    name: "vite-virtual-module-plugin",
    configResolved(conf: ResolvedConfig) {
      config = conf;
    },
    resolveId(id) {
      if (id === virtualFibModuleId) {
        return resolvedFibVirtualModuleId; // 改写ID
      }
      if (id === virtualEnvModuleId) {
        return resolvedVirtualEnvModuleId;
      }
    },
    load(id) {
      if (id === resolvedFibVirtualModuleId) {
        // 生成fib模块的代码
        return `export function fib(n) {
          if (n <= 1) return n;
          return fib(n - 1) + fib(n - 2);
        }`;
      }
      if (id === resolvedVirtualEnvModuleId) {
        return `export const ENV = ${JSON.stringify(config.env)}`;
      }
    },
  };
}
