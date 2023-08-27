const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddlewares');
const {createPayment,getPaymentId,cancelPayment} = require('../controller/paymentCtrl');

const router = express.Router();

router.post("/create-payment", authMiddleware, createPayment);
router.get("/success", authMiddleware, getPaymentId);
router.get("/cancel", authMiddleware, cancelPayment); 




module.exports = router;
