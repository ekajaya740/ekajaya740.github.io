import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/v1/info')({
  server: {
    handlers: {
      GET: async () => {
        return Response.json({
          name: 'ekajaya-api',
          version: '0.0.1',
          description: 'Work of Ekajaya API — portfolio backend',
        })
      },
    },
  },
})
