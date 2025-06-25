const mongoose = require('mongoose');

const shelfSchema = new mongoose.Schema({
    shelf_id: {
        type: String,
        required: true,
        unique: true
    }, // ID riêng
    shelf_name: {
        type: String,
        required: true
    }, // Tên kệ
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    }, // Người phụ trách
    location: {
        type: String,
        required: true
    }, // Khu vực
}, {
    timestamps: true, // tự động thêm createdAt và updatedAt
});

module.exports = mongoose.model('Shelf', shelfSchema);