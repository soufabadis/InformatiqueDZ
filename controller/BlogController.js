const Blog = require("../models/blogsModels");
const Users = require("../models/userModel");
const asyncHandler = require('express-async-handler');
const idValidator = require("../Utils/idValidator");
const logger = require('../config/logger');
const uploadImagesToCloud = require("../Utils/cloud");
const fs = require('fs');


 /* 1- create new Blog 
    2 - find a blog 
    3 - fetch All blogs
    4 - update All blogs
    5 - delete blog 
    6 - likes blog handler using single Atomic operation
    7 - dislikes blog handler using single Atomic operation

 */



 /* 1- create new blog */

 const createBlog = asyncHandler(async (req, res) => {
    const blog = req.body;

    try {
        logger.info('Creating a new blog:', blog);
        const newBlog = await Blog.create(blog);
        res.json(newBlog);
    } catch (e) {
        logger.error('Error creating a new blog:', e);
        res.status(500).json({ message: "Something wrong!" });
    }
});

        // 2 - find a blog 
        const findBlog = asyncHandler(async (req, res) => {
            const { blogId } = req.params;
            idValidator(blogId);
        
            try {
                logger.info('Finding a blog with ID:', blogId);
                
                const foundBlog = await Blog.findByIdAndUpdate(
                    blogId,
                    { $inc: { numViews: 1 } },
                    { new: true }
                )
                .populate({ path: 'dislikes', select: 'firstname lastname email' })
                .populate({ path: 'dislikes', select: 'firstname lastname email' });
        
                if (foundBlog) {
                    logger.info('Found a blog:', foundBlog);
                    res.json(foundBlog);
                } else {
                    logger.info('No blog found with ID:', blogId);
                    res.json({ message: "There is no blog" });
                }
            } catch (e) {
                logger.error('Error finding a blog:', e);
                res.status(500).json({ message: "Something wrong!" });
            }
        });

        // 3 - fetch All blogs

   
const getAllBlog = asyncHandler(async (req, res) => {
    try {
        logger.info('Fetching all blogs');
        
        const allBlogs = await Blog.find()
            .populate({ path: 'dislikes', select: 'firstname lastname email' })
            .populate({ path: 'dislikes', select: 'firstname lastname email' });

        if (allBlogs && allBlogs.length > 0) {
            logger.info('Fetched all blogs:', allBlogs);
            res.json(allBlogs);
        } else {
            logger.info('No blogs found');
            res.json("There are no blogs");
        }
    } catch (e) {
        logger.error('Error fetching all blogs:', e);
        res.status(500).json({ message: "Something went wrong!" });
    }
});


// 4 - update All blogs

const updateBlog = asyncHandler(async (req, res) => {
    const newBlogInf = req.body;
    const { blogId } = req.params;
    idValidator(blogId);

    try {
        logger.info(`Updating blog with ID ${blogId}:`, newBlogInf);
        
        const updatedBlog = await Blog.findByIdAndUpdate(
            { _id: blogId },
            { $set: newBlogInf },
            { new: true }
        );

        if (updatedBlog) {
            logger.info('Updated blog:', updatedBlog);
            res.json(updatedBlog);
        } else {
            logger.info(`No blog found with ID ${blogId}`);
            res.json("There is no blog with this id");
        }
    } catch (e) {
        logger.error('Error updating blog:', e);
        res.status(500).json({ message: "Something went wrong!" });
    }
});




        
          // 5 - delete blog 
          const deleteBlog = asyncHandler(async (req, res) => {
            const { blogId } = req.params;
            idValidator(blogId);
        
            try {
                logger.info(`Deleting blog with ID ${blogId}`);
                
                const deletedBlog = await Blog.findByIdAndDelete({ _id: blogId });
        
                if (deletedBlog) {
                    logger.info('Deleted blog:', deletedBlog);
                    res.json(deletedBlog);
                } else {
                    logger.info(`No blog found with ID ${blogId}`);
                    res.json("There is no blog");
                }
            } catch (e) {
                logger.error('Error deleting blog:', e);
                res.status(500).json({ message: "Something went wrong!" });
            }
        });



      
     
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
            

            
            const uploadBlogsImage = asyncHandler(async (req, res) => {
                const {id} = req.params;
                const url = [];
                idValidator(id); 
              
                try {
                  const uploader = await uploadImagesToCloud(req.files);
                  // Push all the URLs of the uploaded images to the 'url' array
                  for (const uploadedFile of uploader) {
                    url.push(uploadedFile.url);
                  }

                  // Delete the locally uploaded files
                    for (const uploadedFile of req.files) {
                        fs.unlinkSync(uploadedFile.path);
                    }

                 
                  const blog = await Blog.findByIdAndUpdate(
                    id ,
                    { images: url },
                    { new: true }
                  );
              
                  res.status(200).json({
                    message: "Image(s) uploaded successfully.",
                    uploadedImages: url,
                  });
                } catch (error) {
                   throw new Error("failed to upload "+error) ;
                }
              });
              

module.exports={createBlog,findBlog,getAllBlog,updateBlog,deleteBlog,isDislike,isLike,uploadBlogsImage};
