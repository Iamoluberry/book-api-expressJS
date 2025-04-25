const { Book } = require('../models/books');

const getAllBooks = async (req, res) => {
    try {

        //paginante all books
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10; 
        const skip = (page - 1) * limit;

        const allBooks = await Book.find().skip(skip).limit(limit);

        const totalBooks = await Book.countDocuments();

        res.status(200).json({
            message: "Get all books successful",
            currentPage: page,
            totalPages: Math.ceil(totalBooks / limit),
            totalBooks: totalBooks,
            data: allBooks,
        });
    } catch (error) {
        console.log(`Error in getting all books: ${error}`);
        res.status(500).json({
            message: `Error in getting all books: ${error.message}`
        });
    }
}

const getSingleBook = async(req, res) => {
    try {
        const id = req.params.id;
        const singleBook = await Book.findById(id);

        if (!singleBook) {
            res.status(404).json({
                message: "Invalid book ID"
            })
        }

        res.status(200).json({
            message: `Book with ${id} retrieved successfully`,
            data: singleBook
        });

    } catch (error) {
        console.log(`Error in getting single book: ${error}`);
        res.status(500).json({
            message: `Error in getting single book: ${error.message}`
        });
    }
}

const postNewBook = async(req, res) => {
    try {
        const newBook = await Book.create({
            title: req.body.title,
            author: req.body.author,
            year: req.body.year
        });

        res.status(201).json({
            message: "Book created successfully",
            data: newBook
        });

    } catch (error) {
        console.log(`Error in posting new book: ${error}`);
        res.status(500).json({
            message: `Error in posting new book: ${error.message}`
        });
    }
}

const updateBook = async(req, res) => {
    try {
        const id = req.params.id;

        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({
                message: "Can't update book that doesn't exist"
            });
        }
        
        const updatedBook = await Book.findByIdAndUpdate(id, {
            title: req.body.title ?? book.title,
            author: req.body.author ?? book.author,
            year: req.body.year ?? book.year,
        }, {new: true});

        res.status(200).json({
            message: "Book updated successfully",
            data: updatedBook
        });

    } catch (error) {
        console.log(`Error in updating book: ${error}`);
        res.status(500).json({
            message: `Error in update book: ${error.message}`
        });
    }
}

const deleteBook = async (req, res) => {
    try {
        const id = req.params.id;

        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({
                message: "Can't delete book that doesn't exist"
            });
        }

        await Book.findByIdAndDelete(id);

        res.status(200).json({
            message: "Book deleted successfully"
        });

    } catch (error) {
        console.log(`Error in deleting book: ${error}`);
        res.status(500).json({
            message: `Error in deleting book: ${error.message}`
        });
    }
};


module.exports = {
    getAllBooks,
    getSingleBook,
    postNewBook,
    updateBook,
    deleteBook
}