const express = require('express');
const { createUser,
        loginCotroller,
        refreshTokenHandler,
        getAllUsers,
        findUserById,
        deleteUserById,
        updateUserById,
        blockUser,
        unBlockUser,
        logout,
        updatePassword,
        updatePasswordToken,
        resetPassword,
        loginAdminCotroller,
        getWishlist,
        saveAddress,
        getUserAddress} = require("../controller/authController"); 
const {authMiddleware,isAdmin} = require('../middlewares/authMiddlewares');

const router = express.Router();

router.post('/register', createUser);
router.put('/password',authMiddleware ,updatePassword);
router.post('/reset-password-token',updatePasswordToken);
router.put('/reset-password/:token',resetPassword);
router.post('/login', loginCotroller);
router.post('/admin-login', loginAdminCotroller);
router.get('/all-users', getAllUsers);
router.get('/refresh', refreshTokenHandler);
router.get('/logout', logout);
router.get('/find-user/:userId',authMiddleware,isAdmin,findUserById);
router.delete('/delete-user/:userId', deleteUserById);
router.put('/update-user/:userId', authMiddleware,isAdmin,updateUserById);
router.put('/block-user/:userId', authMiddleware,isAdmin,blockUser);
router.put('/unblock-user/:userId', authMiddleware,isAdmin,unBlockUser);
router.get('/wishlist',authMiddleware,getWishlist);
router.put('/save-address',authMiddleware,saveAddress);
router.get('/get-address',authMiddleware,isAdmin,getUserAddress);




module.exports = router; // Export the router instance