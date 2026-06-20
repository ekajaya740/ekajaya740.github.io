import { createElement } from "react";
import type { InputHTMLAttributes } from "react";

interface FieldHandle {
  name: string;
  state: { value: unknown };
  handleChange: (value: unknown) => void;
  handleBlur: () => void;
}

interface CCheckboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | "onBlur" | "type"
  > {
  field: FieldHandle;
  label?: string;
}

export function CCheckbox({
  field,
  label,
  className = "",
  ...rest
}: CCheckboxProps) {
  return createElement(
    "label",
    { className: "flex items-center gap-2 text-sm" },
    createElement("input", {
      id: field.name,
      name: field.name,
      type: "checkbox",
      checked: Boolean(field.state.value ?? false),
      onChange: (e: { target: { checked: boolean } }) =>
        field.handleChange(e.target.checked),
      onBlur: () => field.handleBlur(),
      className: `rounded border-border ${className}`,
      ...rest,
    }),
    label && createElement("span", null, label),
  );
}
