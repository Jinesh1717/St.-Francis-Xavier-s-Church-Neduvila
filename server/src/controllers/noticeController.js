const Notice = require('../models/Notice');

// GET /api/notices
const getNotices = async (req, res, next) => {
  try {
    const today = new Date();

    // Query for active notices: expiryDate is either null or >= today
    const query = {
      $or: [{ expiryDate: null }, { expiryDate: { $gte: today } }],
    };

    // Pinned notices first, then newest first
    const notices = await Notice.find(query)
      .sort({ isPinned: -1, createdAt: -1 })
      .lean();

    res.json(notices);
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/notices (Includes expired notices for admin management)
const getAllNoticesAdmin = async (req, res, next) => {
  try {
    const notices = await Notice.find()
      .sort({ isPinned: -1, createdAt: -1 })
      .lean();
    res.json(notices);
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/notices
const createNotice = async (req, res, next) => {
  try {
    const { title, message, isPinned, expiryDate } = req.body;

    const notice = await Notice.create({
      title,
      message,
      isPinned: Boolean(isPinned),
      expiryDate: expiryDate ? new Date(expiryDate) : null,
    });

    res.status(201).json({
      message: 'Notice created successfully',
      notice,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/notices/:id
const updateNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ error: 'Notice not found' });
    }

    const { title, message, isPinned, expiryDate } = req.body;

    if (title !== undefined) notice.title = title;
    if (message !== undefined) notice.message = message;
    if (isPinned !== undefined) notice.isPinned = Boolean(isPinned);
    if (expiryDate !== undefined) {
      notice.expiryDate = expiryDate ? new Date(expiryDate) : null;
    }

    await notice.save();
    res.json({ message: 'Notice updated successfully', notice });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/notices/:id
const deleteNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) {
      return res.status(404).json({ error: 'Notice not found' });
    }
    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotices,
  getAllNoticesAdmin,
  createNotice,
  updateNotice,
  deleteNotice,
};

