const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true

  },
  comment: {
    type: String,
    required: true
  } ,
  status : {
    type: String,
    default : "Submitted",
    enum : ["Submitted","Contacted","In Progress"]
  }
}, {
  timestamps: true 
});

const Inquiry = mongoose.model('Inquiry', inquirySchema);

module.exports = Inquiry;
