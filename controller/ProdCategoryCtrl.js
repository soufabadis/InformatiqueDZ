const ProductCategory = require("../models/ProductCategoryModel");
const asyncHandler = require('express-async-handler');
const idValidator = require("../Utils/idValidator");
const logger = require('../config/logger');

/* 
   1- Create a new product category.   
   2- get a category
   3- update a category
   4 - delete categ
   5 - get all categ

*/

// 1- Create a new product category

const createCategory = asyncHandler(async (req, res) => {
    const { title } = req.body;
     console.log(title)
    try {
      if (!title) {
        res.status(400).json({ error: 'Please provide a valid name' });
        return;
      }
  
      const createdCategory = await ProductCategory.create( { title : title} );
  
      res.status(201).json(createdCategory);
    } catch (error) {
      logger.error('Error creating product category:', error);
      res.status(500).json({ error: 'Failed to create product category' });
    }
  });
  

   // 2- get a category

   const getCategory = asyncHandler(async (req, res) => {
    try {
      const { categoryId } = req.params; 
      idValidator(categoryId)
      const category = await ProductCategory.findById(categoryId);
    
      if (!category) {
        res.status(404).json({ error: 'Category not found' });
      } else {
        res.status(200).json(category);
      }
    } catch (error) {
      logger.error('Error fetching product category:', error);
      res.status(500).json({ error: 'Failed to fetch product category' });
    }
  });
  
  
   // 3- update a category


  const updateCategory = asyncHandler(async (req, res) => {
    const {categoryId} = req.params; 
    const  title  = req.body.title;
    idValidator(categoryId)

    try {
      const updatedCategory = await ProductCategory.findByIdAndUpdate(
        categoryId,
        { title : title },
        { new: true }
      );
  
      if (!updatedCategory) {
        res.status(404).json({ error: 'Category not found' });
      } else {
        res.status(200).json(updatedCategory);
      }
    } catch (error) {
      logger.error('Error updating product category:', error);
      res.status(500).json({ error: 'Failed to update product category' });
    }
  });
     // 4 - delete categ

  const deleteCategory = asyncHandler(async (req, res) => {
    const {categoryId} = req.params; 
    idValidator(categoryId)

    try {
      const deletedCategory = await ProductCategory.findByIdAndDelete(categoryId);
  
      if (!deletedCategory) {
        res.status(404).json({ error: 'Category not found' });
      } else {
        res.status(200).json({ message: 'Category deleted successfully' });
      }
    } catch (error) {
      logger.error('Error deleting product category:', error);
      res.status(500).json({ error: 'Failed to delete product category' });
    }
  });
  
  // 5 - get all categ

  const getAllCategories = asyncHandler(async (req, res) => {
    try {
      const categories = await ProductCategory.find();
            if(!categories){
                res.status(500).json({ error: 'there is no category' });

            }
      res.status(200).json(categories);
    } catch (error) {
      logger.error('Error fetching all product categories:', error);
      res.status(500).json({ error: 'Failed to fetch product categories' });
    }
  });
  

module.exports={createCategory,getCategory,updateCategory,deleteCategory,getAllCategories}