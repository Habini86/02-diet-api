import fastify from 'fastify'
import { usersRoutes } from './routes/user'
import { mealsRoutes } from './routes/meals'
import cookie from '@fastify/cookie'

export const app = fastify()

app.register(cookie)

app.register(usersRoutes, {
  prefix: 'user',
})

app.register(mealsRoutes, {
  prefix: 'meals',
})
