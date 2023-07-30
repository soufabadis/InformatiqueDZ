const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const Users = require("../models/userModel");
const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs");

const privateKeyPath = process.env.PRIVATE_KEY_PATH;
const privateKey = fs.readFileSync(privateKeyPath, "utf-8");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    if (token) {
      const decoded = jwt.verify(token, privateKey);
      const user = await Users?.findOne({email :decoded})    // Optionally, you can attach the decoded user data to the request object for later use
      user = req.User; 
      next(); // Proceed to the next middleware or route handler
    } else {
      // No token found in the header
      throw new Error("Token expired, please log in again.");
    }
  } else {
    // No token found in the header
    throw new Error("Token not found in headers.");
  }
});

module.exports = authMiddleware ;