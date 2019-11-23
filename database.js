let sqlite3 = require("sqlite3")
let database = new sqlite3.Database("./database.db")

let createBooksTable = `CREATE TABLE IF NOT EXISTS books (
  title TEXT, 
  author_id INTEGER, 
  image TEXT, 
  release_date TEXT,
  page_count INTEGER)`

let createAuthorTable = "CREATE TABLE IF NOT EXISTS authors (name TEXT)"

let createCategoriesTable = "CREATE TABLE IF NOT EXISTS categories (name TEXT)"

database.run(createBooksTable, (error) => {
  if (error) console.error(new Error("Create Books table failed"),error)
  else console.log("Book table success!")
})

database.run(createAuthorTable, (error) => {
  if (error) console.error(new Error("Create Authors table failed"),error)
  else console.log("Authors table success!")
})

database.run(createCategoriesTable, (error) => {
  if (error) console.error(new Error("Create Categories table failed"),error)
  else console.log("Categories table success!")
})

module.exports = database