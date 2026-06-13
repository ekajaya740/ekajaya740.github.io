import { createElement } from "react";
import type { InputHTMLAttributes } from "react";
import type { FieldApi } from "@tanstack/react-form";

interface CInputProps<T, N extends keyof T & string>
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "onBlur"> {
  field: FieldApi<T, N>;
}

export function CInput<T, N extends keyof T & string>({
  field,
  className = "",
  type = "text",
  ...rest
}: CInputProps<T, N>) {
  return createElement("input", {
    id: field.name,
    name: field.name,
    type,
    value: (field.state.value as string) ?? "",
    onChange: (e: { target: { value: string } }) =>
      field.handleChange(e.target.value as T[N]),
    onBlur: () => field.handleBlur(),
    className: `w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none ${className}`,
    ...rest,
  });
}
