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

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {return null}

  const authors = {}
  authors[`${blogs[0].author}`] = 1

  const reducer = (mostAuthor, blog) => {
    if (!(blog.author in authors)) {authors[`${blog.author}`] = 0}
    authors[`${blog.author}`] = authors[`${blog.author}`] + 1

    return authors[`${mostAuthor.author}`] < authors[`${blog.author}`] 
      ? {author: blog.author, blogs: authors[`${blog.author}`]}
      : mostAuthor
  }

  return blogs.reduce(reducer, {author: blogs[0].author, blogs: 1})
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {return null}

  const authors = {}
  authors[`${blogs[0].author}`] = 1

  const reducer = (mostAuthor, blog) => {
    if (!(blog.author in authors)) {authors[`${blog.author}`] = 0}
    authors[`${blog.author}`] = authors[`${blog.author}`] + blog.likes

    return authors[`${mostAuthor.author}`] < authors[`${blog.author}`] 
      ? {author: blog.author, likes: authors[`${blog.author}`]}
      : mostAuthor
  }

  return blogs.reduce(reducer, {author: blogs[0].author, likes: blogs[0].likes})
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}