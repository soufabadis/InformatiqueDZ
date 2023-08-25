const express = require('express');
const { createColor, findColor, getAllColors, updateColor, deleteColor } = require('../controller/colorController'); // Update controller import
const { authMiddleware, isAdmin } = require('../middlewares/authMiddlewares');

const router = express.Router();

router.post("/create-new-color", authMiddleware, isAdmin, createColor); 
router.get("/get-all-colors", getAllColors); 
router.get("/find-color/:colorId", findColor); 
router.put("/update-color/:colorId", authMiddleware, isAdmin, updateColor); 
router.delete("/delete-color/:colorId", authMiddleware, isAdmin, deleteColor);   

module.exports = router;
