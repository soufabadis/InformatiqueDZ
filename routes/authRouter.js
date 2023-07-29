const express = require('express');
const { createUser, loginCotroller,getAllUsers,findUserById} = require("../controller/authController"); // Correct the import here

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginCotroller);
router.get('/all-users', getAllUsers);
router.get('/find-user/id/:userId', findUserById);


module.exports = router; // Export the router instance