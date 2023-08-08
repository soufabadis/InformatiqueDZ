const mongoose = require('mongoose'); 

const idValidator = (id)=> {
    checkId = mongoose.Types.ObjectId.isValid(id);
 if(!checkId) {
   throw new Error(id +"is not valid id");
 }
};

module.exports =idValidator ;