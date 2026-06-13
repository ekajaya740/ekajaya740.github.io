import { createElement } from "react";
import type { ReactNode } from "react";
import type { FieldApi, Validator } from "@tanstack/react-form";

interface CFieldProps<T, N extends keyof T & string> {
  name: N;
  form: { Field: FC<{
    name: N;
    validators?: { onChange?: Validator<T[N]> };
    children: (field: FieldApi<T, N>) => ReactNode;
  }> };
  label?: string;
  validators?: { onChange?: Validator<T[N]> };
  children: (field: FieldApi<T, N>) => ReactNode;
}

export function CField<T, N extends keyof T & string>({
  name,
  form,
  label,
  validators,
  children,
}: CFieldProps<T, N>) {
  return createElement(form.Field, {
    name,
    validators,
    children: (field: FieldApi<T, N>) =>
      createElement(
        "div",
        { className: "space-y-1" },
        label &&
          createElement(
            "label",
            {
              htmlFor: name,
              className: "block text-sm font-medium",
            },
            label,
          ),
        children(field),
        field.state.meta.errors?.length
          ? createElement(
              "p",
              { className: "text-xs text-red-500" },
              field.state.meta.errors.join(", "),
            )
          : null,
      ),
  });
}
