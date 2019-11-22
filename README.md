# SQL Books

In the following lesson/lab, we'll be putting all of the concepts covered in this unit together in one place. We call a project like this a reference app since it gives students a good reference to come back to during not just the project but also after the course ends.

Remember to commit your code often through this exercise and as much as possible try to complete the steps without looking at the provided code. Forcing yourself to do the hard work of research, testing, and debugging will pay off in the short and long-term. Have fun!

# Sprint 1 - Express & sqlite3

## 0. Set up your app

1. Fork and clone this repository at the `master` branch.


## 1. You awake inside a new app and look around.

1. Take a few minutes to familiarize yourself with your surroundings and navigate the file structure of this app.  You should see a few routes listed in `index.js` that return JSON as responses.  Also notice the three dependencies in `package.json`: `express`, `sqlite3`, and `nodemon`.

2. Open up your browser and startup the server.  Take a look at the books on the front-end.
  > You didn't forget to `npm install` did you?


## 2. OK server.js, let's see what you've got?!

1. Open up `server.js` and take a look at the hard-coded books data.  You should see an array of book objects in there called `books`.

2. You should also already see that there are routes to create (POST) new books, get a list of books (GET index), get a single book (GET show) and edit (PUT) and delete (DELETE) books.  -- Notice they're all manipulating the `books` array.  


## 3. Outgrowing Arrays as a datastore.

Arrays are no longer adequate as a data-store.  They lose their data whenever the server is shut down, they don't support backups unless you copy the file, and new elements never get saved in the file.  Plus, all the cool kids are using databases.

Let's replace that array with a database.  We'll create a `database.js` file, write code to create a `books` table, and export the `database` module from that file for use elsewhere in our app.  

1. First off let's require `sqlite3` and create a new database.  

```js
let sqlite3 = require('sqlite3');
let database = new sqlite3.Database('./database.db');
```

2. Our books will have the following attributes:
  * title
  * author
  * image (use a string for this)
  * releaseDate

Using the code below, your work from a previous assignment, or your memory, write out a SQL statement that will create a new `books` table with the correct columns if one does not already exist. Save the statement to a variable. If you need a hand with this task the code is below:

```js
const createBooksTableQuery = "CREATE TABLE IF NOT EXISTS books (title TEXT, author TEXT, image TEXT, release_date TEXT)";
```

3. Do you remember how to run our statement and provide feedback in the terminal? If so, write out the `database.run()` function with `createBooksTableQuery` as the first argument and a call back function as the second.

```js
database.run(createBooksTableQuery, error => {
  if (error) console.error(new Error("Create books table failed."), error);
  else console.log("Create books table succeeded");
});
```

In the code above we create the `books` table if it does not exist and output a successful message to the console.

4. Finally we'll need to export the `database` using `module.exports`.  You can export it at the very end of the file by doing:
  
  ```js
  module.exports = database;
  ```

5. To test that this is all working as expected, require the database.js file in your index.js file and look for the successful message to popup from our server. If you get an error at this point **do not move on before fixing it**.


## 4. Seed some data to the books table.

**What's a seed-file, you ask?**
> A seed file is a file used to load pre-made data into our database.  It lets us start up our app without having to key in starter data each time.

1. Unless otherwise instructed, type out the following code into a file called `seed.js`.

```js
// require our database when running this file
const db = require('./database.js');

// The following list of books will be used to populate the books table
const books_list = [
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    image: "https://s3-us-west-2.amazonaws.com/sandboxapi/to_kill_a_mockingbird.jpg",
    release_date: "July 11, 1960"
  },
  {
    title: "The Great Gatsby",
    author: "F Scott Fitzgerald",
    image: "https://s3-us-west-2.amazonaws.com/sandboxapi/great_gatsby.jpg",
    release_date: "April 10, 1925"
  },
  {
    title: "Les Miserables",
    author: "Victor Hugo",
    image: "https://s3-us-west-2.amazonaws.com/sandboxapi/les_miserables.jpg",
    release_date: "Unknown 1862"
  },
  {
    title: "Around the World in 80 Days",
    author: "Jules Verne",
    image: "https://s3-us-west-2.amazonaws.com/sandboxapi/around_the_world_in_80_days.jpg",
    release_date: "January 30, 1873"
  },
  {
    title: "Lean In",
    author: "Sheryl Sandberg",
    image: "https://s3-us-west-2.amazonaws.com/sandboxapi/lean_in.jpg",
    release_date: "March 11, 2013"
  },
  {
    title: "The Four Hour Workweek",
    author: "Tim Ferriss",
    image: "https://s3-us-west-2.amazonaws.com/sandboxapi/four_hour_work_week.jpg",
    release_date: "April 1, 2007"
  },
  {
    title: "Of Mice and Men",
    author: "John Steinbeck",
    image: "https://s3-us-west-2.amazonaws.com/sandboxapi/of_mice_and_men.jpg",
    release_date: "Unknown 1937"
  },
  {
    title: "Romeo and Juliet",
    author: "William Shakespeare",
    image: "https://s3-us-west-2.amazonaws.com/sandboxapi/romeo_and_juliet.jpg",
    release_date: "Unknown 1597"
  }
];

const deleteBooks = 'DELETE FROM books';
const insertIntoBooks = 'INSERT INTO books VALUES (?, ?, ?, ?)';

db.run(deleteBooks, error => {
  if (error) console.log(new Error('Could not delete rows from books'), error);
  else {

    books_list.forEach(book => {
      db.run(insertIntoBooks, [book.title, book.author, book.image, book.release_date], error => {
        if (error) console.log(new Error('Could not add books to books'), error);
        else {
          console.log(`${book.title} successfully added to the database!`);
        }
      });
    });
  }
});
```

