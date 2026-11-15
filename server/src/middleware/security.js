const crypto = require('crypto');

// Generate and attach CSRF token to cookie and response
const setCsrfToken = (req, res, next) => {
  let token = req.cookies['XSRF-TOKEN'];
  if (!token) {
    token = crypto.randomBytes(32).toString('hex');
    res.cookie('XSRF-TOKEN', token, {
      httpOnly: false, // Accessible to client-side JS so axios can send it in headers
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
  }
  res.locals.csrfToken = token;
  next();
};

// Validate CSRF token on state-changing requests
const verifyCsrfToken = (req, res, next) => {
  // Safe HTTP methods do not require CSRF check
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Exempt public login route from double-submit check if cookie is not set yet,
  // but rate-limiting and lockout strictly protect it.
  if (req.originalUrl === '/api/admin/login' || req.path === '/admin/login' || req.path === '/login') {
    return next();
  }

  const cookieToken = req.cookies['XSRF-TOKEN'];
  const headerToken = req.headers['x-csrf-token'] || req.headers['x-xsrf-token'];

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({
      error: 'Invalid or missing CSRF token. Please refresh the page and try again.',
    });
  }

  next();
};

module.exports = {
  setCsrfToken,
  verifyCsrfToken,
};
