import { FastifyReply } from 'fastify'
import { Tables } from 'knex/types/tables'

export default async function (
  meals: Tables['meals'] | undefined,
  reply: FastifyReply,
) {
  if (!meals) {
    reply.status(422).send({
      message: 'ID Meals not found.',
    })
  }
}
