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
  if (blogs.length === 0) {return {}}

  const authors = {}
  let mostAuthor = blogs[0].author

  blogs.forEach( (blog) => {
    if (!(blog.author in authors)) {authors[`${blog.author}`] = 0}
    authors[`${blog.author}`] = authors[`${blog.author}`] + 1

    mostAuthor = authors[`${mostAuthor}`] < authors[`${blog.author}`] 
      ? blog.author
      : mostAuthor
  })

  return {author: mostAuthor, blogs: authors[`${mostAuthor}`]}
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {return {}}

  const authors = {}
  let mostAuthor = blogs[0].author

  blogs.forEach( (blog) => {
    if (!(blog.author in authors)) {authors[`${blog.author}`] = 0}
    authors[`${blog.author}`] = authors[`${blog.author}`] + blog.likes

    mostAuthor = authors[`${mostAuthor}`] < authors[`${blog.author}`] 
      ? blog.author
      : mostAuthor
  })

  return {author: mostAuthor, likes: authors[`${mostAuthor}`]}
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}