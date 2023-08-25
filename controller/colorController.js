const color = require("../models/colorModel"); // Import the color model
const asyncHandler = require('express-async-handler');
const idValidator = require("../Utils/idValidator");
const logger = require('../config/logger');



// 1- Create a new color

const createColor = asyncHandler(async (req, res) => {
    const { name } = req.body; // Change 'title' to 'name'

    try {
        if (!name) {
            res.status(400).json({ error: 'Please provide a valid name' });
            return;
        }

        const createdColor = await color.create({ name: name }); // Change 'title' to 'name'

        res.status(201).json(createdColor);
    } catch (error) {
        logger.error('Error creating color:', error);
        res.status(500).json({ error: 'Failed to create color' });
    }
});

// 2- Get a color

const findColor = asyncHandler(async (req, res) => {
    try {
        const { colorId } = req.params;
        idValidator(colorId);
        const colorDoc = await color.findById(colorId); 

        if (!colorDoc) {
            res.status(404).json({ error: 'Color not found' });
        } else {
            res.status(200).json(colorDoc);
        }
    } catch (error) {
        logger.error('Error fetching color:', error);
        res.status(500).json({ error: 'Failed to fetch color' });
    }
});

// 3- Update a color

const updateColor = asyncHandler(async (req, res) => {
    const { colorId } = req.params;
    const { name } = req.body; 
    idValidator(colorId);

    try {
        const updatedColor = await color.findByIdAndUpdate(
            colorId,
            { name: name }, 
            { new: true }
        );

        if (!updatedColor) {
            res.status(404).json({ error: 'Color not found' });
        } else {
            res.status(200).json(updatedColor);
        }
    } catch (error) {
        logger.error('Error updating color:', error);
        res.status(500).json({ error: 'Failed to update color' });
    }
});

// 4 - Delete color

const deleteColor = asyncHandler(async (req, res) => {
    const { colorId } = req.params;
    idValidator(colorId);

    try {
        const deletedColor = await color.findByIdAndDelete(colorId);

        if (!deletedColor) {
            res.status(404).json({ error: 'Color not found' });
        } else {
            res.status(200).json({ message: 'Color deleted successfully' });
        }
    } catch (error) {
        logger.error('Error deleting color:', error);
        res.status(500).json({ error: 'Failed to delete color' });
    }
});

// 5 - Get all colors

const getAllColors = asyncHandler(async (req, res) => {
    try {
        const colors = await color.find();
        if (!colors) {
            res.status(500).json({ error: 'There are no colors' });
        }
        res.status(200).json(colors);
    } catch (error) {
        logger.error('Error fetching all colors:', error);
        res.status(500).json({ error: 'Failed to fetch colors' });
    }
});

module.exports = { createColor, findColor, getAllColors, updateColor, deleteColor };
