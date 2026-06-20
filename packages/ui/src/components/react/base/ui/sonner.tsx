"use client";

import { Toaster } from "sonner";

export type { ExternalToast, ToastT } from "sonner";

export { toast } from "sonner";

export function SonnerToaster(): React.ReactElement {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: "var(--color-background)",
          color: "var(--color-foreground)",
          border: "1px solid var(--color-border)",
        },
      }}
    />
  );
}
