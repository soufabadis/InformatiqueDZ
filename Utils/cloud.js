const logger = require('../config/logger');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

//   upload images
const uploadImagesToCloud = async function(images) {
  try {
    const uploadPromises = images.map((image) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
          image.path, 
          { resource_type: "auto" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve({
                url: result.secure_url,
                asset_id: result.asset_id, 
                public_id: result.public_id 
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
    throw error; 
  }
};

// Delete images from Cloudinary

const deleteImagesFromCloud = async function(publicIds) {
  try {
    const deletePromises = publicIds.map((publicId) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              public_id: publicId,
              result: result
            });
          }
        });
      });
    });

    const deletedImages = await Promise.all(deletePromises);

    return deletedImages;
  } catch (error) {
    console.error('Error deleting files:', error);
    logger.error('Error deleting files:', error);
    throw error; 
  }
};




module.exports = {
  uploadImagesToCloud,
  deleteImagesFromCloud
};