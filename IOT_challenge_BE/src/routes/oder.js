const express = require('express');
const router = express.Router();
const oderController = require('../controller/order.controller');
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Order
router.post(
  '/',
  upload.fields([
    { name: 'receipt_image', maxCount: 1 },
    { name: 'customer_image', maxCount: 1 },
    { name: 'file',          maxCount: 1 },
  ]),
  oderController.createOrderWithDetails
);

router.get('/', oderController.getOrders);
router.get('/:id', oderController.getOrderDetail);

module.exports = router;
