import { FastifyReply } from 'fastify'
import { UUID, randomUUID } from 'node:crypto'
import { knex } from '../database'

export default async function (reply: FastifyReply, id: UUID) {
  const sessionId = randomUUID()

  reply.cookie('sessionId', sessionId, {
    path: '/',
    maxAge: 60 * 60 * 24 * 30 * 2, // 60 days
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  })

  await knex('sessions').insert({
    session_id: sessionId,
    user: id,
  })
}
