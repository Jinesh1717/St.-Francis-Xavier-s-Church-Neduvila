const express = require('express');
const router = express.Router();
const { getEvents, getEventById } = require('../controllers/eventController');
const { validateObjectId } = require('../middleware/validation');

// Public endpoints
router.get('/', getEvents);
router.get('/:id', validateObjectId('id'), getEventById);

module.exports = router;

