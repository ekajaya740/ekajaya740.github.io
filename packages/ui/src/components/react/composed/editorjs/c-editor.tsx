import { createElement, useRef, useEffect } from "react";
import EditorJS from "@editorjs/editorjs";
import type { FC } from "react";
import type { OutputData, API, ToolConstructable } from "@editorjs/editorjs";

interface CEditorProps {
  data?: OutputData;
  tools: Record<string, unknown>;
  onChange?: (data: OutputData) => void;
  onReady?: (editor: EditorJS) => void;
  className?: string;
  placeholder?: string;
  readOnly?: boolean;
  autofocus?: boolean;
}

export const CEditor: FC<CEditorProps> = ({
  data,
  tools,
  onChange,
  onReady,
  className = "",
  placeholder = "Start writing...",
  readOnly = false,
  autofocus = false,
}) => {
  const holderRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<EditorJS | null>(null);

  useEffect(() => {
    if (!holderRef.current || editorRef.current) return;

    const editor = new EditorJS({
      holder: holderRef.current,
      data,
      tools: tools as Record<string, ToolConstructable | { class: ToolConstructable; config?: Record<string, unknown> }>,
      onChange: async () => {
        if (!onChange) return;
        const saved = await editor.save();
        onChange(saved);
      },
      onReady: () => {
        onReady?.(editor);
      },
      placeholder,
      readOnly,
      autofocus,
    });

    editorRef.current = editor;

    return () => {
      editor.destroy();
      editorRef.current = null;
    };
  }, []);

  return createElement("div", {
    ref: holderRef,
    className: `prose prose-invert max-w-none ${className}`,
  });
};

export type { CEditorProps };
