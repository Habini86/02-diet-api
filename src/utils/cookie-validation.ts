import { UUID } from 'node:crypto'
import { FastifyReply, FastifyRequest } from 'fastify'

import { ZodError, z } from 'zod'
import { knex } from '../database'
import { env } from '../env'

type Cookie =
  | {
      session_id: UUID
      user: UUID
      created_at: string
    }
  | undefined

export default async function (request: FastifyRequest, reply: FastifyReply) {
  const sessionId = uuidValidation(request, reply)

  const cookie: Cookie = await knex('sessions')
    .where('session_id', sessionId)
    .first()

  if (!cookie) {
    reply.status(401).send({
      error: 'Invalid authentication.',
    })
  }

  const dateNow = new Date()
  const dateCookie = new Date(cookie!.created_at)
  const cookieTime = Math.floor(
    (dateNow.getTime() - dateCookie.getTime()) / 1000,
  )

  if (cookieTime > env.EXPIRED_COOKIE) {
    reply.status(401).send({
      error: 'Invalid authentication.',
    })
  }
}

async function uuidValidation(request: FastifyRequest, reply: FastifyReply) {
  const cookieHasUUID = z.object({
    sessionId: z.string().uuid({ message: 'Sign in or register.' }),
  })

  try {
    const cookieHasValid = cookieHasUUID.parse(request.cookies)

    return cookieHasValid
  } catch (err) {
    if (err instanceof ZodError) {
      const errorMessage = JSON.parse(err.message)[0].message
      return reply.status(401).send({
        error: errorMessage,
      })
    }
  }
}
