const sharp = require('sharp');
const fs = require('fs');

const resizeImage = (folderName) => async (req, res, next) => {
  if (!req.files) return next();

  try {
    for (const file of req.files) {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/Images/${folderName}/${file.filename}`);
        fs.unlinkSync(`public/Images/${folderName}/${file.filename}`);
    }
    
    next();
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
};

module.exports = { resizeImage };
