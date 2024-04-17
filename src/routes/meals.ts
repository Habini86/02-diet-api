import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import cookieValidation from '../middlewares/cookie-validation'
import mealsBodySchema from '../utils/meals-body-schema'
import formatZodError from '../middlewares/format-zod-error'
import { UUID, randomUUID } from 'node:crypto'
import { z } from 'zod'
import mealsIsExists from '../middlewares/meals-is-exists'

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
      const formattedDate = new Date(`${year}-${month}-${day}`)

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
  // End Post Add
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
        const [hours, minutes] = time.split(':')

        return {
          id,
          name,
          description,
          time: `${hours}:${minutes}`,
          date: formattedDate,
          diet,
        }
      })

      return reply.status(200).send({ meals })
    } catch (err) {
      formatZodError(err, reply)
    }
  })
  // End Get List
  app.get('/list/:id', async (request, reply) => {
    try {
      const authentication = request.cookies.sessionId

      const getMealsParamsSchema = z.object({
        id: z.string().uuid({ message: 'Invalid ID Params.' }),
      })

      const { id: idMeals } = getMealsParamsSchema.parse(request.params) as {
        id: UUID
      }

      const user = await knex('sessions')
        .where('session_id', authentication)
        .first()

      const _meals = await knex('meals')
        .where({
          user: user!.user,
          id: idMeals,
        })
        .first()

      mealsIsExists(_meals, reply)
      const [hours, minutes] = _meals.time.split(':')
      const meal = {
        id: _meals.id,
        name: _meals.name,
        description: _meals.description,
        time: `${hours}:${minutes}`,
        date: new Date(_meals.date).toISOString().split('T')[0],
        diet: _meals.diet,
      }

      return reply.status(200).send({ meal })
    } catch (err) {
      formatZodError(err, reply)
    }
  })
  // End Get List/:ID
  app.get('/metrics', async (request, reply) => {
    try {
      const authentication = request.cookies.sessionId

      const user = await knex('sessions')
        .where('session_id', authentication)
        .first()

      const meals = await knex('meals').where('user', user!.user)

      const maxMeals = meals.length
      const dietTrueMeals = meals.filter((meal) => meal.diet).length
      const dietFalseMeals = maxMeals - dietTrueMeals
      const sortDietMeals = meals.sort(
        (a, b) =>
          a.date.getTime() - b.date.getTime() || a.time.localeCompare(b.time),
      )

      let maxTrueDietSequence = 0
      let currentDietSequence = 0

      for (const meal of sortDietMeals) {
        if (meal.diet) {
          currentDietSequence += 1
          maxTrueDietSequence = Math.max(
            maxTrueDietSequence,
            currentDietSequence,
          )
        } else {
          currentDietSequence = 0
        }
      }

      const metrics = {
        maxMeals,
        dietTrueMeals,
        dietFalseMeals,
        maxTrueDietSequence,
      }

      return reply.status(200).send({ metrics })
    } catch (err) {
      formatZodError(err, reply)
    }
  })
  // End Get Metrics
  app.delete('/delete/:id', async (request, reply) => {
    try {
      const authentication = request.cookies.sessionId

      const getMealsParamsSchema = z.object({
        id: z.string().uuid({ message: 'Invalid ID Params.' }),
      })

      const { id: idMeals } = getMealsParamsSchema.parse(request.params) as {
        id: UUID
      }

      const user = await knex('sessions')
        .where('session_id', authentication)
        .first()

      mealsIsExists(
        await knex('meals')
          .where({
            user: user!.user,
            id: idMeals,
          })
          .first(),
        reply,
      )

      await knex('meals').delete().where({
        user: user!.user,
        id: idMeals,
      })

      return reply.status(200).send({ message: 'Meals deleted sucessfully' })
    } catch (err) {
      formatZodError(err, reply)
    }
  })
  // End Delete Delete/:ID
  app.put('/put/:id', async (request, reply) => {
    try {
      const authentication = request.cookies.sessionId

      const getMealsParamsSchema = z.object({
        id: z.string().uuid({ message: 'Invalid ID Params.' }),
      })

      const { id: idMeals } = getMealsParamsSchema.parse(request.params) as {
        id: UUID
      }

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

      mealsIsExists(
        await knex('meals')
          .where({
            user: user!.user,
            id: idMeals,
          })
          .first(),
        reply,
      )

      await knex('meals')
        .update({
          name,
          description,
          date: formattedDate,
          time: postgresTime,
          diet,
        })
        .where({
          user: user!.user,
          id: idMeals,
        })

      return reply.status(200).send({
        message: 'Meals changed sucessfully',
      })
    } catch (err) {
      formatZodError(err, reply)
    }
  })
  // End Put Put/:ID
}
