const express = require('express');
const router = express.Router();

const productRoutes = require('./product');
const userRouter = require('./user');
const oderRoutes = require('./oder');
const shelfRoutes = require('./shelf');

// Gắn các route con vào router chính
router.use('/products', productRoutes);
router.use('/orders', oderRoutes);
router.use('/users', userRouter);
router.use('/shelves', shelfRoutes);

module.exports = router;