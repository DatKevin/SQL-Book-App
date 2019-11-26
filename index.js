// Require statements
let express = require('express');
let app = express();
let database = require("./database.js")

// Middleware
app.use(express.json());


// Configuration Variables
let port = 3000;

// Routes
app.get('/', (request, response) => {
  response.send('Visit /api/books to see our list of titles');
});

//Get all books
app.get('/api/books',  (req, res) => {
  let getAllBooks = "SELECT * FROM books"
  database.all(getAllBooks, (error, results) => {
    if (error) console.error(new Error("Could not get all books", error))  
    // send all books as JSON response
    else res.json(results)
  })
});

//Get one book
app.get('/api/books/:id',  (req, res) => {
  //Find one book by its id
  console.log('books show', req.params.id)
  let id = req.params.id
  let selectbookbyID = "SELECT * FROM books WHERE oid = ?"
  database.get(selectbookbyID, [id], (error,results) => {
    if (error) console.error(new Error("Could not get single book", error))
    else res.json(results)
  })
})

//Create new book
app.post('/api/books',  (req, res) => {
  //Create new book with form data (`req.body`)
  console.log('books create', req.body)
  let body = req.body
  let createBook = "INSERT INTO books VALUES (?,?,?,?,?)"
  database.run(createBook, [body.title, body.author, body.image, body.releaseDate, body.page_count], (error) => {
    if (error) console.error(new Error("Could not create author", error))
    else {
      console.log(req.body)
      res.send("Book added!")
    }
  })
})


//Update book
app.put('/api/books/:id', (req,res) => {
  //Get book id from url params (`req.params`)
  let bookId = parseInt(req.params.id);
  //Use the keys in req.body to create dynamic SET values for the query string
  let queryHelper = Object.keys(req.body).map(ele => `${ ele.toUpperCase() } = ?`);
  //Use the dynamic SET values in from queryHelper to build full UPDATE string
  let updateOneBook = `UPDATE books SET ${queryHelper.join(', ')} WHERE books.oid = ?`;
  //Add values from req.body and the bookId to an array for use in database.run()
  let queryValues = [...Object.values(req.body), bookId];


  database.run(updateOneBook, queryValues, function (error) {
    if (error) {
      console.log(new Error('Could not update book'), error);
      res.sendStatus(500);
    } else {
      console.log(`Book with ID ${bookId} was updated successfully`);
      res.sendStatus(200);
    }
  })
})

//Delete book
app.delete('/api/books/:id',  (req, res) => {
  //Get book id from url params (`req.params`)
  console.log('books delete', req.params);
  let selectbookbyID = "DELETE FROM books WHERE oid = " + req.params.id
  database.get(selectbookbyID, (error) => {
    if (error) {
      console.error(new Error("Could not delete book", error))
      res.sendStatus(500)
    }
    else res.send("Book removed!")
  })
})


////////////////////////
// TODO: AUTHOR ROUTES
////////////////////////
// 1. Write a route to retrieve all authors from the database
app.get("/api/authors/", (req, res) => {
  let getAllAuthors = "SELECT * FROM authors"
  database.all(getAllAuthors, (error, results) => {
    if (error) console.error(new Error("Could not get all books", error))  
    else res.json(results)
  })
})

// 2. Write a route to add a new author to the database
app.post('/api/authors',  (req, res) => {
  console.log('authors create', req.body)
  let body = req.body
  let createAuthor = "INSERT INTO authors VALUES (?)"
  database.run(createAuthor, [body.name], (error) => {
    if (error) console.error(new Error("Could not create author", error))
    else {
      console.log(req.body)
      res.send("Author added!")
    }
  })
})

// 3. (OPTIONAL) Write the rest of the RESTful routes for this entity for extra practice.


