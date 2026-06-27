import { hydrateRoot } from "react-dom/client";
import { StrictMode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApiClientProvider } from "@ekajaya/hooks";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const baseUrl = window.location.origin;

hydrateRoot(
  document,
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ApiClientProvider baseUrl={baseUrl}>
        <div />
      </ApiClientProvider>
    </QueryClientProvider>
  </StrictMode>,
);
