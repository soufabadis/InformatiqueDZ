const mongoose = require('mongoose'); 
const bcrypt = require('bcrypt');
const crypto = require("crypto")


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
    refreshtoken : {
        type : String,
        default : "",
    },
    password:{
        type:String,
        required:true,
    },
    role : {
        type :String,
        default : "user"
    },
    block : {
        type : Boolean ,
        default : false,
    },
    carte : {
        type : Array ,
        default : []
    },
    
    address : {
        type :mongoose.Schema.Types.ObjectId ,
        ref : 'Address'  
    },
    wishlist : [{
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'Product'
    }], 
    passwordChangeDate : {
        type :Date ,
     } ,
     passwordResetToken : {
        type : String ,   
     } ,
     passwordResetExpire : {
         type : Date
     } ,
    
} ,
    

{
    timestamps : true ,
});

//hash password
userSchema.pre("save",async function(next){
      if (!this.isModified("password")) {
        next()
      }
    try {
        const salt =  await bcrypt.genSaltSync(10);
        this.password =  await bcrypt.hashSync(this.password, salt);      } 
        catch (err) {
        throw new Error(err);
      }
})

//compare password
userSchema.methods.isPassword = async function(ispassword) {

    try {
       
      return await bcrypt.compare(ispassword, this.password);
    } catch (err) {
      throw new Error(err);
    }
  };


  userSchema.methods.resetPasswordToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex'); // Generate a random token
    const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex'); // Hash the token
  
    this.passwordResetToken = hashedResetToken;
    this.passwordResetExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  s
    return resetToken; // Return the original token, not hashed
  };
  
//Export the model
module.exports = mongoose.model('User', userSchema);