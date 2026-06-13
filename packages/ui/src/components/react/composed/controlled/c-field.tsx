import { createElement } from "react";
import type { ReactNode, FC } from "react";

interface FieldState {
  value: unknown;
  meta: {
    errors?: Array<{ message?: string } | string>;
  };
}

interface FieldHandle {
  name: string;
  state: FieldState;
  handleChange: (value: unknown) => void;
  handleBlur: () => void;
}

interface CFieldProps {
  name: string;
  form: {
    Field: FC<{
      name: string;
      children: (field: FieldHandle) => ReactNode;
    }>;
  };
  label?: string;
  children: (field: FieldHandle) => ReactNode;
}

export function CField({ name, form, label, children }: CFieldProps) {
  return createElement(form.Field, {
    name,
    children: (field: FieldHandle) => {
      const errors = field.state.meta.errors
        ?.map((e) => (typeof e === "string" ? e : e.message))
        .filter(Boolean) as string[] | undefined;

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
        errors?.length
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
