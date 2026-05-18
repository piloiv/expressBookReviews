const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

const BASE_URL = "http://localhost:5000";

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (isValid(username)) {
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
});

// Internal data endpoint used by Axios for Tasks 10-13
public_users.get('/books-data', function (req, res) {
  return res.status(200).json(books);
});

// Task 10: Get the book list available in the shop using async-await with Axios
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get(`${BASE_URL}/books-data`);
    return res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving book list"
    });
  }
});

// Task 11: Get book details based on ISBN using async-await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const response = await axios.get(`${BASE_URL}/books-data`);
    const allBooks = response.data;

    if (allBooks[isbn]) {
      return res.status(200).send(JSON.stringify(allBooks[isbn], null, 4));
    } else {
      return res.status(404).json({
        message: "Book not found"
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving book details"
    });
  }
});

// Task 12: Get book details based on author using async-await with Axios
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;

  try {
    const response = await axios.get(`${BASE_URL}/books-data`);
    const allBooks = response.data;

    let result = {};

    Object.keys(allBooks).forEach((isbn) => {
      if (allBooks[isbn].author === author) {
        result[isbn] = allBooks[isbn];
      }
    });

    if (Object.keys(result).length > 0) {
      return res.status(200).send(JSON.stringify(result, null, 4));
    } else {
      return res.status(404).json({
        message: "No books found by this author"
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving books by author"
    });
  }
});

// Task 13: Get all books based on title using async-await with Axios
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;

  try {
    const response = await axios.get(`${BASE_URL}/books-data`);
    const allBooks = response.data;

    let result = {};

    Object.keys(allBooks).forEach((isbn) => {
      if (allBooks[isbn].title === title) {
        result[isbn] = allBooks[isbn];
      }
    });

    if (Object.keys(result).length > 0) {
      return res.status(200).send(JSON.stringify(result, null, 4));
    } else {
      return res.status(404).json({
        message: "No books found with this title"
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving books by title"
    });
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({
      message: "Book not found"
    });
  }
});

module.exports.general = public_users;