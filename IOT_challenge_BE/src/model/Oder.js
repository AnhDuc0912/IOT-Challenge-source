// src/model/Oder.js
const mongoose = require('mongoose');

const OderSchema = new mongoose.Schema({
  order_code: { type: String, required: true, unique: true },
  shelf_id:   { type: String, required: true },
  total_bill: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  total: { type: Number, required: true, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Oder', OderSchema);
