const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  product_id: {
    type: String,
    required: true
  },
  product_name: {
    type: String,
    required: true
  },
  img_url: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', ProductSchema);