// src/model/Oder.js
const mongoose = require('mongoose');

const OderSchema = new mongoose.Schema({
  order_id: { type: String, required: true, unique: true },
  shelf_id: { type: String, required: true },
  datetime: { type: Date, required: true },
  total_price: { type: Number, required: true }
}, {timestamps: true});

module.exports = mongoose.model('Oder', OderSchema);