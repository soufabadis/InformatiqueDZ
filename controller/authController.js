const Users = require("../models/userModel");
const Product = require("../models/product");
const Address = require("../models/AddressModel");
const asyncHandler = require("express-async-handler");
const tokenGenerator = require("../config/webToken");
const refreshTokenGenerator = require("../config/refreshToken")
const jwt = require("jsonwebtoken");
const fs = require('fs');
const idValidator = require("../Utils/idValidator");
const mailler =require("../controller/emailController");
const crypto = require("crypto")
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
  const isAdmin = await Users.findOne({ email: useremail });
  if (!isAdmin) {
    // Create new user
    const newUser = await Users.create(req.body);
    res.json(newUser);
  } else {
    throw new Error("User Already Exists");
  }
});

//2- login controller

const loginCotroller = asyncHandler(async (req, res) => {
  const AdminEmail = req.body.email;
  const password = req.body.password;
  const isAdmin = await Users?.findOne({ email: AdminEmail });
  if (isAdmin) {
    const passwordMatch = await isAdmin.isPassword(password);
    if (passwordMatch) {
      const isAdmin = await Users?.findOne({ email: AdminEmail });
      const refreshToken = await refreshTokenGenerator(isAdmin._id);
      
           // update token value in db
      await Users.findOneAndUpdate(
        { _id: isAdmin._id },
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
        firstname: isAdmin?.firstname,
        lastname: isAdmin?.lastname,
      
        email: isAdmin?.email,
        mobile: isAdmin?.firstname,
        role: isAdmin?.role,
        // pass id and email to token generator
        token: tokenGenerator(isAdmin?.id, isAdmin?.email),
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
    const user = await Users.findOne({ _id: userId }).populate({path : "wishlist" , select : "title quntity price  "});

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

 // 11 send email with nodemailer and generate updatepasswordToken 
const updatePasswordToken = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const user = await Users.findOne({ email: email });

  if (!user) {
    throw new Error("There is no user with this email");
  }

  try {
    const token = await user.resetPasswordToken (); 
    await user.save();

    const url = "Hi, follow this link to reset your password: " + `<a href="http://localhost:5000/api/users/reset-password/${token}">click here</a>`;

    mailler({
      html: url,
      to: email,
      text: "Hello user",
      subject: "Reset password link"
    });

    res.json({ message: "Reset password link sent successfully "  +token });

  } catch (error) {s
    throw new Error("Can't reset password");
  }
});

// 12 reset password and validation

const resetPassword = asyncHandler(async (req, res) => {
  const newPassword = req.body.password;
  const token = req.params.token; // Use req.params.token to get the token from the URL parameter

  const hashedResetToken = crypto.createHash('sha256').update(token).digest('hex'); // Hash the token
  const user = await Users.findOne({
    passwordResetToken: hashedResetToken,
    passwordResetExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ error: "Invalid or expired reset token" });
  }

  // Update user's password and reset token fields
  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;
  await user.save();

  res.status(200).json({ message: "Password reset successful" });
});

// 13 - Login Admin ctrl

const loginAdminCotroller = asyncHandler(async (req, res) => {
  const AdminEmail = req.body.email;
  const password = req.body.password;
  const isAdmin = await Users?.findOne({ email: AdminEmail });


  if (isAdmin) {
    if( isAdmin.role != 'admin') throw new Error('you are not authorized')
    const passwordMatch = await isAdmin.isPassword(password);
    if (passwordMatch) {
      const isAdmin = await Users?.findOne({ email: AdminEmail });
      const refreshToken = await refreshTokenGenerator(isAdmin._id);
      
           // update token value in db
      await Users.findOneAndUpdate(
        { _id: isAdmin._id },
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
        firstname: isAdmin?.firstname,
        lastname: isAdmin?.lastname,
      
        email: isAdmin?.email,
        mobile: isAdmin?.firstname,
        role: isAdmin?.role,
        // pass id and email to token generator
        token: tokenGenerator(isAdmin?.id, isAdmin?.email),
    } )}
    else {
      throw new Error("Invalid Credentials");
    }
  } else {
    throw new Error("User not found");
  }
});

 // 14 - Get wishlist 

 const getWishlist = asyncHandler(async(req,res) =>{

  const {_id} = req.user ;
  try {
    const user = await Users.findById(_id).populate('wishlist');
    if(!user) { res.status(400).send('there is no user with this id')};
    res.json(user);
  }
   catch(error) {
    throw new Error("somthing went wrong");

   }

 });
   // 15 - save Address
   const saveAddress = asyncHandler(async (req, res) => {
    try {
      const { _id } = req.user;
      const { street, city, state, postalcode } = req.body;
  
      const user = await Users.findById(_id).select('firstname lastname email');
  
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
        
      // Create a new address instance
      const newAddress = new Address({
        street,
        city,
        state,
        postalcode,
        user : user
      });
  
      // Save the new address
      const savedAddress = await newAddress.save();
  
      // Update the user's address references
      user.address = savedAddress._id;
      await user.save();
  
      res.status(200).json(savedAddress);
    } catch (error) {
      console.error('Error adding address:', error);
      res.status(500).json({ error: 'An error occurred while adding the address.' });
    }
  });
  
  

    // 16 - get UserA dress

    const getUserAddress = asyncHandler(async (req, res) => {
      try {
        const { _id } = req.body;
    
        const user = await Users.findById(_id).select('address');
    
        if (!user) {
          return res.status(404).json({ error: 'User not found.' });
        }
    
        if (!user.address) {
          return res.status(404).json({ error: 'User address not found.' });
        }
    
        const userAddress = await Address.findById(user.address);
    
        if (!userAddress) {
          return res.status(404).json({ error: 'User address not found.' });
        }
    
        res.status(200).json('User address with ID ' + _id + ' is: ' + userAddress);
      } catch (error) {
        console.error('Error finding user address:', error);
        res.status(500).json({ error: 'An error occurred while finding the address.' });
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
  updatePasswordToken ,
  resetPassword ,
  loginAdminCotroller ,
  getWishlist ,
  saveAddress ,
  getUserAddress ,
};
