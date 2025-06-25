// src/model/OderDetail.js
const mongoose = require('mongoose');

const OderDetailSchema = new mongoose.Schema({
  order_id: { type: String, required: true },
  product_id: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total_price: { type: Number, required: true }
});

module.exports = mongoose.model('OderDetail', OderDetailSchema);