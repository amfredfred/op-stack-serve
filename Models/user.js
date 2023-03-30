const mongoose = require('mongoose')

const UserScheme = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    earnings: { type: Number, default: 0 }
}, { timestamps: true })

module.exports = mongoose.model('User', UserScheme)