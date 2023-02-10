const { response } = require("express");
const express = require("express");
const { title, off } = require("process");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN

public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});
// task 10

function getBooks() {
  return new Promise((resolve) => {
    resolve(JSON.stringify(books, null, 4));
  });
}

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  getBooks()
    .then((response) => {
      return res.send(response);
    })
    .catch((err) => {
      return res.status(404).json("Data not available");
    });
});
//////////////////////////////////////////

// task 11

function getBookbyisbn(isbn) {
  return new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  });
}

public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  getBookbyisbn(isbn)
    .then((response) => {
      return res.send(response);
    })
    .catch((err) => {
      return res.status(404).json("Couldn't find the information requested");
    });
});
////////////////////////////////////////////

// task 12

function getBookAuthor(author) {
  return new Promise((resolve, reject) => {
    let keys = [];
    const booksKeys = Object.keys(books).forEach((element) => {
      if (books[element].author === author) {
        keys.push(element);
      }
    });
    const eachBook = [];

    keys.forEach((element) => {
      eachBook.push(books[element]);
    });
    resolve(eachBook);
  });
}

public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  getBookAuthor(author)
    .then((response) => {
      return res.send(response);
    })
    .catch((err) => {
      return res.status(404).json("Error couldn't find data");
    });
});
///////////////////////////////////////////////

// task 13

function getBookTitle(title) {
  return new Promise((resolve, reject) => {
    let keys = [];
    const booksKeys = Object.keys(books).forEach((element) => {
      if (books[element].title === title) {
        keys.push(element);
      }
    });
    const eachBook = [];

    keys.forEach((element) => {
      eachBook.push(books[element]);
    });
    resolve(eachBook);
  });
  // we can do similar with less lines of code with Object.values
  // return new Promise((resolve, reject) => {
  //   const books = Object.values(books).filter((book) => book.title === title);
  //   if (books.length > 0) {
  //     resolve(books);
  //   }
  // });
}

public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  getBookTitle(title)
    .then((response) => res.send(response))
    .catch((err) => {
      return res.status(404).json("Error couldn't find data");
    });
});

/////////////////////////////////////////////

public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  let keys = [];
  const booksKeys = Object.keys(books).forEach((element) => {
    if (books[element].author === author) {
      keys.push(element);
    }
  });

  const eachBook = [];

  keys.forEach((element) => {
    eachBook.push(books[element]);
  });
  res.send(eachBook);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  let keys = [];
  // similar to the get book by author
  const booksKeys = Object.keys(books).forEach((element) => {
    if (books[element].title === title) {
      keys.push(element);
    }
  });
  const eachBook = [];

  keys.forEach((element) => {
    eachBook.push(books[element]);
  });
  res.send(eachBook);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  res.send("Reviews: " + books[isbn].reviews);
});

module.exports.general = public_users;
