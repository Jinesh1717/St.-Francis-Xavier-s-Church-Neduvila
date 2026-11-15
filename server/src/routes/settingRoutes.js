const express = require('express');
const router = express.Router();
const { getSettings } = require('../controllers/settingController');

// Public settings (mass timings, address, history)
router.get('/', getSettings);

module.exports = router;

