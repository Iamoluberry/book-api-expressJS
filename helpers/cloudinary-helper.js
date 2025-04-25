const {cloudinary} = require('../config/cloudinary');

const uploadToCloudinary = async (filePath) => {
    try {
        const uploadResult = await cloudinary.uploader.upload(filePath);

        return {
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id
        }
         
    } catch (error) {
        console.log("Error while uploading to cloudinary: ", error);
        throw new Error("Error while uploading to cloudinary");
    }
}

const deleteOnCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        throw new Error("Error while deleting on cloudinary");
    }
}

module.exports = {
    uploadToCloudinary,
    deleteOnCloudinary
}