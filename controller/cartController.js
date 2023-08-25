const asyncHandler = require("express-async-handler");
const Product = require("../models/product");
const Order = require("../models/OrderModel");
const User = require("../models/userModel");
const Cart = require('../models/cartModel'); 
const idValidator = require("../Utils/idValidator");
const Coupon = require('../models/couponModel');
var uniqid = require('uniqid');


   /*
    1 - Controller function to add a product to the cart
    2 - Controller function to get the cart contents
    3 - delete cart 
    4 - Apply coupon 
    5 - Create order
    6 - Fetch the order details from the database based on the order ID
    7 - update order status

   */


    
//  1 - Controller function to add a product to the cart
        const addToCart = asyncHandler (async(req, res) => {
            try {
                const cartData = req.body.cart;
                idValidator(req.user._id)
                // Validate cart data
                if (!Array.isArray(cartData) || cartData.length === 0) {
                    return res.status(400).json({ error: 'Invalid cart data' });
                }
        
                const productsToAdd = [];
                let totalPrice = 0; 

        
                for (const item of cartData) {
                    const { product, color, count } = item;
                    const productObj = await Product.findById(product);
        
                    if (!productObj) {
                        return res.status(404).json({ error: `Product with ID ${product} not found` });
                    }
                    const itemPrice = productObj.price * count;
                    totalPrice += itemPrice; // Add item price to total price

                    productsToAdd.push({
                        ...item, 
                        price: productObj.price, 
                    });

                   
                }

                
        
                // Check if a cart already exists for the user
                let cart = await Cart.findOne({ orderBy: req.user._id });
        
                if (cart) {
                    // If a cart already exists, remove it
                    await Cart.deleteOne({ orderBy: req.user._id });

                }
        
                // Create a new cart
                cart = new Cart({
                    products: [...productsToAdd], 
                    orderBy: req.user._id,
                    total : totalPrice 
                });
        
                await cart.save();
        
                res.json({ message: 'Products added to cart', cart });
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
// 2 - Controller function to get the cart contents
   const getCart = asyncHandler (async(req, res) =>{
    try {
        const cart = await Cart.findOne({ orderBy: req.user._id })
            .populate('products.product', 'name')
            .exec();

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
} )

// 3 - delete cart 

 const clearCart = asyncHandler  (async (req, res) => {
    try {
        // Remove the existing cart for the user
        await Cart.deleteOne({ orderBy: req.user._id });

        res.json({ message: 'Cart cleared successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
 ) ;

 // 4 - Apply coupon 


 const applyCoupon = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const couponCode = req.body.code;
    idValidator(userId); 
  
    if (!couponCode) {
      throw new Error('No code provided');
    }
  
    const isCoupon = await Coupon.findOne({ code: couponCode });
    if (!isCoupon) {
      throw new Error('Invalid coupon code');
    }
  
    const isUser = await User.findById(userId); 

    const cart = await Cart.findOne({ orderBy: userId }).populate('products.product');
  
        let { products, total } = cart; 
  
    let totalAfterDiscount = (total - total * (isCoupon.discount * 0.01)).toFixed(2);
  
    // Updated the update operation to set 'totalAfterDiscount' for the cart
    const updatedCart = await Cart.findOneAndUpdate(
      { orderBy: userId },
      { $set: { totalAfterDiscount: totalAfterDiscount } },
      { new: true }
    );
  
    res.status(200).json({ message: 'Coupon applied successfully', cart: updatedCart });
  });
  
   // 5 - Create order

  const createOrder = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    idValidator(userId); 

    const cart = await Cart.findOne({ orderBy: userId }).populate('products.product');
  
    if (!cart) {
      throw new Error('Cart not found');
    }
    const isCouponApplied = (cart.totalAfterDiscount === 0)
    ? false
    : (cart.totalAfterDiscount < cart.total);
  

    // Calculate the order's total based on whether a coupon was applied
    const orderTotal = isCouponApplied ? cart.totalAfterDiscount : cart.total;

  
    // Create a new order based on cart data
    const order = new Order({
      orderBy: userId,
      orderStatus : "Cash on delivery" ,
      products: cart.products.map(item => ({
        product: item.product._id,
        color: item.color,
        count: item.count,
      })),
      total: orderTotal, 
      isCouponApplied: isCouponApplied,
      paymentIntent : {
        id : uniqid() ,
        methode : "COD",
        amount : orderTotal ,
        status : "Cash on delivery " ,
        created: new Date().toISOString(),
        currency : "USD"
      }
    });


// Update sold count and subtract count for each product in the cart

  for (const cartItem of cart.products) {
    const product = await Product.findById(cartItem.product._id);
    if (product) {
      // Update sold count
      product.sold += cartItem.count;
      
      // Subtract count
      product.quantity -= cartItem.count;

      // Save the product changes
      await product.save();
    }
  }

    // Save the order to the database
    const savedOrder = await order.save();
  
    // Clear the user's cart after creating the order
    await Cart.findOneAndDelete({ orderBy: userId });
  
    res.status(201).json({
      message: 'Order created successfully',
      order: savedOrder,
      isCouponApplied: isCouponApplied,
    });
  });
  

 // 6 - Fetch the order details from the database based on the order ID

 const getOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id; 

const order = await Order.findOne({ orderBy: userId })
  .populate({
    path: 'products.product',
    model: 'Product', 
  })
  .populate('orderBy', 'firstname lastname email')
  .exec();

if (!order) {
  return res.status(404).json({ message: 'Order not found' });
}

res.status(200).json({ order });

});
 
// 7 - Update order

const updateOrderStatus = asyncHandler(async (req, res) => {
  const orderId = req.params.orderId; 
  const newStatus = req.body.status; 

  // Fetch the order from the database based on the order ID
  const order = await Order.findById(orderId).populate({
    path: 'products.product',
    model: 'Product', 
  })
  .populate('orderBy', 'firstname lastname email')
  .exec();;

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  // Update the order status
  order.orderStatus = newStatus;
  order.paymentIntent.status = newStatus ;
  await order.save();

  res.status(200).json({ message: 'Order status updated successfully', order });
});



module.exports = {
    addToCart,
    getCart,
    clearCart,
    applyCoupon ,
    createOrder ,
    getOrder ,
    updateOrderStatus
};
