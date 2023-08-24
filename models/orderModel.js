const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    products: [ {
        
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            color: String,
            count: Number,

        
}],
    paymentIntent: {},
    total: Number,
    orderStatus: {
        type: String,
        default : "Not Processed",
        enum :  ["Not Processed","Cash on delivery","Processed","Dispatched","Delivered","Cancelled"]
    },
    orderBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    
    isCouponApplied : Boolean  ,
    
},
{
    timestamps : true
});

//Export the model
module.exports = mongoose.model('Order', userSchema);
