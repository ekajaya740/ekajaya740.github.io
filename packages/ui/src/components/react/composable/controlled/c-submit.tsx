import { createElement } from "react";
import type { ButtonHTMLAttributes } from "react";

interface CSubmitProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  children: React.ReactNode;
}

export function CSubmit({
  children,
  className = "",
  ...rest
}: CSubmitProps) {
  return createElement("button", {
    type: "submit",
    className: `rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`,
    ...rest,
  }, children);
}
