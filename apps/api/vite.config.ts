import { defineConfig } from "vite";
import devServer from "@hono/vite-dev-server";
import adapter from "@hono/vite-dev-server/cloudflare";
import build from "@hono/vite-cloudflare-pages";
import viteReact from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  if (mode === "client") {
    return {
      plugins: [viteReact(), tsconfigPaths(), tailwindcss()],
      build: {
        rollupOptions: {
          input: "./src/client.tsx",
          output: {
            entryFileNames: "static/client.js",
          },
        },
      },
    };
  }

  return {
    server: {
      port: 5173,
      strictPort: true,
    },
    plugins: [
      tailwindcss(),
      devServer({
        entry: "src/app.ts",
        adapter,
      }),
      build(),
      viteReact(),
      tsconfigPaths(),
    ],
  };
});
