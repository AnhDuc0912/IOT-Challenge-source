const mongoose = require('mongoose')

const LoadCellSchema = new mongoose.Schema({
  load_cell_id: {
    type: Number,
    required: true
  },
  load_cell_name: {
    type: String,
    required: true
  },
  product_id: {
    type: String
  },
  shelf_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shelf',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },

  // 🆕 Thêm tầng và cột
  floor: {
    type: Number,
    required: true
  }, // tầng
  column: {
    type: Number,
    required: true
  } // cột
});

module.exports =  mongoose.model('LoadCell', LoadCellSchema);