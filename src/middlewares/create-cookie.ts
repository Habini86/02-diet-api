import { FastifyReply } from 'fastify'
import { UUID, randomUUID } from 'node:crypto'
import { knex } from '../database'
import { env } from '../env'

export default async function (reply: FastifyReply, id: UUID) {
  const sessionId = randomUUID()

  reply.cookie('sessionId', sessionId, {
    path: '/',
    maxAge: env.EXPIRED_COOKIE,
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  })

  await knex('sessions').insert({
    session_id: sessionId,
    user: id,
  })
}
