const paypal = require('paypal-rest-sdk');
const asyncHandler = require('express-async-handler');
const logger = require('../config/logger');
const uniqid = require('uniqid'); 
const Order = require("../models/OrderModel");


const env = process.env.NODE_ENV;


paypal.configure({
    'mode': env === 'development' ? 'sandbox' : 'live',
    'client_id': process.env.CLIENT_ID,
    'client_secret': process.env.CLIENT_SECRET
});

const createPayment = asyncHandler(async (req, res) => {
    const order = req.body.order;
    const uniqueId = uniqid(); 

    const products = order.products.map((item) => ({
        "name": item.product.title,
        "sku": item.product._id,
        "price": item.product.price,
        "currency": "USD",
        "quantity": item.count
    }));


    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": `${process.env.FRONTEND_URL}/success?paymentId=${uniqueId}`,
            "cancel_url": `${process.env.FRONTEND_URL}/cancel`
        },
        "transactions": [{
            "item_list": {
                "items": products
            },
            "amount": {
                "currency": "USD",
                "total": items.total
            },
            "description": "Payment description"
        }]
    };
    
    // Code to create the payment using PayPal SDK
    try {
        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                throw new Error("something went wrong");
            } else {
                for (let i = 0; i < payment.links.length; i++) {
                    if (payment.links[i].rel === 'approval_url') {
                        res.redirect(payment.links[i].href);
                    }
                }
            }
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: 'Payment creation failed' });
    }
   
});

const getPaymentId = asyncHandler(async (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const items = req.body;

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": items.total
            }
        }]
    };

    // Code to execute the payment using PayPal SDK
    try {
        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
            if (error) {
                throw new Error("something went wrong");
            } else {
                res.send('Success');
            }
        });
    } catch (error) {
        throw new Error("something went wrong");
    }
});

const cancelPayment = asyncHandler(async (req, res) => {
    const cancelledOrder = await Order.findOneAndUpdate(
             { _id: orderId },
         { orderStatus: 'Cancelled' },
         { new: true }
        );
    
    res.send('cancelled');
});

module.exports = { createPayment, getPaymentId ,cancelPayment};

