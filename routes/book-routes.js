const express = require('express');
const { getAllBooks, getSingleBook, postNewBook, updateBook, deleteBook } = require('../controllers/book-contoller');
const {authMiddleware} = require("../middlewares/auth-middleware");
const adminMiddleware = require('../middlewares/admin-middleware');

const bookRouter = express.Router();

bookRouter.get('/books', authMiddleware, adminMiddleware, getAllBooks);
bookRouter.get('/book/:id', authMiddleware, getSingleBook);
bookRouter.post('/book', authMiddleware, postNewBook);
bookRouter.put('/book/:id', authMiddleware, updateBook);
bookRouter.delete('/book/:id', authMiddleware, deleteBook);

module.exports = {
    bookRouter
}