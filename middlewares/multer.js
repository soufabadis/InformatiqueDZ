

const multer = require('multer');
const path = require('path');
const logger = require('../config/logger');

const uploadImages = multer({
  storage: {
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../public/Images'));
    },
    filename: (req, file, cb) => {
      const suffix = Date.now() + '.' + Math.round(Math.random() * 1e9);
      cb(null, file.originalname + suffix + '.jpeg');
    }
     },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
      logger.error('Not an image! Please upload an image.');
    }
  },
  limits: { fileSize: 2000000 }
});






module.exports = {uploadImages};

