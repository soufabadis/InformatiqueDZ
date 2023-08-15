

const rateLimit = require('express-rate-limit');
const asyncHandler = require("express-async-handler");

// Apply rate limiting middleware
const limiter = asyncHandler(rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100 // limit each IP to 100 requests per windowMs
}));

module.exports = limiter;
