const brand = require("../models/brandModel");
const asyncHandler = require('express-async-handler');
const idValidator = require("../Utils/idValidator");
const logger = require('../config/logger');

/* 
   1- Create a new product brand.   
   2- get a brand
   3- update a brand
   4 - delete brand
   5 - get all brand

*/

// 1- Create a new product brand

const createBrand = asyncHandler(async (req, res) => {
    const { title } = req.body;
     console.log(title)
    try {
      if (!title) {
        res.status(400).json({ error: 'Please provide a valid name' });
        return;
      }
  
      const createdBrand = await brand.create( { title : title} );
  
      res.status(201).json(createdBrand);
    } catch (error) {
      logger.error('Error creating product brand:', error);
      res.status(500).json({ error: 'Failed to create product brand' });
    }
  });
  

   // 2- get a brand

   const findBrand = asyncHandler(async (req, res) => {
    try {
      const { brandId } = req.params; 
      idValidator(brandId)
      const brand = await brand.findById(brandId);
    
      if (!brand) {
        res.status(404).json({ error: 'brand not found' });
      } else {
        res.status(200).json(brand);
      }
    } catch (error) {
      logger.error('Error fetching product brand:', error);
      res.status(500).json({ error: 'Failed to fetch product brand' });
    }
  });
  
  
   // 3- update a brand


  const updateBrand = asyncHandler(async (req, res) => {
    const {brandId} = req.params; 
    const  title  = req.body.title;
    idValidator(brandId)

    try {
      const updatedBrand = await brand.findByIdAndUpdate(
        brandId,
        { title : title },
        { new: true }
      );
  
      if (!updatedBrand) {
        res.status(404).json({ error: 'brand not found' });
      } else {
        res.status(200).json(updatedBrand);
      }
    } catch (error) {
      logger.error('Error updating product brand:', error);
      res.status(500).json({ error: 'Failed to update product brand' });
    }
  });
     // 4 - delete brand

  const deleteBrand = asyncHandler(async (req, res) => {
    const {brandId} = req.params; 
    idValidator(brandId)

    try {
      const deletedBrand = await brand.findByIdAndDelete(brandId);
  
      if (!deletedBrand) {
        res.status(404).json({ error: 'brand not found' });
      } else {
        res.status(200).json({ message: 'brand deleted successfully' });
      }
    } catch (error) {
      logger.error('Error deleting product brand:', error);
      res.status(500).json({ error: 'Failed to delete product brand' });
    }
  });
  
  // 5 - get all brand

  const getAllBrand = asyncHandler(async (req, res) => {
    try {
      const brands = await brand.find();
            if(!brands){
                res.status(500).json({ error: 'there is no brand' });

            }
      res.status(200).json(brands);
    } catch (error) {
      logger.error('Error fetching all product brands:', error);
      res.status(500).json({ error: 'Failed to fetch product brands' });
    }
  });
  

module.exports={createBrand,findBrand,getAllBrand,updateBrand, deleteBrand} 