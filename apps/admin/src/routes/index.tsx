import { createFileRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent(): ReactNode {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Admin Dashboard</h1>
      <p>Work of Ekajaya — Portfolio Admin</p>
      <ul>
        <li><a href="/api/health">Health Check</a></li>
        <li><a href="/api/v1/info">API Info</a></li>
      </ul>
    </main>
  )
}
