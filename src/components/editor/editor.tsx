"use client";

import { TrailingBlockPlugin } from "platejs";
import { Plate, usePlateEditor } from "platejs/react";
import { Editor, EditorContainer } from "../ui/editor";
import { BasicBlocksKit } from "./plugins/basic-blocks-kit";
import { BasicMarksKit } from "./plugins/basic-marks-kit";
import { FloatingToolbarKit } from "./plugins/floating-toolbar-kit";
import { LinkKit } from "./plugins/link-kit";
import { ListKit } from "./plugins/list-kit";
import { MathKit } from "./plugins/math-kit";

export default function PlateEditor() {
  const editor = usePlateEditor({
    plugins: [
      // Elements
      ...BasicBlocksKit,
      ...MathKit,
      ...LinkKit,
      ...ListKit,
      TrailingBlockPlugin,

      // UI
      ...FloatingToolbarKit,

      // Marks
      ...BasicMarksKit,
    ],
  });

  return (
    <Plate editor={editor}>
      <EditorContainer>
        <Editor
          className="px-16!"
          placeholder="Write something or type '/' for commands..."
        />
      </EditorContainer>
    </Plate>
  );
}
