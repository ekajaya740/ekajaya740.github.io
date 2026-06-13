import { createElement } from "react";
import type { SelectHTMLAttributes } from "react";
import type { FieldApi } from "@tanstack/react-form";

interface CSelectProps<T, N extends keyof T & string>
  extends Omit<
    SelectHTMLAttributes<HTMLSelectElement>,
    "value" | "onChange" | "onBlur"
  > {
  field: FieldApi<T, N>;
  options: { value: string; label: string }[];
}

export function CSelect<T, N extends keyof T & string>({
  field,
  options,
  className = "",
  ...rest
}: CSelectProps<T, N>) {
  return createElement(
    "select",
    {
      id: field.name,
      name: field.name,
      value: (field.state.value as string) ?? "",
      onChange: (e: { target: { value: string } }) =>
        field.handleChange(e.target.value as T[N]),
      onBlur: () => field.handleBlur(),
      className: `w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none ${className}`,
      ...rest,
    },
    options.map((opt) =>
      createElement("option", { key: opt.value, value: opt.value }, opt.label),
    ),
  );
}
