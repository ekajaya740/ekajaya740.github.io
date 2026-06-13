import { createElement } from "react";
import { useForm } from "@tanstack/react-form";
import type { FC, ReactNode, FormEvent } from "react";
import type { FormOptions, ReactFormExtendedApi } from "@tanstack/react-form";

interface CFormProps<T extends Record<string, unknown>> {
  defaultValues: T;
  onSubmit: (values: T) => void | Promise<void>;
  children:
    | ReactNode
    | ((form: ReactFormExtendedApi<T>) => ReactNode);
}

export function CForm<T extends Record<string, unknown>>({
  defaultValues,
  onSubmit,
  children,
}: CFormProps<T>) {
  const form = useForm<T>({
    defaultValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value as T);
    },
  } as FormOptions<T, undefined>);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  return createElement(
    "form",
    { onSubmit: handleSubmit, className: "space-y-4" },
    typeof children === "function" ? children(form) : children,
  );
}
