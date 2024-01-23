const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const api = supertest(app)
const User = require('../models/user')

describe('when there is one user', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const user = new User({
      username: 'mluukai',
      name: 'Matti Luukkainen',
      password: 'mattiluukkainen'
    })

    await user.save()
  })

  test('create a valid new user', async () => {
    const newUser = {
      username: 'ltamagny',
      name: 'Louis Tamagny',
      password: 'password'
    }

    await api.post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const savedUser = await User.findOne({username: newUser.username})
    expect(savedUser).toBeDefined()
    expect(savedUser.name).toEqual(newUser.name)

    const users = await User.find({})
    expect(users).toHaveLength(2)
  })

  describe('create an invalide new user', () => {

    test('username already taken', async () => {
      const newUser = {
        username: 'mluukai',
        name: 'Matti Luukkainen',
        password: 'mattiluukkainen'
      }

      const user = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/) 
  
      expect(user.res.text).toContain('User validation failed: username: Error, expected `username` to be unique')

      const users = await User.find({})
      expect(users).toHaveLength(1)
    })

    test('username too small', async () => {
      const newUser = {
        username: 'lt',
        name: 'Louis Tamagny',
        password: 'password'
      }

      const user = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/) 
    
      expect(user.res.text).toContain('"error":"User validation failed: username: Path `username` (`lt`) is shorter than the minimum allowed length (3)')

      const savedUser = await User.findOne({username: newUser.username})
      expect(savedUser).toBe(null)

      const users = await User.find({})
      expect(users).toHaveLength(1)
    })

    test('username missing', async () => {
      const newUser = {
        name: 'Louis Tamagny',
        password: 'password'
      }

      const user = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/) 
    
      expect(user.res.text).toContain('User validation failed: username: Path `username` is required')

      const savedUser = await User.findOne({username: newUser.username})
      expect(savedUser).toBe(null)

      const users = await User.find({})
      expect(users).toHaveLength(1)
    })

    test('password missing', async () => {
      const newUser = {
        username: 'ltamagny',
        name: 'Louis Tamagny'
      }

      const user = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/) 
    
      expect(user.res.text).toContain('password must be at least 3 characters long')

      const savedUser = await User.findOne({username: newUser.username})
      expect(savedUser).toBe(null)

      const users = await User.find({})
      expect(users).toHaveLength(1)
    })
  })

  test('get all users', async () => {
    const users = await api.get('/api/users/')
    expect(users.body).toHaveLength(1)
  })


})

afterAll(() => {
  mongoose.connection.close()
})