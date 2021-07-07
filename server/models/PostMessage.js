const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: String,
    message: String,
    name: String,
    creator: String,
    tags: [String],
    selectedFile: String,
    comments: {
        type: [String],
        default: []
    },
    likes: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
})

module.exports = mongoose.model('PostMessage', postSchema)