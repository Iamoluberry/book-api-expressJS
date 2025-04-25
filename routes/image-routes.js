const express = require('express');
const imageRouter = express.Router();
const {uploadImageController, getAllImagesController, deleteImageController} = require('../controllers/image-controller');
const { authMiddleware } = require('../middlewares/auth-middleware');
const imageMiddleware = require('../middlewares/imageUpload-middleware');
const adminMiddleware = require('../middlewares/admin-middleware');

imageRouter.post('/upload', authMiddleware, imageMiddleware.single('image'), uploadImageController);
imageRouter.get('/images', authMiddleware, adminMiddleware, getAllImagesController);
imageRouter.delete('/delete/:id', authMiddleware, deleteImageController);

module.exports = imageRouter;