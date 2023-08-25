const express = require('express');
const { createInquiry, findInquiry, updateInquiry, deleteInquiry, getAllInquiries } = require('../controller/inquiryCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddlewares');

const router = express.Router();

router.post("/create-new-inquiry", authMiddleware, createInquiry);
router.get("/get-all-inquiries", authMiddleware, getAllInquiries);
router.get("/find-inquiry/:inquiryId", authMiddleware,findInquiry);
router.put("/update-inquiry/:inquiryId", authMiddleware, isAdmin, updateInquiry);
router.delete("/delete-inquiry/:inquiryId", authMiddleware, isAdmin, deleteInquiry);

module.exports = router;
