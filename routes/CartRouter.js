const { addToCart, getCart, clearCart } = require('../controller/cartController');
const {authMiddleware,isAdmin} = require('../middlewares/authMiddlewares');
const express = require('express');


const router=express.Router();

router.post('/addto-cart',authMiddleware,addToCart);
router.get('/getcart',authMiddleware,getCart);
router.delete('/clear-cart',authMiddleware,clearCart);

module.exports=router;