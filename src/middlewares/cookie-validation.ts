import { UUID } from 'node:crypto'
import { FastifyReply, FastifyRequest } from 'fastify'

import { z } from 'zod'
import { knex } from '../database'
import { env } from '../env'
import formatZodError from './format-zod-error'

type Cookie =
  | {
      session_id: UUID
      user: UUID
      created_at: string
    }
  | undefined

export default async function (request: FastifyRequest, reply: FastifyReply) {
  const sessionId = await uuidValidation(request, reply)
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
      error: 'Expired authentication.',
    })
  }
}

async function uuidValidation(request: FastifyRequest, reply: FastifyReply) {
  const cookieHasUUID = z.object({
    sessionId: z.coerce.string().uuid({ message: 'Sign in or register.' }),
  })

  try {
    const cookieHasValid = cookieHasUUID.parse(request.cookies)

    return cookieHasValid.sessionId
  } catch (err) {
    formatZodError(err, reply)
  }
}
