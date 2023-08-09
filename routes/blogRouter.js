const express = require('express');
const {createBlog,findBlog,getAllBlog,updateBlog, deleteBlog} = require('../controller/BlogController');
const {authMiddleware,isAdmin} = require('../middlewares/authMiddlewares');


const router=express.Router();

router.post("/create-new-blog",authMiddleware,isAdmin,createBlog);
router.get("/",getAllBlog);
router.get("/find-blog",findBlog);
router.put("/update-blog",authMiddleware,isAdmin,updateBlog);
router.delete("/delete-blog",authMiddleware,isAdmin,deleteBlog);

module.exports=router;
