const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    products: [ {
        
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            price: Number,
            color: String,
            count: Number,
        
}],
    total: Number,
    totalAfterDiscount: {type : Number , default : 0},
    orderBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

//Export the model
module.exports = mongoose.model('Cart', userSchema);
