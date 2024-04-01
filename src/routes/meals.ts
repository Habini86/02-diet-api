import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import cookieValidation from '../utils/cookie-validation'

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', cookieValidation)
  app.post('/add', async (request, reply) => {})
}
