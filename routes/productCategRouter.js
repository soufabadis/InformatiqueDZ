const express = require('express');
const {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  getAllCategories
} = require('../controller/ProdCategoryCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddlewares');

const router = express.Router();

router.post('/create-productcategory', authMiddleware, isAdmin, createCategory);
router.get('/get-productcategory/:categoryId', getCategory);
router.put('/update-productcategory/:categoryId', authMiddleware, isAdmin, updateCategory);
router.delete('/delete-productcategory/:categoryId', authMiddleware, isAdmin, deleteCategory);
router.get('/all-categories', getAllCategories);

module.exports = router;
