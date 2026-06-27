import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import type { D1Database, R2Bucket } from "@cloudflare/workers-types";
import { apiRoutes } from "./routes/api";
import { pageRoutes } from "./routes/pages";

export interface AppEnv {
  DB: D1Database;
  portfolio_assets?: R2Bucket;
  dev_portfolio_assets?: R2Bucket;
}

const app = new Hono<{
  Bindings: AppEnv;
}>();

app.use("*", logger());
app.use("/api/*", cors());

app.route("/api", apiRoutes);
app.route("/", pageRoutes);

export default app;
export type AppType = typeof app;
