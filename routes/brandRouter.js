const express = require('express');
const {createBrand,findBrand,getAllBrand,updateBrand, deleteBrand} = require('../controller/brandController');
const {authMiddleware,isAdmin} = require('../middlewares/authMiddlewares');


const router=express.Router();

router.post("/create-new-brand",authMiddleware,isAdmin,createBrand);
router.get("/getallbrand",getAllBrand);
router.get("/find-brand/:brandId",findBrand);
router.put("/update-brand/:brandId",authMiddleware,isAdmin,updateBrand);
router.delete("/delete-brand/:brandId",authMiddleware,isAdmin,deleteBrand);


module.exports=router;