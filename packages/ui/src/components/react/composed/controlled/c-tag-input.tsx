import { createElement, useState } from "react";
import { X } from "lucide-react";
import { Badge } from "@ekajaya/ui/base/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@ekajaya/ui/base/alert-dialog";

export interface CTagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  className?: string;
}

export function CTagInput({ tags, onChange, className = "" }: CTagInputProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput("");
    setOpen(false);
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  return createElement(
    "div",
    { className },
    createElement(
      "div",
      { className: "flex flex-wrap gap-2" },
      tags.map((tag, i) =>
        createElement(
          Badge,
          {
            key: `${tag}-${i}`,
            variant: "secondary" as const,
            className: "cursor-default gap-1 pr-1",
          },
          tag,
          createElement(
            "button",
            {
              type: "button" as const,
              onClick: () => removeTag(i),
              className:
                "ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-muted-foreground/20",
            },
            createElement(X, { size: 10 }),
          ),
        ),
      ),
      createElement(
        AlertDialog,
        { open, onOpenChange: setOpen },
        createElement(
          AlertDialogTrigger,
          {
            type: "button" as const,
            className:
              "inline-flex h-6 items-center rounded-md border border-dashed px-2 text-xs text-muted-foreground hover:border-solid hover:text-foreground",
          },
          "+ Add tag",
        ),
        createElement(
          AlertDialogContent,
          null,
          createElement(AlertDialogHeader, null,
            createElement(AlertDialogTitle, null, "Add Tag"),
            createElement(AlertDialogDescription, null, "Enter a tag name."),
          ),
          createElement(
            "input",
            {
              value: input,
              onChange: (e: { target: { value: string } }) =>
                setInput(e.target.value),
              onKeyDown: (e: { key: string }) => {
                if (e.key === "Enter") addTag();
              },
              className:
                "w-full rounded-lg border border-border bg-input px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-ring",
              autoFocus: true,
            },
          ),
          createElement(
            AlertDialogFooter,
            null,
            createElement(AlertDialogCancel, null, "Cancel"),
            createElement(
              AlertDialogAction,
              { onClick: addTag, disabled: !input.trim() },
              "Add",
            ),
          ),
        ),
      ),
    ),
  );

}
