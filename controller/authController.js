const Users = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const tokenGenerator = require('../config/webToken');


// create new user
const createUser = asyncHandler(async (req, res) => {
  const useremail = req.body.email;
  // Search for existing user
  const searchUser = await Users.findOne({ email: useremail });
  if (!searchUser) {
    // Create new user
    const newUser = await Users.create(req.body);
    res.json(newUser);
  } else {
    throw new Error("User Already Exists");
  }
});

//login controller

const loginCotroller = asyncHandler(async (req, res) => {
  const userEmail = req.body.email;
  const password = req.body.password;
  const searchUser = await Users.findOne( {email:userEmail} );
  console.log(userEmail)
  if (searchUser) {
    const passwordMatch = await searchUser.isPassword(password);
    if (passwordMatch) {
  const searchUser = await Users.findOne({ email: userEmail });
  
      res.json(
        {
          firstname : searchUser?.firstname,
          lastname : searchUser?.lastname,
          email : searchUser?.email,
          mobile : searchUser?.firstname,
          role : searchUser?.role,
          // pass id and email to token generator
          token : tokenGenerator(searchUser?.id,searchUser?.email)
        }

      );
    } else {
      throw new Error("Invalid Credentials");
    }
  } else {
    throw new Error("User not found");
  }
});

// get all users 
const getAllUsers = asyncHandler(async (req, res) => {

  const allUsers = await Users.find();
  if (allUsers) {
    
    const usersWithoutPassword = allUsers.map(user => {
      const { password, ...userWithoutPassword } = user.toObject();
      return userWithoutPassword;
    });
    res.json(usersWithoutPassword)
} else {
    throw new Error("There is no Users");
  }
});

// Route handler to find a user by ID
const findUserById = asyncHandler(async (req, res,next) => {
  const userId = req.params.userId;
  try {
    const user = await Users.findOne({_id:userId});

    if (user) {
      const userWithoutPassword = { ...user.toObject() };
      delete userWithoutPassword.password;
      res.json(user);
      next();
    } else {
      res.json({ message: `User with ID "${userId}" not found.` });
    }
  } catch (err) {
    console.error('Error finding user:', err);
    res.json({ message: 'Something went wrong.' });
  }
});

//delete user 

const deleteUserById = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  try {
    const deleteUser = await Users?.findByIdAndDelete({_id:userId});

    if (deleteUser) {
         res.json("user deleted seccessfully");
          } else {
      res.json({ message: `User with ID "${userId}" not found.` });
    }
  } catch (err) {
    res.json({ message: 'Something went wrong.' });
  }
});

//update user information 
const updateUserById = asyncHandler(async (req, res) => {
   const id = req.user._id;
  try {
    const updatedUser = await Users.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          lastname: req.body?.lastname,
          email: req.body?.email,
          firstname: req.body?.firstname,
          mobile: req.body?.mobile,
        },
      },
      {
        new: true,
      }
    );

    if (updatedUser) {
      res.json("User Updated Successfully: " + updatedUser);
    } else {
      res.json({ message: `User with ID "${userId}" not found.` });
    }
  } catch (err) {
    res.json({ message: 'Something went wrong.' });
  }
});

// Block user

const blockUser = asyncHandler( async(req,res)=>{
  const id = req.user._id;
  const blockUser = await Users.findOneAndUpdate({ _id: id},{$set :{ block :true}},{ new : true})
  if(blockUser){
    res.json("User blocked Successfully: " );
  }
  else {
    throw new Error('Something went wrong.')
  }

})
//Unblock User

const unBlockUser = asyncHandler( async(req,res)=>{
  const id = req.user._id;
  const blockUser = await Users.findOneAndUpdate({ _id: id},{$set :{ block :false}},{ new : true})
  if(blockUser){
    res.json("User unblocked Successfully: " );
  }
  else {
    throw new Error('Something went wrong.')
  }
})

module.exports = { createUser, loginCotroller,getAllUsers,findUserById,
  deleteUserById,updateUserById,blockUser,unBlockUser};
