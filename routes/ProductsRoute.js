const express = require('express');
const router = express.Router();
const {
  createProduct,
  getaProduct,
  getAllProducts,
  updateProduct,
  deletedProduct,
  addToWishList,
  ratingProduct,
  uploadProductImage
} = require('../controller/produtsCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddlewares');
const { uploadImages } = require('../middlewares/multer');
const { resizeImage } = require('../middlewares/sharp');

router.post('/create-product', authMiddleware, isAdmin, createProduct);
router.get('/:productId', getaProduct);
router.get('/', getAllProducts);
router.post('/update-product/:productId', authMiddleware, isAdmin, updateProduct);
router.delete('/delete-product/:productId', authMiddleware, isAdmin, deletedProduct);
router.put('/add-towishlist/:productId', authMiddleware, isAdmin, addToWishList);
router.put('/add-rating/', authMiddleware, isAdmin, ratingProduct);
router.put('/upload-image/:id', authMiddleware, isAdmin, uploadImages.array('images', 10), resizeImage('products'), uploadProductImage);

module.exports = router;
