const express = require('express');
const router = express.Router();
const productController = require('../controller/product.controller');
const upload = require('../middleware/upload');

router.post('/', upload, productController.createProduct);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', upload, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;