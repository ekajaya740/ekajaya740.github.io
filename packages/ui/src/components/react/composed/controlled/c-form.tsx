import { createElement } from "react";
import { useForm } from "@tanstack/react-form";
import type { ReactNode, FormEvent, FC } from "react";

interface FieldHandle {
  name: string;
  state: { value: unknown };
  handleChange: (value: unknown) => void;
  handleBlur: () => void;
}

interface FormInstance {
  Field: FC<{
    name: string;
    children: (field: FieldHandle) => ReactNode;
  }>;
  Subscribe: FC<{
    selector: (state: unknown) => unknown;
    children: (value: unknown) => ReactNode;
  }>;
  handleSubmit: () => Promise<void>;
  state: {
    isSubmitting: boolean;
    isTouched: boolean;
  };
}

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
    typeof children === "function"
      ? children(form as unknown as FormInstance)
      : children,
  );
}
