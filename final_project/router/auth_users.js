const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.

  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const bookReview = books[req.params.isbn];

  if (!req.query.review) {
    return res.status(400).json({ errorMessage: "Please add a review" });
  }

  if (!bookReview) {
    return res.status(404).json({ errorMessage: "Book not found" });
  } else {
    const username = req.session.authorization.username;
    const userReview = Object.keys(bookReview.reviews).includes(username);

    if (userReview) {
      bookReview.reviews[username].review = req.query.review;
    } else {
      bookReview.reviews[username] = {
        review: req.query.review,
      };
    }

    return res.send(bookReview);
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.body.username;
  if (isbn) {
    delete books[isbn].reviews[username];
    res.send(books[isbn]);
  } else {
    res.send("We couldn't find this book");
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
