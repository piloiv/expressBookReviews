const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return users.some((user) => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return users.some((user) => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign(
      { data: username },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken: accessToken,
      username: username
    };

    return res.status(200).json({
      message: "User successfully logged in"
    });
  } else {
    return res.status(401).json({
      message: "Invalid username or password"
    });
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;

  // Get username from the session
  const username = req.session.authorization.username;

  if (!review) {
    return res.status(400).json({
      message: "Review is required"
    });
  }

  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review successfully posted",
    reviews: books[isbn].reviews
  });
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  if (!books[isbn].reviews[username]) {
    return res.status(404).json({
      message: "Review not found for this user"
    });
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: "Review successfully deleted",
    reviews: books[isbn].reviews
  });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
