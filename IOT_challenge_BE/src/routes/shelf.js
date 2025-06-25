const express = require('express');
const router = express.Router();
const shelfController = require('../controller/shelf.controller');
const {
    verifyToken,
    isAdmin
} = require('../middleware/auth');

// CRUD Shelf (chỉ cho Admin)
router.get('/', shelfController.getAllShelves);
router.post('/', shelfController.createShelf);
router.put('/:id', shelfController.updateShelf);
router.delete('/:id', shelfController.deleteShelf);

module.exports = router;