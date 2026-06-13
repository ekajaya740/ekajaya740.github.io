import { createElement } from "react";
import type { ReactNode, FC } from "react";

export interface FieldState {
  value: unknown;
  meta: {
    errors?: unknown[];
  };
}

export interface FieldHandle {
  name: string;
  state: FieldState;
  handleChange: (value: unknown) => void;
  handleBlur: () => void;
}

interface CFieldProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  label?: string;
  children: (field: FieldHandle) => ReactNode;
}

export function CField({ name, form, label, children }: CFieldProps) {
  return createElement(form.Field, {
    name,
    children: (field: FieldHandle) => {
      const errors = ((field.state.meta.errors ?? []) as Array<
        string | { message?: string }
      >)
        .map((e) => (typeof e === "string" ? e : e.message ?? ""))
        .filter(Boolean);

      return createElement(
        "div",
        { className: "space-y-1" },
        label &&
          createElement(
            "label",
            { htmlFor: name, className: "block text-sm font-medium" },
            label,
          ),
        children(field),
        errors.length
          ? createElement(
              "p",
              { className: "text-xs text-red-500" },
              errors.join(", "),
            )
          : null,
      );
    },
  });
}
