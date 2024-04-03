import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import cookieValidation from '../middlewares/cookie-validation'
import mealsBodySchema from '../utils/meals-body-schema'
import formatZodError from '../middlewares/format-zod-error'
import { randomUUID } from 'node:crypto'

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', cookieValidation)
  app.post('/add', async (request, reply) => {
    try {
      const authentication = request.cookies.sessionId

      const { name, description, time, date, diet } = mealsBodySchema.parse(
        request.body,
      )
      const year = date.getUTCFullYear()
      const month = date.getUTCMonth() + 1
      const day = date.getUTCDate()
      const formattedDate = new Date(`${year}-${day}-${month}`)

      const postgresTime = time + ':00'

      const user = await knex('sessions')
        .where('session_id', authentication)
        .first()

      await knex('meals').insert({
        id: randomUUID(),
        name,
        description,
        date: formattedDate,
        time: postgresTime,
        diet,
        user: user!.user,
      })

      return reply.status(201).send()
    } catch (err) {
      formatZodError(err, reply)
    }
  })
  app.get('/list', async (request, reply) => {
    try {
      const authentication = request.cookies.sessionId

      const user = await knex('sessions')
        .where('session_id', authentication)
        .first()

      const _meals = await knex('meals').where('user', user!.user)

      const meals = await _meals.map((meal) => {
        const { id, name, description, time, date, diet } = meal
        const _date = new Date(date)
        const formattedDate = _date.toISOString().split('T')[0]

        return {
          id,
          name,
          description,
          time,
          date: formattedDate,
          diet,
        }
      })

      return reply.status(200).send({ meals })
    } catch (err) {
      formatZodError(err, reply)
    }
  })
}
