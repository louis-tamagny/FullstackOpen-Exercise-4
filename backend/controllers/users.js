const bcrypt = require('bcrypt')
const User = require('../models/user')
const usersRouter = require('express').Router()

usersRouter.post('', async (request, response) => {
  console.log(request.body)

  const saltRounds = 10

  const hashedPassword = await bcrypt.hash(request.body.password, saltRounds)
  console.log(hashedPassword)
  const newUser = new User({
    username: request.body.username,
    name: request.body.name,
    passwordHash: hashedPassword})
  console.log(newUser)

  const user = await newUser.save()
  console.log(user)

  response.status(200).json(user)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.status(200).json(users)
})

module.exports = usersRouter