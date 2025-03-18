# React + TypeScript + Vite

## 虚拟模块

注意模块声明，否则 ts 会报错：找不到模块

```ts
// shim.d.ts
declare module "virtual:fib" {
  export function fib(n: number): number;
}
```

如果`shim.d.ts`文件不在 src 目录内，需要在`tsconfig.json`中配置`include`字段。

## markdown 插件

事项：

- [x] 过滤文件，包含特殊属性的标签的文件
- [x] 读取并替换内容
- [x] 支持 md 文件热更新(监听 md 文件的变化， 再将依赖 md 文件的文件热重载)
- [x] 完善热更新，多个文件渲染同一个 md
- [x] 解决 readme.md 不能正常渲染
- [x] 解决 filter(Boolean) 类型的问题

## vscode debugging

适用 vite 6。添加.vscode/settings.json 的`debug.javascript.terminalOptions`:

```json
{
  "debug.javascript.terminalOptions": {
    "resolveSourceMapLocations": [
      "${workspaceFolder}/**",
      "!**/node_modules/**",
      "**/node_modules/.vite-temp/**"
    ]
  }
}
```

插件的源码调试（转码前的代码），需要添
加`launch.json`的`resolveSourceMapLocations`配置：

```json
{
  "resolveSourceMapLocations": [
    "${workspaceFolder}/**",
    "!**/node_modules/**",
    "**/node_modules/.vite-temp/**"
  ]
}
```

## filter(Boolean) 类型的问题

问题复现：

```ts
// (boolean | string)[]
[isProduction() && "/prod-path", "first", "second"].filter(Boolean);
```

解决方案(1)：

```ts
// string[]
[isProduction() && "/prod-path", "first", "second"].filter(
  (x): x is string => !!x
);
```

解决方案(2)：

```ts
const isString = (x: unknown) => typeof x === "string";
// string[]
[isProduction() && "/prod-path", "first", "second"].filter(isString);
```

推荐后者
