import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      username: z
        .string()
        .min(5, { message: 'Must be 5 or more characters long' }),
      email: z.string().email({ message: 'Invalid email address' }),
      password: z
        .string()
        .min(5, { message: 'Must be 5 or more characters long' }),
    })

    const { username, email, password } = createUserBodySchema.parse(
      request.body,
    )

    const id = randomUUID()
    await knex('users').insert({
      id,
      username,
      email,
      password,
    })

    const sessionId = randomUUID()

    reply.cookie('sessionId', sessionId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30 * 2, // 60 days
    })

    await knex('sessions').insert({
      session_id: sessionId,
      user: id,
    })

    return reply.status(201).send()
  })
}
