const express = require('express');
const router = express.Router();
const sepayConfigController = require('../controller/sepayConfig.controller');

router.get('/', sepayConfigController.getConfig);
router.put('/', sepayConfigController.upsertConfig);

module.exports = router;
