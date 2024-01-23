const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username:1, name:1})
  response.json(blogs)
})
  
blogsRouter.post('', async (request, response) => {
  if (!request.token) {
    return response.status(401).json({error: 'token missing'})
  }
  if (!request.user) {
    return response.status(401).json({ error: 'token invalid'})
  }
  const user = request.user

  if (!request.body.url || !request.body.title) {
    return response.status(400).json('{error: title or url missing}')
  }
  
  const {title, author, url, likes} = request.body
  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user._id
  })
  
  const result = await blog.save()

  user.blogs = user.blogs.concat(result._id)
  await user.save()

  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  if (!request.token) {
    return response.status(401).json({error: 'token missing'})
  }  
  if (!request.user) {
    return response.status(401).json({ error: 'token invalid'})
  }

  const blog = await Blog.findById({ _id: request.params.id})

  if (request.user._id.toString() !== blog.user._id.toString()){
    return response.status(401).json({ error: 'blogs can only be deleted by their creator'})
  }

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