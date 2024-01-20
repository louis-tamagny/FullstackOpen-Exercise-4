const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const api = supertest(app)

app.use(supertest)

test('all blogs are returned in JSON formatting', async () => {
  const response = await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  expect(response.body.length).toBe(2)
})

test('unique identifier is named id', async () => {
  const response = await api.get('/api/blogs')
  console.log(response.body)
  expect(response.body[0].id).toBeDefined()
})

afterAll( async () => {
  await mongoose.connection.close()
})