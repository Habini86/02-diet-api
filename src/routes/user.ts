import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { ZodError } from 'zod'
import { UUID, randomUUID } from 'node:crypto'
import createCookie from '../middlewares/create-cookie'
import userBodySchema from '../utils/user-body-schema'

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
        return reply.status(422).send({
          error: 'Email sent already registered.',
        })
      }

      if (!username) {
        return reply.status(400).send({
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
      if (err instanceof ZodError) {
        const errorMessage = JSON.parse(err.message)[0].message
        return reply.status(400).send({
          error: errorMessage,
        })
      }
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
        message: 'Login successful.',
        username: hasValue.username,
      })
    } catch (err) {
      if (err instanceof ZodError) {
        const errorMessage = JSON.parse(err.message)[0].message
        return reply.status(400).send({
          error: errorMessage,
        })
      }
    }
  })
  // End Post Login
}
