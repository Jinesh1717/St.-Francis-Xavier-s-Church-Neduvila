const express = require('express');
const router = express.Router();
const { getPrayers } = require('../controllers/prayerController');

// Public endpoints
router.get('/', getPrayers);

module.exports = router;

