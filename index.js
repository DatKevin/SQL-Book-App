// Require statements
let express = require('express');
let app = express();
let database = require("./database.js")

// Middleware
app.use(express.json());


// Configuration Variables
const port = 3000;

// Routes
app.get('/', (request, response) => {
  response.send('Visit /api/books to see our list of titles');
});

// get all books
app.get('/api/books',  (req, res) => {
  let getAllBooks = "SELECT * FROM books"
  database.all(getAllBooks, (error, results) => {
    if (error) console.error(new Error("Could not get all books", error))  
    // send all books as JSON response
    else res.json(results)
  })
});

// get one book
app.get('/api/books/:id',  (req, res) => {
  // find one book by its id
  console.log('books show', req.params.id)
  let selectbookbyID = "SELECT * FROM books WHERE oid = " + req.params.id
  database.get(selectbookbyID, (error,results) => {
    if (error) console.error(new Error("Could not get all books", error))
    else res.json(results)
  })
})

// create new book
app.post('/api/books',  (req, res) => {
  // create new book with form data (`req.body`)
  console.log('books create', req.body)
  let body = req.body
  let createBook = "INSERT INTO books VALUES (?,?,?,?,?)"
  database.run(createBook, [body.title, body.author, body.image, body.releaseDate, body.page_count], (error) => {
    if (error) console.error(new Error("Could not get all books", error))
    else {
      console.log(req.body)
      res.send("Book added!")
    }
  })
})


// update book
app.put('/api/books/:id', (req,res) => {
  // get book id from url params (`req.params`)
  const bookId = parseInt(req.params.id);
  // Use the keys in req.body to create dynamic SET values for the query string
  const queryHelper = Object.keys(req.body).map(ele => `${ ele.toUpperCase() } = ?`);
  // Use the dynamic SET values in from queryHelper to build full UPDATE string
  const updateOneBook = `UPDATE books SET ${queryHelper.join(', ')} WHERE books.oid = ?`;
  // Add values from req.body and the bookId to an array for use in database.run()
  const queryValues = [...Object.values(req.body), bookId];


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

// delete book
app.delete('/api/books/:id',  (req, res) => {
  // get book id from url params (`req.params`)
  console.log('books delete', req.params);
  let selectbookbyID = "DELETE FROM books WHERE oid = " + req.params.id
  database.get(selectbookbyID, (error) => {
    if (error) console.error(new Error("Could not delete book", error))
    else res.send("Book removed!")
  })
})


// Start Server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

