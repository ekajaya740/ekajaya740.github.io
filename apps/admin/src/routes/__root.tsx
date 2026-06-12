import { Outlet, createRootRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent(): ReactNode {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
        <title>Admin — Work of Ekajaya</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512x512.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <Outlet />
      </body>
    </html>
  )
}
