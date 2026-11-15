const express = require('express');
const router = express.Router();
const { getNotices } = require('../controllers/noticeController');

// Public notices list
router.get('/', getNotices);

module.exports = router;

