require('dotenv').config();
const express = require('express');
const { connectDB } = require('./database/database');
const {bookRouter} = require('./routes/book-routes');
const {authRouter} = require('./routes/auth-routes');
const imageRouter = require('./routes/image-routes');

const app = express();

//connect to DB
connectDB();

//use json middleware for req.body
app.use(express.json());

// register book routes
app.use('/api', bookRouter);
app.use('/api/auth', authRouter);
app.use('/api/image', imageRouter)

app.listen(process.env.PORT, () => {
    console.log(`Server now running on ${process.env.PORT}`);
});