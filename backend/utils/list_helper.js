// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }
  
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (favBlog, blog) => {
    return ( favBlog.likes > blog.likes )
      ? { title: favBlog.title, author: favBlog.author, likes: favBlog.likes }
      : { title: blog.title, author: blog.author, likes: blog.likes }
  }
  

  return ( blogs.length === 0 ) 
    ? null
    : blogs.reduce(reducer, blogs[0])
}

module.exports = {
  dummy, totalLikes, favoriteBlog
}