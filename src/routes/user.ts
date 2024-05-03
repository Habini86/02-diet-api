import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { UUID, randomUUID } from 'node:crypto'
import createCookie from '../middlewares/create-cookie'
import userBodySchema from '../utils/user-body-schema'
import formatZodError from '../middlewares/format-zod-error'

type User =
  | {
    id: UUID
    username?: string
    email: string
    password: string
  }
  | undefined

export async function usersRoutes(app: FastifyInstance) {
  app.post('/register', async (request, reply) => {
    try {
      const { username, email, password } = userBodySchema.parse(request.body)

      const hasEmail: User = await knex('users').where('email', email).first()

      if (hasEmail) {
        return reply.status(409).send({
          error: 'Email sent already registered.',
        })
      }

      if (!username) {
        return reply.status(422).send({
          error: 'Username not sent.',
        })
      }

      const id = randomUUID()
      await knex('users').insert({
        id,
        username,
        email,
        password,
      })

      createCookie(reply, id)
    } catch (err) {
      formatZodError(err, reply)
    }

    return reply.status(201).send()
  })
  // End Post Register
  app.post('/login', async (request, reply) => {
    try {
      const { email, password } = userBodySchema.parse(request.body)

      const hasValue: User = await knex('users').where('email', email).first()

      if (!hasValue) {
        return reply.status(422).send({
          error: 'Email not found.',
        })
      }

      if (password !== hasValue.password) {
        return reply.status(422).send({
          error: 'Incorrect password.',
        })
      }

      const id = hasValue.id

      createCookie(reply, id)

      return reply.status(200).send({
        username: hasValue.username,
      })
    } catch (err) {
      formatZodError(err, reply)
    }
  })
  // End Post Login
}
