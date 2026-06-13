import { createElement } from "react";
import type { TextareaHTMLAttributes } from "react";
import type { FieldApi } from "@tanstack/react-form";

interface CTextareaProps<T, N extends keyof T & string>
  extends Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "value" | "onChange" | "onBlur"
  > {
  field: FieldApi<T, N>;
}

export function CTextarea<T, N extends keyof T & string>({
  field,
  className = "",
  rows = 4,
  ...rest
}: CTextareaProps<T, N>) {
  return createElement("textarea", {
    id: field.name,
    name: field.name,
    value: (field.state.value as string) ?? "",
    onChange: (e: { target: { value: string } }) =>
      field.handleChange(e.target.value as T[N]),
    onBlur: () => field.handleBlur(),
    rows,
    className: `w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none ${className}`,
    ...rest,
  });
}
