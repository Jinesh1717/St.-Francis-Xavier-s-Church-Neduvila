const errorHandler = (err, req, res, next) => {
  // Log error internally
  console.error(`[Error] ${req.method} ${req.url}:`, err.message);
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    console.error(err.stack);
  }

  // Multer errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Maximum allowed size is 5 MB.' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files uploaded. Maximum is 10 files per request.' });
    }
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  const isProduction = process.env.NODE_ENV === 'production';

  res.status(statusCode).json({
    error: isProduction && statusCode === 500 ? 'An internal server error occurred.' : err.message || 'Server error',
    ...(isProduction ? {} : { stack: err.stack }),
  });
};

module.exports = errorHandler;

