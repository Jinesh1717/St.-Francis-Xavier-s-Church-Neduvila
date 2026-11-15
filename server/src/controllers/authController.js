const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username: username.toLowerCase() }).select('+password');

    if (admin && admin.isLocked()) {
      const minutesLeft = Math.ceil((admin.lockUntil - Date.now()) / (60 * 1000));
      return res.status(429).json({
        error: `Account is temporarily locked due to repeated failed logins. Please try again after ${minutesLeft} minute(s).`,
      });
    }

    if (!admin) {
      // Artificial delay to prevent timing-based user enumeration
      await sleep(600);
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      await admin.handleFailedLogin();
      await sleep(600);
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Reset failed login counter on success
    await admin.handleSuccessfulLogin();

    // Sign 30-minute JWT
    const secret = process.env.JWT_SECRET || 'fallback_default_secret_at_least_32_characters_long!';
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      secret,
      { expiresIn: '30m' }
    );

    // Set Secure httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 60 * 1000, // 30 minutes
    });

    res.json({
      message: 'Login successful',
      admin: {
        id: admin._id,
        username: admin.username,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.json({ message: 'Logged out successfully' });
};

const getMe = async (req, res) => {
  res.json({
    authenticated: true,
    admin: {
      id: req.admin._id,
      username: req.admin.username,
    },
  });
};

module.exports = {
  login,
  logout,
  getMe,
};
