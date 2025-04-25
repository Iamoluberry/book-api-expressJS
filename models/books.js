const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: [true, "Book title is required"],
        trim: true,
        minLength: [3, "Book title must be at least 3 characters"],
        maxLength: [100, "Book title cannot be more than 100 characters"]
    },
    author: {
        type: String, 
        required: [true, "Author name is required"],
        trim: true,
    },
    year: {
        type: Number,
        required: [true, "Published year is required"],
        min: [1000, "Year should not be less than 1000"],
        max: [new Date().getFullYear(), `Year should not exceed ${new Date().getFullYear()}`],
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = {
    Book
}