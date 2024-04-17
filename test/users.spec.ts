import { beforeEach, it, afterAll, beforeAll, describe } from 'vitest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'
import request from 'supertest'

describe('Users routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await execSync('npm run knex migrate:unlock')
    await execSync('npm run knex migrate:rollback --all')
    await execSync('npm run knex migrate:latest')
  })

  it('should be able to register a new user', async () => {
    await request(app.server)
      .post('/user/register')
      .send({
        username: 'john_doe',
        email: 'teste@gmail.com',
        password: 'Password123@',
      })
      .expect(201)
  })

  it('should be able to login a user', async () => {
    await request(app.server).post('/user/register').send({
      username: 'john_doe',
      email: 'teste@gmail.com',
      password: 'Password123@',
    })

    await request(app.server)
      .post('/user/login')
      .send({
        email: 'teste@gmail.com',
        password: 'Password123@',
      })
      .expect(200)
      .expect({ username: 'john_doe' })
  })
})
