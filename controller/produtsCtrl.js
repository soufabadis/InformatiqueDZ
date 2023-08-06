const asyncHandler = require("express-async-handler");
const Product = require("../models/product");
const slugify = require("slugify");

/*
 1-create new product ctrl 
 2-get product by ID 
 3- get all products
 4- update product
 5-title
*/


// 1-create new product ctrl 
const createProduct = asyncHandler(async(req,res)=>  {
    let product =req.body;
       if(product) {
        const newProduct = await Product.create(product);
        res.json('new product' +newProduct);
        }
        else {
            throw new Error(error.message);
        }
});

// 2-get product by ID 

const getaProduct = asyncHandler(async (req, res) => {
    const {productId} = req.params; 
    const findProduct = await Product.findById(productId);
    if (!findProduct) {
      throw new Error("There is no product with this id: " + productId);
    }
    res.json(findProduct);
  });

//3- get all products

const getAllProducts = asyncHandler(async (req, res) => {
  const excludeField = ["page", "sort", "fields", "limit"];
  const objQuery = { ...req.query };

  //delete exclude field from obQuery before execute

  excludeField.forEach((field) => {
    delete objQuery[field];
  });

  // fliltre product price
  const queryString = JSON.stringify(objQuery);
  const newqueryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  const objQuery2 = JSON.parse(newqueryString);

  let allProductsQuery = Product.find(objQuery2);

  // 3-2 Sort products.
  if (req.query.sort) {
    const sortedBy = req.query.sort.split(',').join(' ');
    allProductsQuery = allProductsQuery.sort(sortedBy);
  } else {
    allProductsQuery = allProductsQuery.sort('createdAt');
  }

  // 3-3 limite the fields 

  if (req.query.fields) {
    const limitedBy = req.query.fields.split(',').join(' ');
    allProductsQuery = allProductsQuery.select(limitedBy);
    console.log(limitedBy);
  } else {
    allProductsQuery = allProductsQuery.select('-__v');
  }

  // 3-4 Pagination 
  let page = req.query.page;
  const limit = req.query.limit || 3; // Default limit is 3

  if (!page || page < 1) {
    page = 1;
  }

  const skipCount = (page - 1) * limit;
//  Count the total documents without processing the data
  if(req.query.page){
    const countProduct = await Product.countDocuments();
    if(skipCount >= countProduct )
    throw new Error('this page not exist');
  }


 allProductsQuery =  allProductsQuery.skip(skipCount).limit(limit);

  try {

    // execute all previous proccess
    const allProducts = await allProductsQuery.exec();

    if (!allProducts.length) {
      throw new Error("There are no products");
    }

    res.json(allProducts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});


// 4- update product

const updateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (req.body.title) {
    req.body.slug = slugify(req.body.title); 
  }

  if (!productId) {
    throw new Error("Something went wrong");
  } else {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId }, 
      { $set: req.body },
      { new: true }
    );
    res.json(updatedProduct);
  }
});

// delete product by id 

const deletedProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  try {
    if (!productId) {
      throw new Error("Something went wrong");
    } else {
      const product = await Product.findByIdAndDelete(productId);

      if (!product) {
        return res.json({ message: 'Product not found' });
      }

      res.json({ message: 'Product deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports={createProduct,getaProduct, getAllProducts,updateProduct,deletedProduct};