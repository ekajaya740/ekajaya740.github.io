import { createElement, useCallback, useRef, useState } from "react";
import type { FC, ChangeEvent, DragEvent } from "react";
import { uploadFile } from "better-upload/client";

export interface CFileUploadProps {
  endpoint: string;
  accept?: string;
  maxSize?: number;
  value: string | null;
  onChange: (key: string | null) => void;
  className?: string;
}

export const CFileUpload: FC<CFileUploadProps> = ({
  endpoint,
  accept = "image/webp,image/png,image/jpeg",
  maxSize = 2 * 1024 * 1024,
  value,
  onChange,
  className = "",
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (file.size > maxSize) return;

      setUploading(true);
      setProgress(0);

      try {
        const result = await uploadFile({
          route: endpoint,
          file,
          onFileStateChange: ({ file: f }) => {
            if ("progress" in f && typeof f.progress === "number") {
              setProgress(f.progress);
            }
          },
        });

        const key = (
          result as unknown as { data?: { key?: string } }
        ).data?.key ?? null;
        onChange(key);
      } catch {
        // Upload failed
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [endpoint, maxSize, onChange],
  );

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) void handleFile(file);
      if (inputRef.current) inputRef.current.value = "";
    },
    [handleFile],
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) void handleFile(file);
    },
    [handleFile],
  );

  return createElement(
    "div",
    { className },
    value
      ? createElement(
          "div",
          { className: "flex items-center gap-3" },
          createElement("span", { className: "text-sm text-green-600" }, "File uploaded"),
          createElement(
            "button",
            {
              type: "button" as const,
              onClick: () => onChange(null),
              className: "text-xs text-red-500 hover:underline",
            },
            "Remove",
          ),
        )
      : createElement(
          "div",
          {
            className: `relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
              dragOver ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10" : "border-border hover:border-muted-foreground"
            }`,
            onDragOver: (e: DragEvent<HTMLDivElement>) => {
              e.preventDefault();
              setDragOver(true);
            },
            onDragLeave: () => setDragOver(false),
            onDrop: handleDrop,
          },
          uploading
            ? createElement(
                "div",
                { className: "space-y-2" },
                createElement("p", { className: "text-sm text-muted-foreground" }, "Uploading..."),
                createElement(
                  "div",
                  { className: "mx-auto h-1.5 w-32 overflow-hidden rounded-full bg-gray-200" },
                  createElement("div", {
                    className: "h-full bg-blue-600 transition-all duration-300",
                    style: { width: `${Math.round(progress)}%` },
                  }),
                ),
              )
            : createElement(
                "div",
                { className: "space-y-2" },
                createElement("p", { className: "text-sm text-muted-foreground" }, "Drag and drop or"),
                createElement(
                  "button",
                  {
                    type: "button" as const,
                    onClick: () => inputRef.current?.click(),
                    className: "text-sm font-medium text-blue-600 hover:text-blue-800",
                  },
                  "browse files",
                ),
                createElement("p", { className: "text-xs text-gray-400" }, `Max ${Math.round(maxSize / 1024 / 1024)}MB`),
              ),
          createElement("input", {
            ref: inputRef,
            type: "file",
            accept,
            onChange: handleInputChange,
            className: "hidden",
          }),
        ),
  );
};
