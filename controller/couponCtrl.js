const asyncHandler = require("express-async-handler");
const Users = require("../models/userModel");
const Coupon = require('../models/couponModel');
const logger = require("../config/logger");
const idValidator = require("../Utils/idValidator");


/*
 1 - Create a new coupon 
 2 - Find a coupon 
 3 - Fetch all coupons 
 4 - Update a coupon 
 5 - Delete a coupon 
*/

/* 1 - Create a new coupon */
const createCoupon = asyncHandler(async (req, res) => {
    const coupon = req.body;

    try {
        logger.info('Creating a new coupon:', coupon);
        const newCoupon = await Coupon.create(coupon);
        res.json(newCoupon);
    } catch (e) {
        logger.error('Error creating a new coupon:', e);
        res.status(500).json(e);
    }
});

/* 2 - Find a coupon */
const findCoupon = asyncHandler(async (req, res) => {
    const { couponId } = req.params;
    idValidator(couponId);

    try {
        logger.info('Finding a coupon with ID:', couponId);

        const foundCoupon = await Coupon.findById(couponId);

        if (foundCoupon) {
            logger.info('Found a coupon:', foundCoupon);
            res.json(foundCoupon);
        } else {
            logger.info('No coupon found with ID:', couponId);
            res.json({ message: "There is no coupon" });
        }
    } catch (e) {
        logger.error('Error finding a coupon:', e);
        res.status(500).json({ message: "Something went wrong!" });
    }
});

/* 3 - Fetch all coupons */
const getAllCoupons = asyncHandler(async (req, res) => {
    try {
        logger.info('Fetching all coupons');

        const allCoupons = await Coupon.find();

        if (allCoupons && allCoupons.length > 0) {
            logger.info('Fetched all coupons:', allCoupons);
            res.json(allCoupons);
        } else {
            logger.info('No coupons found');
            res.json("There are no coupons");
        }
    } catch (e) {
        logger.error('Error fetching all coupons:', e);
        res.status(500).json({ message: "Something went wrong!" });
    }
});

/* 4 - Update a coupon */
const updateCoupon = asyncHandler(async (req, res) => {
    const newCouponInfo = req.body;
    const { couponId } = req.params;
    idValidator(couponId);

    try {
        logger.info(`Updating coupon with ID ${couponId}:`, newCouponInfo);

        const updatedCoupon = await Coupon.findByIdAndUpdate(
            { _id: couponId },
            { $set: newCouponInfo },
            { new: true }
        );

        if (updatedCoupon) {
            logger.info('Updated coupon:', updatedCoupon);
            res.json(updatedCoupon);
        } else {
            logger.info(`No coupon found with ID ${couponId}`);
            res.json("There is no coupon with this id");
        }
    } catch (e) {
        logger.error('Error updating coupon:', e);
        res.status(500).json({ message: "Something went wrong!" });
    }
});

/* 5 - Delete a coupon */
const deleteCoupon = asyncHandler(async (req, res) => {
    const { couponId } = req.params;
    idValidator(couponId);

    try {
        logger.info(`Deleting coupon with ID ${couponId}`);

        const deletedCoupon = await Coupon.findByIdAndDelete({ _id: couponId });

        if (deletedCoupon) {
            logger.info('Deleted coupon:', deletedCoupon);
            res.json(deletedCoupon);
        } else {
            logger.info(`No coupon found with ID ${couponId}`);
            res.json("There is no coupon");
        }
    } catch (e) {
        logger.error('Error deleting coupon:', e);
        res.status(500).json({ message: "Something went wrong!" });
    }
});

module.exports = {
    createCoupon,
    findCoupon,
    getAllCoupons,
    updateCoupon,
    deleteCoupon
};

