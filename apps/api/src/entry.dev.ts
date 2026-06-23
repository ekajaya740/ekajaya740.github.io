import { getRouter } from './router'
import { createServerEntry } from '@tanstack/react-start/server-entry'
import { resolve } from 'node:path'
import { existsSync } from 'node:fs'
import { execSync } from 'node:child_process'

function getUserCount(): number {
  try {
    const dbPath = resolve(process.cwd(), 'local.db')
    if (!existsSync(dbPath)) return -1
    const result = execSync(`sqlite3 "${dbPath}" "SELECT COUNT(*) as users FROM users;"`, {
      encoding: 'utf8',
      timeout: 5000,
    }).trim()
    return parseInt(result, 10) || 0
  } catch {
    return -1
  }
}

const router = getRouter()

export default createServerEntry({
  async fetch(request: Request) {
    const url = new URL(request.url)

    if (url.pathname === '/login') {
      const count = getUserCount()
      if (count === 0) {
        return new Response(null, {
          status: 307,
          headers: { Location: '/register' },
        })
      }
    }

    return router.fetch(request)
  },
})
