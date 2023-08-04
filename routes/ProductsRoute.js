const express = require("express");
const { createProduct,getaProduct,getAllProducts ,updateProduct,deletedProduct} = require("../controller/produtsCtrl");
const {authMiddleware,isAdmin} = require('../middlewares/AuthMiddlewares');
const router = express.Router();


router.post("/create-product",authMiddleware,isAdmin,createProduct);
router.get("/:productId",getaProduct);
router.get("/",getAllProducts);
router.post("/update-product/:productId",authMiddleware,isAdmin,updateProduct);
router.delete("/delete-product/:productId",authMiddleware,isAdmin,deletedProduct);

module.exports= router ;