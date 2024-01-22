const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String
})

userSchema.set('toJSON', {transform: (doc, ret) => {
  ret.id = ret._id.toString()
  delete(ret._id)
  delete(ret.__v)
  delete(ret.passwordHash)
  return ret
}})
  
const User = mongoose.model('User', userSchema)

module.exports = User