const fs = require('fs');
const path = require('path');
const logger = require('../config/logger');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME ,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET});


//   upload images 
const uploadImages =  async function(res,req){
  try {

    const images = req.files;
    const uploadedImages = [];

    for (const image of images) {
      const result = await cloudinary.uploader.upload(image.buffer, {
        folder: 'uploads' // Optional folder in Cloudinary
      });

      uploadedImages.push(result.secure_url);
    }
    
    res.json({ uploadedImages });

                
      }
    
   catch (error) {
    console.error('Error upload file:', error);
    logger.error('Error upload file:', error);

  }
}

module.exports=uploadImages;