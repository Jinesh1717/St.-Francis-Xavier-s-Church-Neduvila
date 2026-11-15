const express = require('express');
const router = express.Router();
const { getGallery } = require('../controllers/galleryController');

// Public gallery list
router.get('/', getGallery);

module.exports = router;

