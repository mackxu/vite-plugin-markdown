export function Markdown({ file }: { file: string }) {
  if (!file) {
    return null;
  }
  return <div>markdown渲染出错</div>;
}
