
const logger = require('../config/logger');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME ,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET});


//   upload images 

const uploadImagesToCloud = async function(images) {
  try {
    const uploadPromises = images.map((image) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
          image.path, // Use the path to the image file
          { resource_type: "auto" }, // Specify the resource type
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve({
                url : result.secure_url
              });
            }
          }
        );
      });
    });

    const uploadedImages = await Promise.all(uploadPromises);

    return uploadedImages;
  } catch (error) {
    console.error('Error uploading files:', error);
    logger.error('Error uploading files:', error);
    throw error; // Rethrow the error to be caught by the caller
  }
};

module.exports = uploadImagesToCloud;
