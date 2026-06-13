import handler, { createServerEntry } from "@tanstack/react-start/server-entry";
import { AsyncLocalStorage } from "node:async_hooks";

const envStorage = new AsyncLocalStorage<Record<string, unknown>>();

export function getPlatformEnv(): Record<string, unknown> | undefined {
  return envStorage.getStore();
}

export default createServerEntry({
  fetch(request, env) {
    return envStorage.run(env as Record<string, unknown>, () =>
      handler.fetch(request),
    );
  },
});
