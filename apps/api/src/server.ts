import { AsyncLocalStorage } from "node:async_hooks";

const envStorage = new AsyncLocalStorage<Record<string, unknown>>();

export function getPlatformEnv(): Record<string, unknown> | undefined {
  return envStorage.getStore();
}
