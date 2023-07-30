const express = require('express');
const { createUser, loginCotroller
    ,getAllUsers,findUserById
    ,deleteUserById,updateUserById} = require("../controller/authController"); // Correct the import here
const authMiddleware = require('../middlewares/authMiddlewares');

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginCotroller);
router.get('/all-users', getAllUsers);
router.get('/find-user/:userId',authMiddleware,findUserById);
router.delete('/delete-user/:userId', deleteUserById);
router.put('/update-user/:userId', updateUserById);



module.exports = router; // Export the router instance