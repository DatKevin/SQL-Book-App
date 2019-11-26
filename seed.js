// require our database when running this file
const db = require('./database.js');
// The following list of books will be used to populate the books table
const categories_list = [
  { name: "Fiction" },
  { name: "Non-Fiction" },
  { name: "Theatre" },
  { name: "Comedy" },
  { name: "Tragedy" },
  { name: "Romance" },
  { name: "Adventure" },
  { name: "Self-Help" }
]
const authors_list = [
  { name: "Harper Lee" },
  { name: "F Scott Fitzgerald" },
  { name: "Victor Hugo" },
  { name: "Jules Verne" },
  { name: "Sheryl Sandberg" },
  { name: "Tim Ferriss" },
  { name: "John Steinbeck" },
  { name: "William Shakespeare" }
]
const books_list = [
  {
    title: "To Kill a Mockingbird",
    author_id: 1,
    image: "https://s3-us-west-2.amazonaws.com/sandboxapi/to_kill_a_mockingbird.jpg",
    release_date: "July 11, 1960",
    page_count: 800
  },
  {
    title: "The Great Gatsby",
    author_id: 2,
    image: "https://s3-us-west-2.amazonaws.com/sandboxapi/great_gatsby.jpg",
    release_date: "April 10, 1925",
    page_count: 900
  },
  {
    title: "Les Miserables",
    author_id: 3,
    image: "https://s3-us-west-2.amazonaws.com/sandboxapi/les_miserables.jpg",
    release_date: "Unknown 1862",
    page_count: 10
  },
  {
    title: "Around the World in 80 Days",
    author_id: 4,
    image: "https://s3-us-west-2.amazonaws.com/sandboxapi/around_the_world_in_80_days.jpg",
    release_date: "January 30, 1873",
    page_count: 80
  },
  {
    title: "Lean In",
    author_id: 5,
    image: "https://s3-us-west-2.amazonaws.com/sandboxapi/lean_in.jpg",
    release_date: "March 11, 2013",
    page_count: 700
  },
  {
    title: "The Four Hour Workweek",
    author_id: 6,
    image: "https://s3-us-west-2.amazonaws.com/sandboxapi/four_hour_work_week.jpg",
    release_date: "April 1, 2007",
    page_count: 1000
  },
  {
    title: "Of Mice and Men",
    author_id: 7,
    image: "https://s3-us-west-2.amazonaws.com/sandboxapi/of_mice_and_men.jpg",
    release_date: "Unknown 1937",
    page_count: 850
  },
  {
    title: "Romeo and Juliet",
    author_id: 8,
    image: "https://s3-us-west-2.amazonaws.com/sandboxapi/romeo_and_juliet.jpg",
    release_date: "Unknown 1597",
    page_count: 750
  },
  {
    title: "Twelfth Night",
    author_id: 8,
    image: "sampleImage.jpg",
    release_date: "Unknown 1597",
    page_count: 1000
  },
  {
    title: "Midsummer's Night Dream",
    author_id: 8,
    image: "sampleImage.jpg",
    release_date: "Unknown 1597",
    page_count: 900
  },
  {
    title: "Macbeth",
    author_id: 8,
    image: "sampleImage.jpg",
    release_date: "Unknown 1597",
    page_count: 800
  }
]
const bookCategorySeeds = [
  {
    bookID: 1,
    categoryID: 1
  },
  {
    bookID: 1,
    categoryID: 4
  },
  {
    bookID: 2,
    categoryID: 1
  },
  {
    bookID: 2,
    categoryID: 3
  },
  {
    bookID: 3,
    categoryID: 7
  },
  {
    bookID: 3,
    categoryID: 6
  },
  {
    bookID: 4,
    categoryID: 8
  },
  {
    bookID: 4,
    categoryID: 5
  },
  {
    bookID: 5,
    categoryID: 3
  },
  {
    bookID: 5,
    categoryID: 6
  },
  {
    bookID: 6,
    categoryID: 2
  },
  {
    bookID: 6,
    categoryID: 3
  },
  {
    bookID: 7,
    categoryID: 8
  },
  {
    bookID: 7,
    categoryID: 4
  },
  {
    bookID: 8,
    categoryID: 4
  },
  {
    bookID: 8,
    categoryID: 5
  }
]
const deleteAuthors = 'DELETE FROM authors';
const deleteBooks = 'DELETE FROM books';
const deleteCategories = 'DELETE FROM categories';
const deleteBookCategories = 'DELETE FROM bookcategories';
const insertIntoAuthors = 'INSERT INTO authors (name) VALUES (?)';
const insertIntoBooks = 'INSERT INTO books (title, author_id, image, release_date, page_count) VALUES (?, ?, ?, ?, ?)';
const insertIntoCategories = 'INSERT INTO categories (name) VALUES (?)';
const insertIntoBookCategories = "INSERT INTO bookcategories (bookID, categoryID) VALUES (?, ?)"
db.run(deleteAuthors, error => {
  if (error) console.log(new Error('Could not delete authors'), error);
  else {
    authors_list.forEach(author => {
      db.run(insertIntoAuthors, [author.name], error => {
        if (error) console.log(new Error('Could not add authors'), error);
        else {
          console.log(`${author.name} successfully added to the database!`);
        }
      });
    });
    db.run(deleteBooks, error => {
      if (error) console.log(new Error('Could not delete books'), error);
      else {
        books_list.forEach(book => {
          db.run(insertIntoBooks, [book.title, book.author_id, book.image, book.release_date, book.page_count], error => {
            if (error) console.log(new Error('Could not add books'), error);
            else {
              console.log(`${book.title} successfully added to the database!`);
            }
          });
        });
        db.run(deleteCategories, error => {
          if (error) console.log(new Error('Could not delete categories'), error);
          else {
            categories_list.forEach(cat => {
              db.run(insertIntoCategories, [cat.name], error => {
                if (error) console.log(new Error('Could not add category'), error);
                else {
                  console.log(`${cat.name} successfully added to the database!`);
                }
              });
            });
            db.run(deleteBookCategories, error => {
              if (error) {
                console.log(new Error("Could not delete book cats"), error)
              }
              else {
                bookCategorySeeds.forEach(bookcat => {
                  db.run(insertIntoBookCategories, [bookcat.bookID, bookcat.categoryID], error => {
                    if (error) console.log(new Error("Could not add book cats"), error)
                    else {
                      console.log(`${bookcat.bookID} added to the database!`)
                    }
                  })
                })      
              }
            })
          }
        });
      }
    });
  }
});