2. Save the file and run `node seed.js`. You should get a bunch of logged statements in the console recording the titles of each book added to the DB. If you get an error there is either something wrong with the `database.js` file (though you would have seen an error in the previous section!) OR the `seed.js` file.

> You can run this file whenever you need to start over with your database but you'll need to update it to handle other entities when they are added to the project.


## 5. Using the database in our routes.
As you'll remember, a few routes were defined for you from the beginning but they were only setup to interact with an array of books. In this section we'll practice refactoring code by removing the current array-based code in the callback functions of our routes, and replacing it with code that "talks" to our database.

1. Start by removing the `books` array, the `newBookUUID`, and **all** of the code in the body of the callback function in each of our routes. When you're done, your routes should look like this:

```js
// Routes
app.get('/', (request, response) => {
  response.send('Visit /api/books to see our list of titles');
});

// get all books
app.get('/api/books',  (req, res) => {
  // send all books as JSON response

});

// get one book
app.get('/api/books/:id',  (req, res) => {
  // find one book by its id

});

// create new book
app.post('/api/books',  (req, res) => {
  // create new book with form data (`req.body`)

});

// update book
app.put('/api/books/:id', (req,res) => {
  // get book id from url params (`req.params`)

});

// delete book
app.delete('/api/books/:id',  (req, res) => {
  // get book id from url params (`req.params`)

});
```

2. With our `index.js` cleaned of old code, we're free to start building CRUD functionality that interacts with our database (and more specifically, the `books` table). Let's start with the `GET /api/books` route. Figure out the SQL statement to return all rows of books from the table and save it to a variable within the callback function. You can refer to the code here for help:

```js
// get all books
app.get('/api/books',  (req, res) => {
  // send all books as JSON response
  const getAllBooks = "SELECT * FROM books";
});
```

3. Now use that SQL statement to pull the books from our database. This is the completed function:

```js
// get all books
app.get('/api/books',  (req, res) => {
  // send all books as JSON response
  const getAllBooks = "SELECT * FROM books";

  database.all(getAllBooks, (error, results) => {
    if (error) {
      console.log(new Error('Could not get all books'), error);
      res.sendStatus(500);
    }
    res.status(200).json(results);
  });
});
```

> Why use `database.all()` here instead of another `database` method? 

Don't just take our word that this code works, test it out with your request framework of choice.

4. The `GET /api/books` route is an easy one. Let's handle one of the more unfamiliar routes and then it will be up to you to complete the rest. Handling `PUT` requests tends to require more complicated code so let's tackle that one next and step our way through it. 

Anytime we update a record in the database, there are two pieces of information we need to know. What are they?
> 1. The thing we plan to update.
> 2. What information to update it with.

Begin by writing the SQL statement to update the title column for one of the books in the table.

```js
const updateOneBook = `UPDATE books SET TITLE = ? WHERE books.oid = ${req.params.id}`;
```

Here we make use of the `id` stored in the request parameters to select the book we want to update.

5. How do we send data with a request to our API? If you're thinking about the request body then you're right! Let's get the updated title out of the req.body object and use it to fill in the `?` in our query statement.

```js
  database.run(updateOneBook, [req.body.title], error => {
    if (error) {
      console.log(new Error('Could not update book'), error);
      res.sendStatus(500);
    } else {
      console.log(`Book with ID ${req.params.id} was update successfully`);
      res.sendStatus(200);
    }
  });
```

With this code in place we should be able to change the titles of books saved in our database if we know their `oid`.

**Stretch Goal**: Give yourself a 20 minute timer and try to figure out how to build a query statement that would allow us to updadte more than one field.
**Double Stretch**: Spend 10 more minutes trying to write a dynamic query string that would allow you to update just one OR multiple fields in one database operation.

6. Three routes are yet to be refactored in our Book API. Using a similar process (but new code) modify the `GET /api/books/:id`, `POST /api/books`, `DELETE /api/books/:id`.

---

# Sprint 2: Authors
## 0. Don't attempt this sprint until finishing the first one.
Seriously.

## 1. Repeat, repeat, repeat.
