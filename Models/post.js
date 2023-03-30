const mongoose = require('mongoose')

const PostScheme = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    type: { type: String, required: true, default: "QUESTION" },
    title: { type: String },
    post_id: { type: String, required: true, unique: true },
    description: { type: String },
    content: { type: String, required: true },
    points_earned: { type: Number, default: 0 },
    visibility: { type: Array, required: true, default: ['PUBLIC'] },
    paused: { type: Boolean, required: true, default: false },
    views: { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('Post', PostScheme)