import { createElement } from "react";
import { useForm } from "@tanstack/react-form";
import type { ReactNode, FormEvent } from "react";

interface CFormProps {
  defaultValues: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>;
  children: ReactNode | ((form: unknown) => ReactNode);
}

export function CForm({ defaultValues, onSubmit, children }: CFormProps) {
  const form = useForm({
    defaultValues,
    // eslint-disable-next-line
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
    { onSubmit: handleSubmit, className: "space-y-4" },
    typeof children === "function" ? children(form as unknown) : children,
  );
}
