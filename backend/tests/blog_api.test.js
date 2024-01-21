const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const api = supertest(app)
const Blog = require('../models/blog')

const newBlog = {
  title: 'Go To Statement Considered Harmful',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  likes: 5,
}

app.use(supertest)

test('all blogs are returned in JSON formatting', async () => {
  const response = await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  expect(response.body.length).toBe(2)
})

test('unique identifier is named id', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

test('new blog is created', async () => {
  await api.post('/api/blogs', newBlog)
    .expect(201)
  
  const response = await api.get('/api/blogs')
  expect(response.body.length).toBe(3)

  expect(response.body[response.body.length -1]).toEqual(new Blog(newBlog))

})

afterAll( async () => {
  await mongoose.connection.close()
})