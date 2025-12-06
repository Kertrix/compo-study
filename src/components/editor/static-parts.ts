import { BaseBasicBlocksKit } from "./plugins/basic-blocks-base-kit";
import { BaseBasicMarksKit } from "./plugins/basic-marks-base-kit";
import { BaseLinkKit } from "./plugins/link-base-kit";
import { BaseListKit } from "./plugins/list-base-kit";
import { BaseMathKit } from "./plugins/math-base-kit";

export const BaseEditorKit = [
  ...BaseBasicBlocksKit,
  ...BaseMathKit,
  ...BaseLinkKit,
  ...BaseBasicMarksKit,
  ...BaseListKit,
];
