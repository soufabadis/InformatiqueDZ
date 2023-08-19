const express = require('express');
const {createBlog,findBlog,getAllBlog,updateBlog, deleteBlog, isDislike, isLike, uploadBlogsImage} = require('../controller/BlogController');
const {authMiddleware,isAdmin} = require('../middlewares/authMiddlewares');
const { uploadImages } = require('../middlewares/multer');
const { resizeImage } = require('../middlewares/sharp');


const router=express.Router();

router.post("/create-new-blog",authMiddleware,isAdmin,createBlog);
router.get("/",getAllBlog);
router.get("/find-blog/:blogId",findBlog);
router.put("/update-blog/:blogId",authMiddleware,isAdmin,updateBlog);
router.delete("/delete-blog/:blogId",authMiddleware,isAdmin,deleteBlog);
router.put("/dislike-blog/:blogId",authMiddleware,isDislike);
router.put("/like-blog/:blogId",authMiddleware,isLike);
router.put('/upload-image/:id', authMiddleware, isAdmin, uploadImages.array('images', 2), resizeImage('blogs'), uploadBlogsImage);


module.exports=router;