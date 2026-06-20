import { Outlet, createRootRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { INLINED_CSS } from '../styles/inlined.css'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
})

function NotFoundComponent(): ReactNode {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">404</h1>
        <p className="text-muted-foreground">Page not found</p>
      </div>
    </div>
  )
}

function RootComponent(): ReactNode {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
        <title>API — Work of Ekajaya</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512x512.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <style dangerouslySetInnerHTML={{ __html: INLINED_CSS }} />
      </head>
      <body>
        <Outlet />
      </body>
    </html>
  )
}
