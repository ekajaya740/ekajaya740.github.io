import { createElement } from "react";
import type { InputHTMLAttributes } from "react";

interface FieldHandle {
  name: string;
  state: { value: unknown };
  handleChange: (value: unknown) => void;
  handleBlur: () => void;
}

interface CInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | "onBlur"
  > {
  field: FieldHandle;
}

export function CInput({
  field,
  className = "",
  type = "text",
  ...rest
}: CInputProps) {
  return createElement("input", {
    id: field.name,
    name: field.name,
    type,
    value: String(field.state.value ?? ""),
    onChange: (e: { target: { value: string } }) =>
      field.handleChange(e.target.value),
    onBlur: () => field.handleBlur(),
    className: `w-full rounded-lg border border-border bg-input px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-ring ${className}`,
    ...rest,
  });
}
