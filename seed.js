// require our database module
const db = require('./database.js');

// starter data
const books_list = [
    {
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      image: "https://s3-us-west-2.amazonaws.com/sandboxapi/to_kill_a_mockingbird.jpg",
      release_date: "July 11, 1960",
      page_count: 330
    },
    {
      title: "The Great Gatsby",
      author: "F Scott Fitzgerald",
      image: "https://s3-us-west-2.amazonaws.com/sandboxapi/great_gatsby.jpg",
      release_date: "April 10, 1925",
      page_count: 380
    },
    {
      title: "Les Miserables",
      author: "Victor Hugo",
      image: "https://s3-us-west-2.amazonaws.com/sandboxapi/les_miserables.jpg",
      release_date: "Unknown 1862",
      page_count: 600
    },
    {
      title: "Around the World in 80 Days",
      author: "Jules Verne",
      image: "https://s3-us-west-2.amazonaws.com/sandboxapi/around_the_world_in_80_days.jpg",
      release_date: "January 30, 1873",
      page_count: 2
    },
    {
      title: "Lean In",
      author: "Sheryl Sandberg",
      image: "https://s3-us-west-2.amazonaws.com/sandboxapi/lean_in.jpg",
      release_date: "March 11, 2013",
      page_count: 80
    },
    {
      title: "The Four Hour Workweek",
      author: "Tim Ferriss",
      image: "https://s3-us-west-2.amazonaws.com/sandboxapi/four_hour_work_week.jpg",
      release_date: "April 1, 2007",
      page_count: 100
    },
    {
      title: "Of Mice and Men",
      author: "John Steinbeck",
      image: "https://s3-us-west-2.amazonaws.com/sandboxapi/of_mice_and_men.jpg",
      release_date: "Unknown 1937",
      page_count: 330
    },
    {
      title: "Romeo and Juliet",
      author: "William Shakespeare",
      image: "https://s3-us-west-2.amazonaws.com/sandboxapi/romeo_and_juliet.jpg",
      release_date: "Unknown 1597",
      page_count: 330
    }
];

// Query Strings
const deleteBooks = 'DELETE FROM books';
const insertIntoBooks = 'INSERT INTO books VALUES (?, ?, ?, ?, ?)';

db.run(deleteBooks, error => {
    if (error) console.log('Could not delete books', error);
    else {
        books_list.forEach(book => {
            let bookData = [book.title, book.author, book.image, book.release_date, book.page_count];
            
            db.run(insertIntoBooks, bookData, error => {
                if (error) console.log('Could not insert book', error);
                else {
                    console.log(`${book.title} successfully added to the database!`);
                }
            })
        })
    }
});
