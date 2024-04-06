import 'dotenv/config'
import { z } from 'zod'
import * as math from 'mathjs'

const NodeEnv = ['test', 'production', 'development'] as const

const envSchema = z.object({
  NODE_ENV: z.enum(NodeEnv).default('development'),
  DATABASE_URL: z.string(),
  DATABASE_CLIENT: z.string(),
  PORT: z.coerce.number().default(3333),
  EXPIRED_COOKIE: z.string().transform((value) => {
    return math.evaluate(value)
  }),
  DATABASE_SSL_CERT: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment variables!', _env.error.format())
  throw new Error('Invalid environment variables.')
}

export const env = _env.data
