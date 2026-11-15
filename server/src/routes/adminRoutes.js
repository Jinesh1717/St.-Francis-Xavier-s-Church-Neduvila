const express = require('express');
const router = express.Router();

const { authenticateAdmin } = require('../middleware/auth');
const { upload, validateUploadedFiles } = require('../middleware/upload');
const {
  validate,
  validateObjectId,
  eventSchema,
  eventUpdateSchema,
  noticeSchema,
  noticeUpdateSchema,
  settingSchema,
  prayerSchema,
  prayerUpdateSchema,
  timingSchema,
} = require('../middleware/validation');

const {
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');

const {
  uploadGalleryImages,
  updateGalleryItem,
  deleteGalleryItem,
} = require('../controllers/galleryController');

const {
  getAllNoticesAdmin,
  createNotice,
  updateNotice,
  deleteNotice,
} = require('../controllers/noticeController');

const {
  getOverviewMetrics,
  updateSettings,
} = require('../controllers/settingController');

const {
  createPrayer,
  updatePrayer,
  deletePrayer,
  updateTiming,
} = require('../controllers/prayerController');

// All routes here require admin authentication
router.use(authenticateAdmin);

// Overview metrics
router.get('/overview', getOverviewMetrics);

// Settings
router.put('/settings', validate(settingSchema), updateSettings);

// Events
router.post(
  '/events',
  upload.single('poster'),
  validateUploadedFiles,
  validate(eventSchema),
  createEvent
);
router.put(
  '/events/:id',
  validateObjectId('id'),
  upload.single('poster'),
  validateUploadedFiles,
  validate(eventUpdateSchema),
  updateEvent
);
router.delete('/events/:id', validateObjectId('id'), deleteEvent);

// Gallery
router.post(
  '/gallery',
  upload.array('images', 10),
  validateUploadedFiles,
  uploadGalleryImages
);
router.put('/gallery/:id', validateObjectId('id'), updateGalleryItem);
router.delete('/gallery/:id', validateObjectId('id'), deleteGalleryItem);

// Notices
router.get('/notices', getAllNoticesAdmin);
router.post('/notices', validate(noticeSchema), createNotice);
router.put(
  '/notices/:id',
  validateObjectId('id'),
  validate(noticeUpdateSchema),
  updateNotice
);
router.delete('/notices/:id', validateObjectId('id'), deleteNotice);

// Prayers & Stations of the Cross
router.post(
  '/prayers',
  upload.single('image'),
  validateUploadedFiles,
  validate(prayerSchema),
  createPrayer
);
router.put(
  '/prayers/:id',
  validateObjectId('id'),
  upload.single('image'),
  validateUploadedFiles,
  validate(prayerUpdateSchema),
  updatePrayer
);
router.delete('/prayers/:id', validateObjectId('id'), deletePrayer);

// Timings
router.put('/timings/:type', validate(timingSchema), updateTiming);

module.exports = router;

