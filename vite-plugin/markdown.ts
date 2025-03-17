import { HmrContext, Plugin } from "vite";
import MarkdownIt from "markdown-it";
import path from "node:path";
import fs from "node:fs";
import hljs from "highlight.js";

const md = new MarkdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
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
        const fileRelativePath = match.match(filepathRE)?.[2];
        const filePath = path.resolve(fileDir, fileRelativePath!);
        mdRelationMap.set(
          filePath,
          (mdRelationMap.get(filePath) || []).concat(id)
        );
        const mdText = fs.readFileSync(filePath, "utf-8");
        return transformMarkdown(mdText);
      });
    },
    handleHotUpdate({ file, server, modules }: HmrContext) {
      if (path.extname(file) !== ".md") return modules;
      console.log(modules, "modules");
      const relationModuleIds = mdRelationMap.get(file);
      if (!relationModuleIds) return modules;
      mdRelationMap.delete(file); // 清除映射关系
      const relationModules = relationModuleIds.map((id) =>
        server.moduleGraph.getModuleById(id)
      );
      // 依赖文件热更新
      return [...modules, ...relationModules].filter(Boolean);
    },
  };
}

function transformMarkdown(mdText: string) {
  return `<Markdown>${md.render(mdText)}</Markdown>`;
}
