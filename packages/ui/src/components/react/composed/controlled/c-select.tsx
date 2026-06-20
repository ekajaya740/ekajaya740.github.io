import { createElement } from "react";
import type { SelectHTMLAttributes } from "react";

interface FieldHandle {
  name: string;
  state: { value: unknown };
  handleChange: (value: unknown) => void;
  handleBlur: () => void;
}

interface CSelectProps
  extends Omit<
    SelectHTMLAttributes<HTMLSelectElement>,
    "value" | "onChange" | "onBlur"
  > {
  field: FieldHandle;
  options: { value: string; label: string }[];
}

export function CSelect({
  field,
  options,
  className = "",
  ...rest
}: CSelectProps) {
  return createElement(
    "select",
    {
      id: field.name,
      name: field.name,
      value: String(field.state.value ?? ""),
      onChange: (e: { target: { value: string } }) =>
        field.handleChange(e.target.value),
      onBlur: () => field.handleBlur(),
      className: `w-full rounded-lg border border-border px-4 py-2 text-sm focus:border-accent focus:outline-none ${className}`,
      ...rest,
    },
    options.map((opt) =>
      createElement("option", { key: opt.value, value: opt.value }, opt.label),
    ),
  );
}
