const { Image } = require('../models/image');
const { uploadToCloudinary, deleteOnCloudinary } = require("../helpers/cloudinary-helper");
const fs = require('fs');

const uploadImageController = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({
                message: "Image is required"
            })
        }

        const { url, publicId } = await uploadToCloudinary(req.file.path);

        const newImage = await Image.create({ url, publicId, uploadedBy: req.user.id });

        //delete image from local storage;
        fs.unlinkSync(req.file.path);

        res.status(201).json({
            message: "Image uploaded sucessfully",
            data: newImage
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error uploading Image"
        })
    }
}

const getImageController = async (req, res) => {
    try {
        
        const imageId = req.params.id;

        if (!imageId) {
            res.status(400).json({
                message: "Invalid image id"
            })
        }

        const data = await Image.findById(imageId).populate('uploadedBy', ['id', 'role']);

        res.status(200).json({
            message: "Successful",
            data: data
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error fetching this image"
        })
    }
}

const getAllImagesController = async (req, res) => {
    try {
        const allImages = await Image.find();

        res.status(200).json({
            message: "All images fetched sucessfully",
            data: allImages
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error fetching all images"
        })
    }
}

const deleteImageController = async(req, res) => {
    try {
        const imageId = req.params.id;

        const image = await Image.findById(imageId);

        if (!image) {
            return res.status(404).json({
                message: "Image not found"
            });
        }

        if (req.user.id !== image.uploadedBy.toString() && req.user.role !== 'admin') {
            return res.status(401).json({
                message: "Unauthorised to delete this image!"
            })
        }

        await deleteOnCloudinary(image.publicId);
 
        const deleteImage = await Image.findByIdAndDelete(imageId);

        if (!deleteImage) {
            return res.status(400).json({
                message: "Error occured deleting this image!"
            })
        }

        res.status(200).json({
            message: "Image deleted successfully"
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error deleting image"
        })
    }
}

module.exports = {uploadImageController, getAllImagesController, deleteImageController, getImageController};