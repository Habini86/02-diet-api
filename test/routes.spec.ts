import { beforeEach, it, afterAll, beforeAll, describe, expect } from 'vitest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'
import request from 'supertest'

describe('Routes API', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await execSync('npm run knex -- migrate:unlock')
    await execSync('npm run back')
  })

  describe('Users routes', () => {
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
    // End Test User/Register
    it('should be able to login a user', async () => {
      await request(app.server)
        .post('/user/register')
        .send({
          username: 'john_doe',
          email: 'teste@gmail.com',
          password: 'Password123@',
        })
        .expect(201)

      const userLoginResponse = await request(app.server)
        .post('/user/login')
        .send({
          email: 'teste@gmail.com',
          password: 'Password123@',
        })
        .expect(200)

      expect(userLoginResponse.body).toEqual(
        expect.objectContaining({ username: 'john_doe' }),
      )
    })
    // End Test User/Login
  })
  // End Describe Users routes
  describe('Meals routes', () => {
    it('should be able to add a new meal', async () => {
      const registrationResponse = await request(app.server)
        .post('/user/register')
        .send({
          username: 'john_doe',
          email: 'teste@gmail.com',
          password: 'Password123@',
        })
        .expect(201)

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
    // End Test Meals/Add
    it('should be able to get all meals', async () => {
      const registrationUserResponse = await request(app.server)
        .post('/user/register')
        .send({
          username: 'john_doe',
          email: 'teste@gmail.com',
          password: 'Password123@',
        })
        .expect(201)

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
        .expect(201)

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
        .expect(201)

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
    // End Test Meals/List
    it('should be able to get a meal by id', async () => {
      const registrationUserResponse = await request(app.server)
        .post('/user/register')
        .send({
          username: 'john_doe',
          email: 'teste@gmail.com',
          password: 'Password123@',
        })
        .expect(201)

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
        .expect(201)

      const listMealsResponse = await request(app.server)
        .get('/meals/list')
        .set('Cookie', authCookie)
        .expect(200)

      const mealId = listMealsResponse.body.meals[0].id

      const getMealResponse = await request(app.server)
        .get(`/meals/list/${mealId}`)
        .set('Cookie', authCookie)
        .expect(200)

      expect(getMealResponse.body).toEqual(
        expect.objectContaining({
          meal: {
            id: expect.stringMatching(
              /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
            ),
            name: 'Snack',
            description: 'Fruit and yogurt',
            time: '10:23',
            date: '2024-04-16',
            diet: true,
          },
        }),
      )
    })
    // End Test Meals/List/:ID
    it('should be able to get a user metrics', async () => {
      const registrationUserResponse = await request(app.server)
        .post('/user/register')
        .send({
          username: 'john_doe',
          email: 'teste@gmail.com',
          password: 'Password123@',
        })
        .expect(201)

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
        .expect(201)

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
        .expect(201)

      const listMealsMetricsResponse = await request(app.server)
        .get('/meals/metrics')
        .set('Cookie', authCookie)
        .expect(200)

      expect(listMealsMetricsResponse.body).toEqual(
        expect.objectContaining({
          metrics: {
            maxMeals: 2,
            dietTrueMeals: 2,
            dietFalseMeals: 0,
            maxTrueDietSequence: 2,
          },
        }),
      )
    })
    // End Test Meals/Metrics
    it('should be able to delete a meal by id', async () => {
      const registrationUserResponse = await request(app.server)
        .post('/user/register')
        .send({
          username: 'john_doe',
          email: 'teste@gmail.com',
          password: 'Password123@',
        })
        .expect(201)

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
        .expect(201)

      const listMealsResponse = await request(app.server)
        .get('/meals/list')
        .set('Cookie', authCookie)
        .expect(200)

      const mealId = listMealsResponse.body.meals[0].id

      const DeleteMealResponse = await request(app.server)
        .delete(`/meals/delete/${mealId}`)
        .set('Cookie', authCookie)
        .expect(200)

      expect(DeleteMealResponse.body).toEqual(
        expect.objectContaining({
          message: 'Meals deleted sucessfully',
        }),
      )

      const getMealResponse = await request(app.server)
        .get(`/meals/list/${mealId}`)
        .set('Cookie', authCookie)
        .expect(404)

      expect(getMealResponse.body).toEqual(
        expect.objectContaining({
          message: 'ID Meals not found.',
        }),
      )
    })
    // End Test Meals/Delete/:ID
    it('should be able to put a meal by id', async () => {
      const registrationUserResponse = await request(app.server)
        .post('/user/register')
        .send({
          username: 'john_doe',
          email: 'teste@gmail.com',
          password: 'Password123@',
        })
        .expect(201)

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
        .expect(201)

      const listMealsResponse = await request(app.server)
        .get('/meals/list')
        .set('Cookie', authCookie)
        .expect(200)

      const mealId = listMealsResponse.body.meals[0].id

      const PutMealResponse = await request(app.server)
        .put(`/meals/put/${mealId}`)
        .set('Cookie', authCookie)
        .send({
          name: 'Updated Snack',
          description: 'Updated description',
          date: '17-04-2024',
          time: '11:00',
          diet: false,
        })
        .expect(200)

      expect(PutMealResponse.body).toEqual(
        expect.objectContaining({
          message: 'Meals changed sucessfully',
        }),
      )

      const getMealResponse = await request(app.server)
        .get(`/meals/list/${mealId}`)
        .set('Cookie', authCookie)
        .expect(200)

      expect(getMealResponse.body).toEqual(
        expect.objectContaining({
          meal: {
            id: expect.stringMatching(
              /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
            ),
            name: 'Updated Snack',
            description: 'Updated description',
            time: '11:00',
            date: '2024-04-17',
            diet: false,
          },
        }),
      )
    })
    // End Test Meals/Put/:ID
  })
  // End Describe Meals routes
})
