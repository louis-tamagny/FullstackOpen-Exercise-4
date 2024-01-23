const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: {type: Number, default: 0},
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

blogSchema.set('toJSON', {transform: (doc, ret) => {
  ret.id = ret._id.toString()
  delete(ret._id)
  delete(ret.__v)
  return ret
}})
  
const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog