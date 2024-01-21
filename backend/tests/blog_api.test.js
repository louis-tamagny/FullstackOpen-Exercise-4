const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const api = supertest(app)
const Blog = require('../models/blog')

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

describe('new blog', () => {
  test('new blog is created', async () => {
    const newBlog = {
      title: 'a new blog full of stuff',
      author: 'Robert S. Villeneuve',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 3,
    }

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
    const newBlog = {
      title: 'a new blog full of stuff',
      author: 'Robert S. Villeneuve',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html'
    }
    const response = await api.post('/api/blogs')
      .send(newBlog)
      .expect(201)

    expect(response.body.likes).toBeDefined()
    expect(response.body.likes).toBe(0)
  })

  test('new blog without title is created', async () => {
    const newBlogWithoutTitle = {
      author: 'Robert S. Villeneuve',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html'
    }
    await api.post('/api/blogs')
      .send(newBlogWithoutTitle)
      .expect(400)
  })

  test('new blog without URL is created', async () => {
    const newBlogWithoutUrl = {
      title: 'a new blog full of stuff',
      author: 'Robert S. Villeneuve'
    }
    await api.post('/api/blogs')
      .send(newBlogWithoutUrl)
      .expect(400) 
  })
})

test('a blog is deleted', async () => {
  const newBlog = {
    title: 'a new blog full of stuff',
    author: 'Robert S. Villeneuve',
    url: 'http://notareal.url'
  }

  let result = await api.post('/api/blogs').send(newBlog)
  await api.delete(`/api/blogs/${result.body.id}`).expect(200)

  const response = await api.get('/api/blogs')
  expect(response.body.length).toBe(blogList.length)
  expect(JSON.stringify(response.body)).not.toContain(result.body.id)
})

test('a blog is updated', async () => {
  const newBlog = {
    title: 'a new blog full of stuff',
    author: 'Robert S. Villeneuve',
    url: 'http://notareal.url',
    likes: 10
  }

  let response = await api.get('/api/blogs')
  await api
    .put(`/api/blogs/${response.body[0].id}`)
    .send(newBlog)
    .expect(200)
  response = await api.get('/api/blogs')
  expect(response.body[0].title).toBe(newBlog.title)
  expect(response.body[0].author).toBe(newBlog.author)
  expect(response.body[0].url).toBe(newBlog.url)
  expect(response.body[0].likes).toBe(newBlog.likes)
})


afterAll( async () => {
  await mongoose.connection.close()
})