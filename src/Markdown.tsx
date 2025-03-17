import { PropsWithChildren } from "react";

export function Markdown({
  file,
  children,
}: PropsWithChildren<{ file: string }>) {
  if (!file) {
    console.warn("file is required");
  }
  return children ?? <div>markdown渲染出错</div>;
}
