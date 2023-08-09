const Blog = require("../models/blogsModels");
const Users = require("../models/userModel");
const asyncHandler = require('express-async-handler');
const idValidator = require("../Utils/idValidator");


const createBlog = asyncHandler( async(req,res) => {
const blog=req.body ;

try {
    const newBlog = Blog.create(blog);
    res.json(newBlog);
} catch(e){
    throw new Error("Can 't create new blog") ;
}

});

module.exports=createBlog;