//////////////////////////
// TODO: CATEGORY ROUTES
//////////////////////////
// 1. Add a route to retrieve all categories from the database
app.get("/api/categories/", (req, res) => {
  let getAllCategories = "SELECT * FROM categories"
  database.all(getAllCategories, (error, results) => {
    if (error) console.error(new Error("Could not get all books", error))  
    // send all books as JSON response
    else res.json(results)
  })
})

// 2. Write a route to add a new category to the database
app.post('/api/categories',  (req, res) => {
  // create new book with form data (`req.body`)
  console.log('Category create', req.body)
  let body = req.body
  let createCategory = "INSERT INTO categories VALUES (?)"
  database.run(createCategory, [body.name], (error) => {
    if (error) console.error(new Error("Could not create category", error))
    else {
      console.log(req.body)
      res.send("Category added!")
    }
  })
})

// 3. (OPTIONAL) Write the rest of the RESTful routes for this entity for extra practice.

/////////////////////////////////////////////////
// TODO: BOOKS_CATEGORIES ROUTES (MANY TO MANY)
/////////////////////////////////////////////////

//Returns all book titles with all thier categories
app.get("/api/bookcategories/", (req, res) => {
  console.log("Getting all books and categories")
  let getAllBookCategories = "SELECT books.title, categories.name AS category FROM books JOIN bookcategories ON bookcategories.bookID = books.oid JOIN categories ON categories.oid = bookcategories.categoryID ORDER BY books.title"
  database.all(getAllBookCategories, (error, results) => {
    if (error) console.error(new Error("Could not get all book categories", error))  
    // send all books as JSON response
    else res.json(results)
  })
})

//Get book categories by id book titles with all thier categories
app.get("/api/bookcategories/:id", (req, res) => {
  console.log("Getting book and categories", req.params.id)
  let getBookCategories = "SELECT books.title, categories.name AS category FROM books JOIN bookcategories ON bookcategories.bookID = books.oid JOIN categories ON categories.oid = bookcategories.categoryID WHERE books.oid = ?"
  database.all(getBookCategories, [req.params.id], (error, results) => {
    if (error) console.error(new Error("Could not get book categories", error))  
    // send book categories as JSON response
    else res.json(results)
  })
})

// create new categories for a book
app.post("/api/bookcategories/",  (req, res) => {
  // create new categories for existing book with form data (`req.body`)
  console.log('book category create', req.body)
  let body = req.body
  let createBookCat = "INSERT INTO bookcategories VALUES (?, ?)"
  //Post should have a bookID and a categoryID as the keys
  database.run(createBookCat, [body.bookID, body.categoryID], (error) => {
    if (error) {
      console.error(new Error("Could not create book category", error))
    }
    else {
      console.log(req.body)
      res.send("Book categories added!")
    }
  })
})


//Updates and changes an existing  category
app.put("/api/bookcategories/",  (req, res) => {
  console.log("Updating book category", req.body)
  let body = req.body
  let updateBookCat = "UPDATE bookcategories SET categoryID = ? WHERE bookID = ? AND categoryID = ?"
  //Keys are bookID, oldcatID (Category ID to be changed), newcatID (new Category ID value)
  database.run(updateBookCat, [body.newcatID, body.bookID, body.oldcatID], (error) => {
      if (error) {
        console.error(new Error("Could not update book cat", error))
        res.sendStatus(500)
      }    
      else {
        console.log(req.body)
        res.send("Updated book Cat!")
    }
  })
})

//Updates and deletes an existing  category
app.delete("/api/bookcategories/",  (req, res) => {
  console.log("Deleting book category", req.body)
  let body = req.body
  let deleteBookCat = "DELETE FROM bookcategories WHERE bookID = ? AND categoryID = ?"
  //Keys are bookID and catID (Category ID to be deleted for that specific book)
  database.run(deleteBookCat, [body.bookID, body.catID], (error) => {
      if (error) {
        console.error(new Error("Could not delete book cat", error))
        res.sendStatus(500)
      }    
      else {
        console.log(req.body)
        res.send("Deleted book Cat!")
    }
  })
})

// Start Server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
})