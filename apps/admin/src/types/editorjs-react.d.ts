declare module "editorjs-react" {
  import type { FC } from "react";
  import type EditorJS from "@editorjs/editorjs";

  interface EditorProps {
    data?: EditorJS.OutputData;
    tools?: Record<string, unknown>;
    onChange?: (api: EditorJS.API, data: EditorJS.OutputData) => void;
    onInitialize?: (instance: EditorJS) => void;
    onReady?: () => void;
    holder?: string;
    children?: React.ReactNode;
    [key: string]: unknown;
  }

  const Editor: FC<EditorProps>;
  export default Editor;
}
