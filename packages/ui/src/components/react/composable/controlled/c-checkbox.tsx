import { createElement } from "react";
import type { InputHTMLAttributes } from "react";
import type { FieldApi } from "@tanstack/react-form";

interface CCheckboxProps<T, N extends keyof T & string>
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | "onBlur" | "type"
  > {
  field: FieldApi<T, N>;
  label?: string;
}

export function CCheckbox<T, N extends keyof T & string>({
  field,
  label,
  className = "",
  ...rest
}: CCheckboxProps<T, N>) {
  return createElement(
    "label",
    { className: "flex items-center gap-2 text-sm" },
    createElement("input", {
      id: field.name,
      name: field.name,
      type: "checkbox",
      checked: (field.state.value as boolean) ?? false,
      onChange: (e: { target: { checked: boolean } }) =>
        field.handleChange(e.target.checked as T[N]),
      onBlur: () => field.handleBlur(),
      className: `rounded border-gray-300 ${className}`,
      ...rest,
    }),
    label && createElement("span", null, label),
  );
}
