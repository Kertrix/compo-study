"use client";

import { Plate, usePlateEditor } from "platejs/react";
import { Editor, EditorContainer } from "../ui/editor";
import { BasicBlocksKit } from "./plugins/basic-blocks-kit";
import { BasicMarksKit } from "./plugins/basic-marks-kit";

export default function PlateEditor() {
  const editor = usePlateEditor({
    plugins: [
      // Elements
      ...BasicBlocksKit,

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
