import { createElement } from "react";
import type { TextareaHTMLAttributes } from "react";

interface FieldHandle {
  name: string;
  state: { value: unknown };
  handleChange: (value: unknown) => void;
  handleBlur: () => void;
}

interface CTextareaProps
  extends Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "value" | "onChange" | "onBlur"
  > {
  field: FieldHandle;
}

export function CTextarea({
  field,
  className = "",
  rows = 4,
  ...rest
}: CTextareaProps) {
  return createElement("textarea", {
    id: field.name,
    name: field.name,
    value: String(field.state.value ?? ""),
    onChange: (e: { target: { value: string } }) =>
      field.handleChange(e.target.value),
    onBlur: () => field.handleBlur(),
    rows,
    className: `w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none ${className}`,
    ...rest,
  });
}
