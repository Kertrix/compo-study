"use client";

import { TrailingBlockPlugin } from "platejs";
import { Plate, usePlateEditor } from "platejs/react";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Button } from "../ui/button";
import { Editor, EditorContainer } from "../ui/editor";
import { updateSubjectDescription } from "./editor-actions";
import { AutoformatKit } from "./plugins/autoformat-kit";
import { BasicBlocksKit } from "./plugins/basic-blocks-kit";
import { BasicMarksKit } from "./plugins/basic-marks-kit";
import { FloatingToolbarKit } from "./plugins/floating-toolbar-kit";
import { LinkKit } from "./plugins/link-kit";
import { ListKit } from "./plugins/list-kit";
import { MathKit } from "./plugins/math-kit";

export default function PlateEditor({
  content,
  subjectId,
}: {
  content: string;
  subjectId: string;
}) {
  const [saved, setSaved] = useState(false);
  const debouncedUpdates = useDebouncedCallback(async (value) => {
    await updateSubjectDescription(subjectId, JSON.stringify(value));
    setSaved(true);
  }, 4000);

  const editor = usePlateEditor({
    plugins: [
      // Elements
      ...BasicBlocksKit,
      ...MathKit,
      ...LinkKit,
      ...ListKit,
      TrailingBlockPlugin,

      // Editing
      ...AutoformatKit,

      // UI
      ...FloatingToolbarKit,

      // Marks
      ...BasicMarksKit,
    ],
    value: () => (content ? JSON.parse(content) : undefined),
  });

  return (
    <Plate
      editor={editor}
      onChange={({ value }) => {
        debouncedUpdates(value);
        setSaved(false);
      }}
    >
      <EditorContainer>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">
            {saved ? "Saved" : "Unsaved changes"}
          </span>
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={async () => {
              await updateSubjectDescription(
                subjectId,
                JSON.stringify(editor.children)
              );
              setSaved(true);
            }}
          >
            Save
          </Button>
        </div>
        <Editor
          className="px-16!"
          placeholder="Write something or type '/' for commands..."
        />
      </EditorContainer>
    </Plate>
  );
}
