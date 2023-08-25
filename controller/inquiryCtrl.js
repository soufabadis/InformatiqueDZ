const Inquiry = require("../models/inquiryModel");
const asyncHandler = require('express-async-handler');
const idValidator = require("../Utils/idValidator");
const logger = require('../config/logger');

/* 
   1- Create a new inquiry.   
   2- Get an inquiry
   3- Update an inquiry
   4- Delete an inquiry
   5- Get all inquiries
*/

// 1- Create a new inquiry
const createInquiry = asyncHandler(async (req, res) => {
  const { name, email, mobile, comment } = req.body;

  try {
    if (!name || !email || !mobile || !comment) {
      res.status(400).json({ error: 'Please provide all required fields' });
      return;
    }

    const createdInquiry = await Inquiry.create({ name, email, mobile, comment });

    res.status(201).json(createdInquiry);
  } catch (error) {
    logger.error('Error creating inquiry:', error);
    res.status(500).json({ error: 'Failed to create inquiry' });
  }
});

// 2- Get an inquiry
const findInquiry = asyncHandler(async (req, res) => {
  try {
    const { inquiryId } = req.params;
    idValidator(inquiryId);
    const inquiry = await Inquiry.findById(inquiryId);

    if (!inquiry) {
      res.status(404).json({ error: 'Inquiry not found' });
    } else {
      res.status(200).json(inquiry);
    }
  } catch (error) {
    logger.error('Error fetching inquiry:', error);
    res.status(500).json({ error: 'Failed to fetch inquiry' });
  }
});

// 3- Update an inquiry
const updateInquiry = asyncHandler(async (req, res) => {
  const { inquiryId } = req.params;
  const { name, email, mobile, comment } = req.body;
  idValidator(inquiryId);

  try {
    const updatedInquiry = await Inquiry.findByIdAndUpdate(
      inquiryId,
      { name, email, mobile, comment },
      { new: true }
    );

    if (!updatedInquiry) {
      res.status(404).json({ error: 'Inquiry not found' });
    } else {
      res.status(200).json(updatedInquiry);
    }
  } catch (error) {
    logger.error('Error updating inquiry:', error);
    res.status(500).json({ error: 'Failed to update inquiry' });
  }
});

// 4- Delete an inquiry
const deleteInquiry = asyncHandler(async (req, res) => {
  const { inquiryId } = req.params;
  idValidator(inquiryId);

  try {
    const deletedInquiry = await Inquiry.findByIdAndDelete(inquiryId);

    if (!deletedInquiry) {
      res.status(404).json({ error: 'Inquiry not found' });
    } else {
      res.status(200).json({ message: 'Inquiry deleted successfully' });
    }
  } catch (error) {
    logger.error('Error deleting inquiry:', error);
    res.status(500).json({ error: 'Failed to delete inquiry' });
  }
});

// 5- Get all inquiries
const getAllInquiries = asyncHandler(async (req, res) => {
  try {
    const inquiries = await Inquiry.find();

    if (inquiries.length === 0) {
      res.status(404).json({ error: 'No inquiries found' });
    } else {
      res.status(200).json(inquiries);
    }
  } catch (error) {
    logger.error('Error fetching all inquiries:', error);
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

module.exports = { createInquiry, findInquiry, updateInquiry, deleteInquiry, getAllInquiries };
