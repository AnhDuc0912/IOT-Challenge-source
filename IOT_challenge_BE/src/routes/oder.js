// src/routes/oder.js
const express = require('express');
const router = express.Router();
const oderController = require('../controller/order.controller');

// Order
router.post('/', oderController.createOrderWithDetails);
router.get('/', oderController.getOrders);

module.exports = router;