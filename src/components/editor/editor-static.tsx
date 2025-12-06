import { createSlateEditor } from "platejs";
import { PlateStatic } from "platejs/static";
import { BaseEditorKit } from "./static-parts";

export default async function StaticPlate({ content }: { content: string }) {
  const editor = createSlateEditor({
    plugins: [...BaseEditorKit],
    value: () => (content ? JSON.parse(content) : undefined),
  });

  return <PlateStatic editor={editor} className="my-plate-static-content" />;
}
