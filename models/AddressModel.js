const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model

var addressSchema = new mongoose.Schema({
    street: {type : String , required : true},
    city: {type : String , required : true},
    state: {type : String , required : true},
    postalcode: {type : String },
    user : { type : mongoose.Types.ObjectId , ref : 'User' }
  });
  

//Export the model
module.exports = mongoose.model('Address', addressSchema);