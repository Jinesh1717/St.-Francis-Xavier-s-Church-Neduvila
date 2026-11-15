const multer = require('multer');

// Allowed image MIME types and extensions
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

/**
 * Validates file buffer magic bytes to ensure the content matches an allowed image format
 * @param {Buffer} buffer
 * @returns {boolean}
 */
const checkMagicBytes = (buffer) => {
  if (!buffer || buffer.length < 12) return false;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return true;
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return true;
  }

  // WEBP: RIFF....WEBP (52 49 46 46 .... 57 45 42 50)
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return true;
  }

  return false;
};

// Use multer memory storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const mimeTypeValid = ALLOWED_MIME_TYPES.includes(file.mimetype.toLowerCase());
  const ext = (file.originalname.match(/\.[^.]+$/) || [''])[0].toLowerCase();
  const extValid = ALLOWED_EXTENSIONS.includes(ext);

  if (mimeTypeValid && extValid) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Max 5 MB per file
    files: 10, // Max 10 files per request
  },
  fileFilter,
});

/**
 * Middleware to verify magic bytes of uploaded multer files
 */
const validateUploadedFiles = (req, res, next) => {
  const files = req.files ? (Array.isArray(req.files) ? req.files : Object.values(req.files).flat()) : (req.file ? [req.file] : []);

  for (const file of files) {
    if (!checkMagicBytes(file.buffer)) {
      return res.status(400).json({
        error: `File "${file.originalname}" has invalid content and is not a valid JPEG, PNG, or WebP image.`,
      });
    }
  }

  next();
};

module.exports = {
  upload,
  validateUploadedFiles,
  checkMagicBytes,
};

