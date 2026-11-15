const express = require('express');
const router = express.Router();
const { getTimings } = require('../controllers/prayerController');

// Public endpoints
router.get('/', getTimings);

module.exports = router;
