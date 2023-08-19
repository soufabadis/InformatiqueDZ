const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    numViews: {
        type: Number,
        default: 0,
    },
    isLiked: {
        type: Boolean,
        default: false,
    },
    isDisliked: {
        type: Boolean,
        default: false,
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    dislikes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    images: [],
    author: {
        type: String,
        default: '',
        required: true,
    },
    numLikes: {
        type: Number,
        default: 0,
    },
    numDislikes: {
        type: Number,
        default: 0,
    },
}, {
    toJSON: {
        virtual: true,
    },
    toObject: {
        virtual: true,
    },
    timestamps: true,
});

// Export the model
module.exports = mongoose.model('Blog', userSchema);
