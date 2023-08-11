const Blog = require("../models/blogsModels");
const Users = require("../models/userModel");
const asyncHandler = require('express-async-handler');
const idValidator = require("../Utils/idValidator");

 /* 1- create new Blog 
    2 - find a blog 
    3 - fetch All blogs
    4 - update All blogs
    5 - delete blog 
    6 - likes blog handler using single Atomic operation
    7 - dislikes blog handler using single Atomic operation

 */



 /* 1- create new blog */

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
        const findBlog = asyncHandler(async (req, res) => {
            const { blogId } = req.params;
            idValidator(blogId);
            try {
                const foundBlog = await Blog.findByIdAndUpdate(
                    blogId,
                    { $inc: { numViews: 1 } },
                    { new: true }
                )
                .populate( {path :'dislikes' ,select :'firstname lastname email'})
                .populate({path :'dislikes' ,select :'firstname lastname email'})
                if (foundBlog) {
                    res.json(foundBlog);
                } else {
                    res.json({ message: "There is no blog" });
                }
            } catch (e) {
                console.error(e);
                res.status(500).json({ message: "Something wrong!" });
            }
        });
        


        // 3 - fetch All blogs

    const getAllBlog = asyncHandler( async(req,res) => {
        try {
            const allBlogs = await Blog.find().populate( {path :'dislikes' ,select :'firstname lastname email'})
            .populate({path :'dislikes' ,select :'firstname lastname email'});
        
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
    
           // 4 - update All blogs

           const updateBlog = asyncHandler(async (req, res) => {
            const newBlogInf  = req.body;
            const { blogId } = req.params; 
            idValidator(blogId);

                  try {
                const updatedBlog = await Blog.findByIdAndUpdate(
                    { _id: blogId }, 
                    {$set : newBlogInf},
                    { new: true }
                );
        
                if (updatedBlog) {
                    res.json(updatedBlog);
                } else {
                    res.json("There is no blog with this id");
                }
            } catch (e) {
                throw new Error(e.message);
            }
        });
        
        
          // 5 - delete blog 

            const deleteBlog = asyncHandler( async(req,res) => {
                const {blogId}=req.params ;
                idValidator(blogId);

                try {
                    const deletedBlog = await Blog.findByIdAndDelete({_id : blogId});
                
                if(deletedBlog) {
                    res.json(deletedBlog)
                }  else
                {
                     
                    res.json("there is no blog")
                }
                }catch(e){
                    throw new Error("somthing went wrong !");
                    } 
                }
                );




      
     
        // -  6 - likes blog handler using single Atomic operation
        const isLike = asyncHandler(async (req, res) => {
            const { blogId } = req.params;
            const logUserId = req.user?.id;
        
            try {
                const blog = await Blog.findById(blogId);
        
                if (!blog) {
                    return res.json("Blog not found");
                }
        
                const user = await Users.findById(logUserId);
        
                if (!user) {
                    return res.json("User not found");
                }
                // initialize cycle
                const updateOperations = {};
                let alreadyLiked = false;
               
                // check if alreadyliked
                if (blog.likes && Array.isArray(blog.likes)) {
                    alreadyLiked = blog.likes.some(userId => userId.toString() === logUserId.toString());
                }

                // Remove like
        
                if (alreadyLiked) {
                    updateOperations.$pull = { likes: logUserId };
                    updateOperations.isLiked = false;
                    updateOperations.$inc = { numLikes: -1 };

                //  remove dislike if exist

                } else {
                    const alreadyDisliked = blog.dislikes && Array.isArray(blog.dislikes)
                        ? blog.dislikes.some(userId => userId.toString() === logUserId.toString())
                        : false;
        
                    if (alreadyDisliked) {
                        updateOperations.$pull = { dislikes: logUserId };
                        updateOperations.isDisliked = false;
                        updateOperations.$inc = { numDislikes: -1 };
                    }
                       // add like 

                    updateOperations.$addToSet = { likes: logUserId };
                    updateOperations.isLiked = true;
                    updateOperations.$inc = { numLikes: 1 };
                }
        
                await Blog.findByIdAndUpdate(blogId, updateOperations);
        
                return res.json({ message: alreadyLiked ? "Like removed" : "Blog liked" });
            } catch (e) {
                console.error(e);
                res.status(500).json(e.message);
            }
        });
        
      
          // -  7 - dislikes blog handler using single Atomic operation

            const isDislike = asyncHandler(async (req, res) => {
                const { blogId } = req.params;
                const logUserId = req.user?.id;
            
                try {
                    const blog = await Blog.findById(blogId);
            
                    if (!blog) {
                        return res.json("Blog not found");
                    }
            
                    const user = await Users.findById(logUserId);
            
                    if (!user) {
                        return res.json("User not found");
                    }
                       // initialize cycle
                    const updateOperations = {};
                    let alreadyDisliked = false;

                    // check if array and blog alreadydisliked
            
                    if (blog.dislikes && Array.isArray(blog.dislikes)) {
                        alreadyDisliked = blog.dislikes.some(userId => userId.toString() === logUserId.toString());
                    }
                       
                    // if already dislikeded remove dislike 

                    if (alreadyDisliked) {
                        updateOperations.$pull = { dislikes: logUserId };
                        updateOperations.isDisliked = false;
                        updateOperations.$inc = { numDislikes: -1 };
                    } else {
                        const alreadyLiked = blog.likes && Array.isArray(blog.likes)
                            ? blog.likes.some(userId => userId.toString() === logUserId.toString())
                            : false;
                    // remove like id alreadyliked 
                        if (alreadyLiked) {
                            updateOperations.$pull = { likes: logUserId };
                            updateOperations.isLiked = false;
                            updateOperations.$inc = { numLikes: -1 };
                        }

                     // add dislike    
            
                        updateOperations.$addToSet = { dislikes: logUserId };
                        updateOperations.isDisliked = true;
                        updateOperations.$inc = { numDislikes: 1 };
                    }
            
                    // Update the Blog document
                    await Blog.findByIdAndUpdate(blogId, updateOperations);
            
                    // Return the appropriate response
                    return res.json({ message: alreadyDisliked ? "Dislike removed" : "Blog disliked" });
                } catch (e) {
                    console.error(e);
                    res.status(500).json(e.message);
                }
            });
            
         

module.exports={createBlog,findBlog,getAllBlog,updateBlog,deleteBlog,isDislike,isLike};
