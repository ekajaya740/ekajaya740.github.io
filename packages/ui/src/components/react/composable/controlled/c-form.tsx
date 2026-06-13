import { createElement } from "react";
import { useForm } from "@tanstack/react-form";
import type { ReactNode, FormEvent } from "react";

type FormInstance = ReturnType<typeof useForm<Record<string, unknown>>>;

interface CFormProps {
  defaultValues: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>;
  children: ReactNode | ((form: FormInstance) => ReactNode);
}

export function CForm({ defaultValues, onSubmit, children }: CFormProps) {
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value as Record<string, unknown>);
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
    typeof children === "function" ? children(form) : children,
  );
}
