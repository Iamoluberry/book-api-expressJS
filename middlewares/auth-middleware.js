require('dotenv').config();
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const bearerToken = req.headers.authorization;

    if (!bearerToken) {
        return res.status(401).json({
            message: "No token provided"
        })
    }

    const token = bearerToken.split(' ')[1];
     
    try {
        const verifiedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = verifiedToken;
        next();
    } catch (error) {
        return res.status(401).json("Invalid or expired token")
    }
}

module.exports = {
    authMiddleware
}