import ky from "ky";

export function createClient(baseUrl: string) {
  return ky.create({
    prefixUrl: baseUrl,
    headers: {
      "Content-Type": "application/json",
    },
    hooks: {
      beforeError: [
        async (error) => {
          const { response } = error;
          if (response?.body) {
            try {
              const body = await response.json();
              error.message = (body as { error?: string }).error ?? error.message;
            } catch {
              // ignore parse failures
            }
          }
          return error;
        },
      ],
    },
  });
}

export type ApiClient = ReturnType<typeof createClient>;
