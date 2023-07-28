const mongoose = require('mongoose'); 
const bcrypt = require('bcrypt');
const asyncHandler = require("express-async-handler");


var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
       
    },
    lastname:{
        type:String,
        required:true,
    
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
});

//hash password
userSchema.pre("save",async function(next){

    try {
        const salt =  await bcrypt.genSaltSync(10);
        this.password =  await bcrypt.hashSync(this.password, salt);      } 
        catch (err) {
        throw new Error(err);
      }
})
userSchema.methods.isPassword = async function(ispassword) {
    try {
      return await bcrypt.compare(ispassword, this.password);
    } catch (err) {
      throw new Error(err);
    }
  };
//Export the model
module.exports = mongoose.model('User', userSchema);