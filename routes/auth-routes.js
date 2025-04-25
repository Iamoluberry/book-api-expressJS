const express = require('express');
const {register, login, changePassword} = require('../controllers/user-controller');
const { authMiddleware } = require('../middlewares/auth-middleware');

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.put('/change-password', authMiddleware, changePassword);

module.exports = {
    authRouter
}