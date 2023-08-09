const mongoose = require('mongoose'); 

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        
    },
    description:{
        type:String,
        required:true,
       
    },
    category:{
        type:String,
        required:true,
       
    },
    numViews:{
        type:String,
        default:0,
    },
    isLiked:{
        type:Boolean,
        default:false,
    },
    isDisliked:{
        type:Boolean,
        default:false,
    },
    likes : {
        type : mongoose.Types.ObjectId ,
        ref :'Users' ,
    },
    dislikes : {
        type : mongoose.Types.ObjectId ,
        ref: 'Users'  
    }
    ,
    images : {
        type : String ,
        default : "" ,
    } , 
    author : {
        type : String ,
        default : "" ,
        required :true  ,
    } 

}, {
    toJSON  : {
        virtual : true
    } ,
    toObject : {
        virtual : true ,
    } ,
    timestamps : true  ,
}
);

//Export the model
module.exports = mongoose.model('Blog', userSchema);