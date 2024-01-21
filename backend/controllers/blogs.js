const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})
  
blogsRouter.post('', async (request, response) => {
  if (!request.body.url || !request.body.title) {
    return response.status(400).json('{error: title or url missing}')
  }

  const blog = new Blog(request.body)
  const result = await blog.save()
  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.deleteOne({ _id: request.params.id})
  response.status(200).end()
})

blogsRouter.put('/:id', async (request, response) => {
  await Blog.updateOne({_id: request.params.id}, {
    likes: request.body.likes,
    url: request.body.url,
    author: request.body.author,
    title: request.body.title
  })
  response.status(200).end()
})

module.exports = blogsRouter