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
          token : tokenGenerator(searchUser?.id)
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
const findUserById = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await Users.findOne({_id:userId});

    if (user) {
      const userWithoutPassword = { ...user.toObject() };
      delete userWithoutPassword.password;
      res.json(user);
    } else {
      res.json({ message: `User with ID "${userId}" not found.` });
    }
  } catch (err) {
    console.error('Error finding user:', err);
    res.json({ message: 'Something went wrong.' });
  }
});





module.exports = { createUser, loginCotroller,getAllUsers,findUserById};
