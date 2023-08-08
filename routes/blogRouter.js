const express = require('express');
const createBlog = require('../controller/BlogController');
const {authMiddleware,isAdmin} = require('../middlewares/authMiddlewares');


const router=express.Router();

router.post("/create-new-blog",authMiddleware,isAdmin,createBlog);

module.exports=router;
