import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./../../packages/database/src/schema.ts",
  out: "./../../packages/database/src/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: "./local.db",
  },
});
