/*Get the longest book by page_count*/

SELECT * MAX(page_count) FROM books;


/*Selects the book titles based on a given category id */

SELECT title FROM books WHERE oid = 4;

/*Sum up the page count of the books associated with the theater category*/

SELECT categories.name, SUM(page_count) FROM categories JOIN bookcategories ON bookcategories.categoryID = categories.oid JOIN books ON books.oid = bookcategories.bookID WHERE categories.oid = 8;

/*Sum up the number of books associated with both the fiction and tragedy categories*/

SELECT COUNT(*) FROM (
	SELECT * FROM books JOIN bookcategories ON bookcategories.bookID = books.oid JOIN categories ON categories.oid = bookcategories.categoryID WHERE bookcategories.categoryID IN (7, 1) GROUP BY bookcategories.bookID HAVING COUNT(DISTINCT categoryID) = 2
	);

/*Select one author and return all of categories their books are associated with*/

SELECT categories.name FROM categories JOIN bookcategories ON bookcategories.categoryID = categories.oid JOIN books ON bookcategories.bookID = books.oid JOIN authors ON books.author_id = authors.oid WHERE authors.oid = 7;

/*Create a hometown column for the authors table and set all of the values to "unknown".*/

ALTER TABLE authors ADD hometown TEXT DEFAULT unknown;