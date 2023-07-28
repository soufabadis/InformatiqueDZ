const express = require('express')
const {createUser} = require("../controller/authController");
const {loginCotroller} = require("../controller/authController");

const router = express.Router()

router.post('/register', createUser);
router.post('/login', loginCotroller);

module.exports = router; // Export the router instance
