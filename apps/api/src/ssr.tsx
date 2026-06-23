import { createStartHandler, defaultStreamHandler } from '@tanstack/react-start/server'
import { resolve } from 'node:path'
import { existsSync } from 'node:fs'
import { execSync } from 'node:child_process'

const handler = createStartHandler(defaultStreamHandler)

function getUserCount(): number {
  try {
    const dbPath = resolve(process.cwd(), 'local.db')
    if (!existsSync(dbPath)) return -1
    const result = execSync(`sqlite3 "${dbPath}" "SELECT COUNT(*) as count FROM users;"`, {
      encoding: 'utf8',
      timeout: 5000,
    }).trim()
    return parseInt(result, 10) || 0
  } catch {
    return -1
  }
}

export default async function (request: Request): Promise<Response> {
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

  return handler(request)
}
