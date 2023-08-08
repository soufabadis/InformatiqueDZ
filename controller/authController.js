const Users = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const tokenGenerator = require("../config/webToken");
const refreshTokenGenerator = require("../config/refreshToken")
const jwt = require("jsonwebtoken");
const fs = require('fs');
const idValidator = require("../Utils/idValidator");
const dotenv = require('dotenv');
dotenv.config(); 

// private key 
const privateKeyPath = process.env.PRIVATE_KEY_PATH;
const privateKey = fs.readFileSync(privateKeyPath, 'utf-8');

/*
   1-create new user
   2-login controller
   3-Refreshtoken handler 
   4-get all users
   5-Route handler to find a user by ID
   6- delete user
   7-update user information
   8- block User
   9- Unblock User


*/ 

// 1-create new user
const createUser = asyncHandler(async (req, res) => {
  const useremail = req.body.email;
  // Search for existing user
  const isUser = await Users.findOne({ email: useremail });
  if (!isUser) {
    // Create new user
    const newUser = await Users.create(req.body);
    res.json(newUser);
  } else {
    throw new Error("User Already Exists");
  }
});

//2- login controller

const loginCotroller = asyncHandler(async (req, res) => {
  const userEmail = req.body.email;
  const password = req.body.password;
  const isUser = await Users?.findOne({ email: userEmail });
  if (isUser) {
    const passwordMatch = await isUser.isPassword(password);
    if (passwordMatch) {
      const isUser = await Users?.findOne({ email: userEmail });
      const refreshToken = await refreshTokenGenerator(isUser._id);
      
           // update token value in db
      await Users.findOneAndUpdate(
        { _id: isUser._id },
        {
          $set: {
            refreshtoken: refreshToken
          },
        },
        {
          new: true, 
        }
      );

     // Calculate the max age in milliseconds (e.g., 4days)
          const maxAgeInMilliseconds = 4 * 24 * 60 * 60 * 1000;

          res.cookie(
            "refreshToken",refreshToken,
            {
           httpOnly:true ,
           maxAge : maxAgeInMilliseconds ,
            }
          )
      res.json({
        firstname: isUser?.firstname,
        lastname: isUser?.lastname,
      
        email: isUser?.email,
        mobile: isUser?.firstname,
        role: isUser?.role,
        // pass id and email to token generator
        token: tokenGenerator(isUser?.id, isUser?.email),
    } )}
    else {
      throw new Error("Invalid Credentials");
    }
  } else {
    throw new Error("User not found");
  }
});

// 3- Refreshtoken handler 

const refreshTokenHandler = asyncHandler(async (req, res) => {
  const cookies = req.cookies;

  if (!cookies || !cookies.refreshToken) {
    throw new Error("There is no token in cookies");
  } else {
    const refreshToken = cookies.refreshToken;
    const user = await Users.findOne({ refreshtoken:refreshToken });

    if (!user) {
      throw new Error("There is no user in the database with this token");
    } else {
      try {
        const decoded = await jwt.verify(refreshToken, privateKey);
        if (user._id.toString() !== decoded._id) {
          throw new Error("Invalid token or user mismatch");
        }
        const accessToken = tokenGenerator(user._id, user.email);
        res.json({ accessToken });
      } catch (error) {
        throw new Error("Failed to verify refreshToken: " + error.message);
      }
    }
  }
});


//3-1 logout 
const logout = asyncHandler(async (req, res) => {
  const cookies = req.cookies;

  if (!cookies || !cookies.refreshToken) {
    throw new Error("There is no token in cookies");
  } else {
    const refreshToken = cookies.refreshToken;
    const user = await Users.findOne({ refreshtoken: refreshToken });

    if (user) {
      // Clear refreshToken cookie with HTTPOnly and Secure flags
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
      });
      await Users.findOneAndUpdate(
        { refreshtoken: refreshToken },
        { $set: { refreshtoken: '' } },
        { new: true }
      );
    }

    // Clear refreshToken cookie with HTTPOnly and Secure flags (again, in case user not found)
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
    });
    res.sendStatus(204); // No Content
  }
});


// 4- get all users
const getAllUsers = asyncHandler(async (req, res) => {
  const allUsers = await Users.find();
  if (allUsers) {
    const usersWithoutPassword = allUsers.map((user) => {
      const { password, ...userWithoutPassword } = user.toObject();
      return userWithoutPassword;
    });
    res.json(usersWithoutPassword);
  } else {
    throw new Error("There is no Users");
  }
});

//5- Route handler to find a user by ID
const findUserById = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const user = await Users.findOne({ _id: userId });

    if (user) {
      const userWithoutPassword = { ...user.toObject() };
      delete userWithoutPassword.password;
      res.json(user);
      next();
    } else {
      res.json({ message: `User with ID "${userId}" not found.` });
    }
  } catch (err) {
    console.error("Error finding user:", err);
    res.json({ message: "Something went wrong." });
  }
});

// 6- delete user

const deleteUserById = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  try {
    const deleteUser = await Users?.findByIdAndDelete({ _id: userId });

    if (deleteUser) {
      res.json("user deleted seccessfully");
    } else {
      res.json({ message: `User with ID "${userId}" not found.` });
    }
  } catch (err) {
    res.json({ message: "Something went wrong." });
  }
});

// 7-update user information
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
    res.json({ message: "Something went wrong." });
  }
});

// 8 -Block user

const blockUser = asyncHandler(async (req, res) => {
  const id = req.user._id;
  const blockUser = await Users.findOneAndUpdate(
    { _id: id },
    { $set: { block: true } },
    { new: true }
  );
  if (blockUser) {
    res.json("User blocked Successfully: ");
  } else {
    throw new Error("Something went wrong.");
  }
});
// 9- Unblock User

const unBlockUser = asyncHandler(async (req, res) => {
  const id = req.user._id;
  const blockUser = await Users.findOneAndUpdate(
    { _id: id },
    { $set: { block: false } },
    { new: true }
  );
  if (blockUser) {
    res.json("User unblocked Successfully: ");
  } else {
    throw new Error("Something went wrong.");
  }
});

// 10 - update password 

const updatePassword = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const newPassword = req.body.password;
  var  user = await Users.findById({_id : userId});
      
  idValidator(userId);

  try {
    if (newPassword) {
      // Find the user by ID
          
      // Update the password in the user object
      user.password = newPassword;
           
      // Use `markModified` to trigger the pre-save middleware for the `password` field
      user.markModified('password');

      // Save the user object with the updated password
       var updatedPassword = await user.save();


      res.json(updatedPassword);
    } else {
      res.status(400).json(user);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

  

module.exports = {
  createUser,
  loginCotroller,
  refreshTokenHandler,
  logout,
  getAllUsers,
  findUserById,
  deleteUserById,
  updateUserById,
  blockUser,
  unBlockUser,
  updatePassword,
};
