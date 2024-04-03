import { FastifyReply } from 'fastify'
import { ZodError } from 'zod'

type Response = {
  error?: string
  required_error?: string
  invalid_type_error?: string
}

export default function (err, reply: FastifyReply) {
  if (err instanceof ZodError) {
    const errorMessage = JSON.parse(err.message)[0]
    const response: Response = {}

    if (errorMessage.message) {
      response.error = errorMessage.message
    }

    if (errorMessage.required_error) {
      response.required_error = errorMessage.required_error
    }

    if (errorMessage.invalid_type_error) {
      response.invalid_type_error = errorMessage.invalid_type_error
    }

    return reply.status(401).send(response)
  }
}
