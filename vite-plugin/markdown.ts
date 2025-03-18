import { HmrContext, Plugin } from "vite";
import MarkdownIt from "markdown-it";
import path from "node:path";
import fs from "node:fs";
import hljs from "highlight.js";
import { ModuleNode } from "vite";

const md = new MarkdownIt({
  highlight: function (str: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        // md中代码块需要包裹标签，否则会报错，所以需要替换掉{}
        const code = hljs
          .highlight(str, { language: lang })
          .value.replaceAll(/{/g, "&#123;")
          .replaceAll(/}/g, "&#125;")
          .replaceAll(/\n/g, "<br />");
        return code;
      } catch (err) {
        console.log(err);
      }
    }
    return ""; // use external default escaping
  },
});

// 存放md url 与 引入文件id的映射关系
const mdRelationMap = new Map<string, string[]>();

export function markdownPlugin(): Plugin {
  return {
    name: "vite:markdown",
    enforce: "pre",
    transform(code: string, id: string) {
      const reactRE = /\.(t|j)sx$/;
      const markdownRE = /<Markdown file=.*?\/>/g;
      const filepathRE = /file=(["'])(.*?)\1/;
      if (!(reactRE.test(id) && markdownRE.test(code))) return code;
      const fileDir = path.dirname(id);
      return code.replaceAll(markdownRE, (match) => {
        const fileRelativePath = match.match(filepathRE)?.[2]; // 第二个捕获组
        const filePath = path.resolve(fileDir, fileRelativePath!);
        mdRelationMap.set(
          filePath,
          (mdRelationMap.get(filePath) || []).concat(id)
        );
        // 读取md文件内容
        const mdText = fs.readFileSync(filePath, "utf-8");
        return transformMarkdown(mdText);
      });
    },
    handleHotUpdate({ file, server, modules }: HmrContext) {
      if (!file.endsWith(".md")) return modules;
      const relationModuleIds = mdRelationMap.get(file);
      if (!relationModuleIds) return modules;
      mdRelationMap.delete(file); // 清除映射关系
      const relationModules = relationModuleIds
        .map((id) => server.moduleGraph.getModuleById(id))
        .filter((m): m is ModuleNode => !!m);
      // 更新依赖文件，用于热更新
      return [...modules, ...relationModules];
    },
  };
}

function transformMarkdown(mdText: string) {
  return `<Markdown>${md.render(mdText)}</Markdown>`;
}
