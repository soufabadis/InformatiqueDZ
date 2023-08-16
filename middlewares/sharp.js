const sharp = require("sharp");
const logger = require("../config/logger");


// Middleware for image resizing using sharp
const resizeImage = async (req, res, next) => {
    if (!req.files) return next();
  
    try {
      for (const file of req.files)  {
           
          await sharp(file.path)
            .resize(300, 300)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            
        }

      next();
    }
  
     catch (error) {
        throw new Error(" can t resize Images :"+error);
    }
  
}
  module.exports = {resizeImage};