const express = require('express');
const { createUser, loginCotroller
    ,getAllUsers,findUserById
    ,deleteUserById,updateUserById,blockUser,unBlockUser} = require("../controller/authController"); 
const {authMiddleware,isAdmin} = require('../middlewares/AuthMiddlewares');

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginCotroller);
router.get('/all-users', getAllUsers);
router.get('/find-user/:userId',authMiddleware,isAdmin,findUserById);
router.delete('/delete-user/:userId', deleteUserById);
router.put('/update-user/:userId', authMiddleware,isAdmin,updateUserById);
router.put('/block-user/:userId', authMiddleware,isAdmin,blockUser);
router.put('/unblock-user/:userId', authMiddleware,isAdmin,unBlockUser);


module.exports = router; // Export the router instance