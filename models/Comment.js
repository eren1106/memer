const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    postId: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true,
        max: 100
    }
    
}, {timestamps: true});

module.exports = mongoose.model("Comment", CommentSchema);