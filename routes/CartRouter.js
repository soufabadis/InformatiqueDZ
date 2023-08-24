const { addToCart, getCart, clearCart,applyCoupon,createOrder,getOrder,updateOrderStatus} = require('../controller/cartController');
const {authMiddleware,isAdmin} = require('../middlewares/authMiddlewares');
const express = require('express');


const router=express.Router();

router.post('/addto-cart',authMiddleware,addToCart);
router.get('/getcart',authMiddleware,getCart);
router.delete('/clear-cart',authMiddleware,clearCart);
router.put('/apply-coupon',authMiddleware,applyCoupon);
router.post ('/create-order',authMiddleware,createOrder);
router.get ('/get-order',authMiddleware,getOrder);
router.put ('/update-order-status/:orderId',authMiddleware,isAdmin,updateOrderStatus);



module.exports=router;
