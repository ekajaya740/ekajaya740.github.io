import { renderToString } from "react-dom/server";
import type { ReactNode } from "react";
import { INLINED_CSS } from "./styles/inlined.css";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function renderPage(props: LayoutProps): Response {
  const { children, title = "API — Work of Ekajaya" } = props;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow" />
  <title>${title}</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png" />
  <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512x512.png" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <style>${INLINED_CSS}</style>
</head>
<body>
  <div id="root">${renderToString(<>{children}</>)}</div>
  <script type="module" src="/static/client.js"></script>
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
