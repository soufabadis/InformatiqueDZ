const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');



// Array of possible phone brands
const phoneBrands = [
  'Apple',
  'Samsung',
  'Xiaomi',
  'Huawei',
  'Oppo',
  'Vivo',
  'OnePlus',
  'Google (Pixel)',
  'Sony',
  'LG',
  'Motorola',
  'Nokia',
  'HTC',
  'Lenovo (Motorola)',
  'Asus',
  'Blackberry',
  'Alcatel',
  'ZTE',
  'Realme',
  'Meizu',
];

// Define the product schema
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      
    },
    image: [] ,
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    sold :{
      type : Number,
      default :0 ,
    },
    brand: {
      type: String,
      enum: phoneBrands, 
    },
    color: [],
    tags : [],
    rating: [  {
      postedby: {
       type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    star : {
      type: Number,
    }},],

     totalRating : {
         type : Number ,
         default : 0
     },
     averageRating : {
      type : Number ,
      default : 0
     },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Apply the slug plugin to the schema
productSchema.plugin(slug);

// Create the Product model based on the schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
