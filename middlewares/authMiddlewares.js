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
          try {
              const decoded = jwt.verify(token, privateKey);
              const userEmail = decoded.email;
              const user = await Users.findOne({ email: userEmail });
              
              if (user) {
                  req.user = user;
                  next();
              } else {
                  throw new Error("Token expired, please log in again.");
              }
          } catch (error) {
              throw new Error("Token expired, please log in again.");
          }
      } else {
          throw new Error("Token expired, please log in again.");
      }
  } else {
      logger.error("Token not found in headers.");
      throw new Error("Token not found in headers.");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const email = req.user.email;
  try {
      const adminUser = await Users?.findOne({ email: email });
      if (adminUser && adminUser.role === "admin") {
          logger.info(`User ${email} is an admin.`);
          next();
      } else {
          logger.error(`User ${email} is not an admin.`);
          throw new Error("You are not an admin.");
      }
  } catch (error) {
      logger.error("Error checking admin role:", error);
      throw new Error("Error checking admin role.");
  }
});

module.exports = { authMiddleware, isAdmin };
