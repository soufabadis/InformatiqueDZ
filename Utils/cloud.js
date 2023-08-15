const fs = require('fs');
const path = require('path');
const logger = require('../config/logger');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: 'your_cloud_name',
  api_key: 'your_api_key',
  api_secret: 'your_api_secret'
});

const directoryPath1 = path.join(__dirname, 'images'); 

//   upload images from a directory
const uploadImagesFromDirectory =  async function(directoryPath){
  try {
    const files = await fs.promises.readdir(directoryPath);
    
    files.forEach(async file => {
      const imagePath = path.join(directoryPath, file);
      
      try {
        const result = await cloudinary.uploader.upload(imagePath);
        console.log('Image uploaded:', result);
      } catch (error) {
        console.error(`Error uploading image '${file}':`, error);
        logger.error(`Error uploading image '${file}':`, error);
      }
    });
  } catch (error) {
    console.error('Error reading directory:', error);
    logger.error('Error reading directory:', error);

  }
};

// Call the function to start uploading images from the directory
