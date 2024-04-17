import { beforeEach, it, afterAll, beforeAll, describe, expect } from 'vitest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'
import request from 'supertest'

describe('Meals routes', () => {
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

  it('should be able to add a new meal', async () => {
    const registrationResponse = await request(app.server)
      .post('/user/register')
      .send({
        username: 'john_doe',
        email: 'teste@gmail.com',
        password: 'Password123@',
      })

    const authCookie = registrationResponse.get('Set-Cookie') || []

    await request(app.server)
      .post('/meals/add')
      .set('Cookie', authCookie)
      .send({
        name: 'Quick snack',
        description: 'Fruit and yogurt',
        date: '02-04-2024',
        time: '10:23',
        diet: true,
      })
      .expect(201)
  })

  it('should be able to get all meals', async () => {
    const registrationUserResponse = await request(app.server)
      .post('/user/register')
      .send({
        username: 'john_doe',
        email: 'teste@gmail.com',
        password: 'Password123@',
      })

    const authCookie = registrationUserResponse.get('Set-Cookie') || []

    await request(app.server)
      .post('/meals/add')
      .set('Cookie', authCookie)
      .send({
        name: 'Snack',
        description: 'Fruit and yogurt',
        time: '10:23',
        date: '16-04-2024',
        diet: true,
      })

    await request(app.server)
      .post('/meals/add')
      .set('Cookie', authCookie)
      .send({
        name: 'Lunch',
        description: 'Salad with grilled chicken',
        time: '12:30',
        date: '15-04-2024',
        diet: true,
      })

    const listMealsResponse = await request(app.server)
      .get('/meals/list')
      .set('Cookie', authCookie)
      .expect(200)

    expect(listMealsResponse.body).toEqual(
      expect.objectContaining({
        meals: [
          {
            id: expect.stringMatching(
              /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
            ),
            name: 'Snack',
            description: 'Fruit and yogurt',
            time: '10:23',
            date: '2024-04-16',
            diet: true,
          },
          {
            id: expect.stringMatching(
              /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
            ),
            name: 'Lunch',
            description: 'Salad with grilled chicken',
            time: '12:30',
            date: '2024-04-15',
            diet: true,
          },
        ],
      }),
    )
  })
})
