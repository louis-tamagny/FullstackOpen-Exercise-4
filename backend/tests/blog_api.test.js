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

afterAll( async () => {
  await mongoose.connection.close()
})