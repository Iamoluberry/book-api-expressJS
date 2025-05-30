


const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(401).json({
            message: "Unauthorized for non admin"
        });
    }

    next();
};

module.exports = adminMiddleware;
