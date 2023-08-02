const mongoose = require('mongoose'); 

const idValidator = (id)=> {
    checkId = mongoose.Types.ObjectId.isValideId(id);
 if(!checkId) {
   throw new Error(id +"is not valid id");
 }
};

module.exports =idValidator ;