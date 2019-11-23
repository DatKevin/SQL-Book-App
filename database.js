let sqlite3 = require("sqlite3")
let database = new sqlite3.Database("./database.db")

let createBooksTable = `CREATE TABLE IF NOT EXISTS books (
  title TEXT, 
  author TEXT, 
  image TEXT, 
  releaseDate TEXT,
  page_count INTEGER)`

database.run(createBooksTable, (error) => {
  if (error) console.error(new Error("Create Books table failed"),error)
  else console.log("Book table success!")
})

module.exports = database