const bcrypt = require('bcrypt')
const User = require('../models/user')
const usersRouter = require('express').Router()

usersRouter.post('', async (request, response) => {
  if (!request.body.password || request.body.password.length < 3) {
    return response.status(400).json({error: 'password must be at least 3 characters long'})
  }

  const saltRounds = 10

  const hashedPassword = await bcrypt.hash(request.body.password, saltRounds)
  const newUser = new User({
    username: request.body.username,
    name: request.body.name,
    passwordHash: hashedPassword
  })
  
  let user = await newUser.save()
  response.status(200).json(user)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {url:1, title:1, author:1, likes:1})
  response.status(200).json(users)
})

module.exports = usersRouter