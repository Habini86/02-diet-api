// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      username: string
      email: string
      password: string
    }
    sessions: {
      session_id: string
      user: string
    }
  }
}
