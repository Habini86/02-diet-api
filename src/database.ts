import { env } from './env'
import fs from 'node:fs'
import { knex as setupKnex, Knex } from 'knex'

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection: {
    connectionString: env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
      ca: fs.readFileSync(env.DATABASE_SSL_CERT).toString(),
    },
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const knex = setupKnex(config)
