const asyncHandler = require("express-async-handler");
const Product = require("../models/product");
const User = require("../models/userModel");
const Cart = require('../models/cartModel'); 
const AsyncHandler = require("express-async-handler");
const idValidator = require("../Utils/idValidator");


// Controller function to add a product to the cart
        const addToCart = AsyncHandler (async(req, res) => {
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


module.exports = {
    addToCart,
    getCart,
    clearCart,
};
