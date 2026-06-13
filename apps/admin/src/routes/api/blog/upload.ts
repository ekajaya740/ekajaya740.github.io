import { createFileRoute } from "@tanstack/react-router";
import { createAuth } from "@/auth";
import { getPlatformEnv } from "@/server";
import type { D1Database, R2Bucket } from "@cloudflare/workers-types";

const ALLOWED_MIME_TYPES = ["image/webp", "image/png", "image/jpeg"] as const;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

const MIME_TO_EXT: Record<string, string> = {
  "image/webp": "webp",
  "image/png": "png",
  "image/jpeg": "jpg",
};

export const Route = createFileRoute("/api/blog/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const platformEnv = getPlatformEnv();
        const auth = createAuth(
          platformEnv?.DB
            ? { DB: platformEnv.DB as D1Database }
            : undefined,
          undefined,
          new URL(request.url).origin,
        );
        const session = await auth.api.getSession({
          headers: request.headers,
        });
        if (!session) {
          return new Response("Unauthorized", { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
          return Response.json({ error: "file is required" }, { status: 400 });
        }

        if (!ALLOWED_MIME_TYPES.includes(file.type as typeof ALLOWED_MIME_TYPES[number])) {
          return Response.json(
            { error: "Only WebP, PNG, and JPEG images are allowed" },
            { status: 400 },
          );
        }

        if (file.size > MAX_FILE_SIZE) {
          return Response.json(
            { error: "File size must not exceed 2 MB" },
            { status: 400 },
          );
        }

        const slug = formData.get("slug") as string | null;
        const lang = formData.get("lang") as string | null;

        if (!slug || !lang) {
          return Response.json(
            { error: "slug and lang are required" },
            { status: 400 },
          );
        }

        const ext = MIME_TO_EXT[file.type] ?? "jpg";
        const key = `blog/posts/${slug}/${lang}/thumbnail.${ext}`;

        const r2 = (platformEnv?.portfolio_assets ??
          platformEnv?.dev_portfolio_assets) as R2Bucket | undefined;

        if (!r2) {
          return new Response("R2 bucket not available", { status: 500 });
        }

        const buffer = await file.arrayBuffer();
        await r2.put(key, buffer, {
          httpMetadata: { contentType: file.type },
        });

        return Response.json({ key, url: `/assets/${key}` });
      },
    },
  },
});
