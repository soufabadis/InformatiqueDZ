const multer = require('multer');
const path = require('path');
const logger = require('../config/logger');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/images'));
  },
  filename: (req, file, cb) => {
    const suffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + suffix + '.jpeg');
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
    logger.error('Not an image! Please upload an image.');
  }
};

const limits = { fileSize: 2000000 };

const uploadImages = multer({ storage, fileFilter, limits });

module.exports = { uploadImages };
