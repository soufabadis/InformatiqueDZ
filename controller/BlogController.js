const Blog = require("../models/blogsModels");
const Users = require("../models/userModel");
const asyncHandler = require('express-async-handler');
const idValidator = require("../Utils/idValidator");

 /* 1- create new Blog */



 /* 2- create new blog */
const createBlog = asyncHandler( async(req,res) => {
const blog=req.body ;

try {
    const newBlog = Blog.create(blog);
    res.json(newBlog);
} catch(e){
    throw new Error("Can 't create new blog") ;
}

});


// 2 - find a blog 

const findBlog = asyncHandler( async(req,res) => {
    const blogId=req.params ;
    try {
        const isBlog = await blog.findByIdAndUpdate({_id : blogId} , {$set : {  sinc:{numViews : 1} }} ,{new :true});
    
    if(isBlog) {
        res.json(isBlog)
    }  else
    {
         
    }
    res.json("there is no blog")
    }catch(e){
        throw new Error("somthing went wrong !");
        } 
    }
    );

    // 3 - fetch All blogs

    const getAllBlog = asyncHandler( async(req,res) => {
        try {
            const allBlogs = await blog.find();
        
        if(allBlogs) {
            res.json(allBlogs) ;
        }  else
        {
             
        }
        res.json("there is no blog")
        }catch(e){
            throw new Error("somthing went wrong !");
            } 
        }
        );
    
    
        const updateBlog = asyncHandler( async(req,res) => {
            const newBlogInf = req.body ;
            const blogId=req.body._id ;

            try {
                const updatedBlog = await blog.findByIdAndUpdate({ _id : blogId},{ $set : newBlogInf},{new :true});
            
            if(updatedBlog) {
                res.json(updatedBlog) ;
            }  else
            {
                 
            }
            res.json("there is no blog with this id")
            }catch(e){
                throw new Error("somthing went wrong !");
                } 
            }
            );
        
        
        
            const deleteBlog = asyncHandler( async(req,res) => {
                const blogId=req.params ;
                try {
                    const deletedBlog = await blog.findByIdAndDelete({_id : blogId});
                
                if(deletedBlog) {
                    res.json(deletedBlog)
                }  else
                {
                     
                }
                res.json("there is no blog")
                }catch(e){
                    throw new Error("somthing went wrong !");
                    } 
                }
                );



    
module.exports={createBlog,findBlog,getAllBlog,updateBlog,deleteBlog};
