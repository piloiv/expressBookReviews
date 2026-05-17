const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  const userExists = users.some((user) => user.username === username);

  if (userExists) {
    return res.status(409).json({
      message: "Username already exists"
    });
  }

  users.push({
    username: username,
    password: password
  });

  return res.status(200).json({
    message: "User successfully registered. Now you can login"
  });
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop using async-await
public_users.get('/', async function (req, res) {
  try {
    const getBooks = new Promise((resolve, reject) => {
      resolve(books);
    });

    const bookList = await getBooks;

    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving book list"
    });
  }
});

// Get book details based on ISBN using async-await
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const getBookByISBN = new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("Book not found");
      }
    });

    const bookDetails = await getBookByISBN;

    return res.status(200).send(JSON.stringify(bookDetails, null, 4));
  } catch (error) {
    return res.status(404).json({
      message: error
    });
  }
});
  
// Get book details based on author using async-await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;

  try {
    const getBooksByAuthor = new Promise((resolve, reject) => {
      let result = {};

      Object.keys(books).forEach((isbn) => {
        if (books[isbn].author === author) {
          result[isbn] = books[isbn];
        }
      });

      if (Object.keys(result).length > 0) {
        resolve(result);
      } else {
        reject("No books found by this author");
      }
    });

    const booksByAuthor = await getBooksByAuthor;

    return res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
  } catch (error) {
    return res.status(404).json({
      message: error
    });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let result = {};

  Object.keys(books).forEach((isbn) => {
    if (books[isbn].title === title) {
      result[isbn] = books[isbn];
    }
  });

  if (Object.keys(result).length > 0) {
    return res.status(200).send(JSON.stringify(result, null, 4));
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
