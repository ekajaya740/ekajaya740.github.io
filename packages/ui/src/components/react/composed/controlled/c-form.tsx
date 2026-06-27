import { createElement } from "react";
import { useForm } from "@tanstack/react-form";
import type { FormEvent, ReactNode } from "react";
import type { FormValidateOrFn } from "@tanstack/react-form";

interface CFormValidators {
  onChange?: FormValidateOrFn<Record<string, unknown>>;
  onSubmit?: FormValidateOrFn<Record<string, unknown>>;
}

interface CFormProps {
  defaultValues: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>;
  validators?: CFormValidators;
  children: ReactNode | ((form: any) => ReactNode);
}

export function CForm({
  defaultValues,
  onSubmit,
  validators,
  children,
}: CFormProps) {
  const form = useForm({
    defaultValues,
    validators: validators
      ? {
          ...(validators.onChange ? { onChange: validators.onChange } : {}),
          ...(validators.onSubmit ? { onSubmit: validators.onSubmit } : {}),
        }
      : undefined,
    onSubmit: async ({ value }: { value: Record<string, unknown> }) => {
      await onSubmit(value);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    void form.handleSubmit();
  };

  return createElement(
    "form",
    { onSubmit: handleSubmit, method: "post", className: "space-y-4" },
    typeof children === "function" ? children(form) : children,
  );
}
