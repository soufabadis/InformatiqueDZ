const express = require('express');
const { createCoupon, findCoupon, getAllCoupons, updateCoupon, deleteCoupon } = require('../controller/couponCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddlewares');

const router = express.Router();

router.post('/create-coupon', authMiddleware, isAdmin, createCoupon);
router.get('/get-all-coupons' ,authMiddleware, isAdmin, getAllCoupons);
router.get('/find-coupon/:couponId' ,authMiddleware, isAdmin, findCoupon);
router.put('/update-coupon/:couponId', authMiddleware, isAdmin, updateCoupon);
router.delete('/delete-coupon/:couponId', authMiddleware, isAdmin, deleteCoupon);

module.exports = router;
