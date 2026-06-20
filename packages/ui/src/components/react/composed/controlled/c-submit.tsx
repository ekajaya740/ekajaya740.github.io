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
    className: `rounded-lg px-6 py-2 text-sm font-medium text-accent-foreground transition-colors hover:opacity-80" style={{backgroundColor: "var(--color-accent)"}} focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 ${className}`,
    ...rest,
  }, children);
}
