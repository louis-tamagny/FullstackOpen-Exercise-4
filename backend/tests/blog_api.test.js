const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const api = supertest(app)
const Blog = require('../models/blog')

const newBlog = {
  title: 'a new blog full of stuff',
  author: 'Robert S. Villeneuve',
  url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  likes: 3,
}

const blogList = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2
  }  
]

app.use(supertest)

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of blogList) {
    const newBlog = new Blog(blog)
    await newBlog.save()
  }
})

test('all blogs are returned in JSON formatting', async () => {
  const response = await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  expect(response.body.length).toBe(blogList.length)
})

test('unique identifier is named id', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

test('new blog is created', async () => {
  await api.post('/api/blogs')
    .send(newBlog)
    .expect(201)
  
  const response = await api.get('/api/blogs')
  expect(response.body.length).toBe(blogList.length + 1)
  expect(response.body[response.body.length -1].title).toEqual(newBlog.title)
  expect(response.body[response.body.length -1].likes).toEqual(newBlog.likes)
  expect(response.body[response.body.length -1].author).toEqual(newBlog.author)
  expect(response.body[response.body.length -1].url).toEqual(newBlog.url)  
})

test('new blog without likes is created', async () => {
  const newBlogWithoutLikes = {
    title: 'a new blog full of stuff',
    author: 'Robert S. Villeneuve',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html'
  }
  const response = await api.post('/api/blogs')
    .send(newBlogWithoutLikes)
    .expect(201)

  expect(response.body.likes).toBeDefined()
  expect(response.body.likes).toBe(0)
})

afterAll( async () => {
  await mongoose.connection.close()
})