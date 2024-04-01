// eslint-disable-next-line
import { UUID } from 'crypto'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: UUID
      username: string
      email: string
      password: string
    }
    sessions: {
      session_id: UUID
      user: UUID
      created_at: string
    }
    meals: {
      id: UUID
      name: string
      description: string
      date: Date
      time: string
      diet: boolean
      user: UUID
    }
  }
}
