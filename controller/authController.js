const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const createUser = asyncHandler(async (req, res) => {
  const useremail = req.body.email;
  // Search for existing user
  const searchUser = await User.findOne({ email: useremail });
  if (!searchUser) {
    // Create new user
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    throw new Error("User Already Exists");
  }
});

const loginCotroller = asyncHandler(async (req, res) => {
  const Useremail = req.body.email;
  const password = req.body.password;
  const searchUser = await User.findOne({ email: Useremail });
  if (searchUser) {
    const passwordMatch = await searchUser.isPassword(password);
    if (passwordMatch) {
      res.json(Useremail,password);
      console.log('User exists');
    } else {
      throw new Error("Invalid Credentials");
    }
  } else {
    throw new Error("User not found");
  }
});

module.exports = { createUser, loginCotroller };