const Setting = require('../models/Setting');
const Event = require('../models/Event');
const Gallery = require('../models/Gallery');
const Notice = require('../models/Notice');

// GET /api/settings
const getSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne().lean();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/settings
const updateSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting();
    }

    Object.assign(settings, req.body);
    await settings.save();

    res.json({ message: 'Church settings updated successfully', settings });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/overview
const getOverviewMetrics = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalEvents, upcomingEvents, totalPhotos, activeNotices] = await Promise.all([
      Event.countDocuments(),
      Event.countDocuments({ date: { $gte: today } }),
      Gallery.countDocuments(),
      Notice.countDocuments({
        $or: [{ expiryDate: null }, { expiryDate: { $gte: new Date() } }],
      }),
    ]);

    res.json({
      totalEvents,
      upcomingEvents,
      totalPhotos,
      activeNotices,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSettings,
  updateSettings,
  getOverviewMetrics,
};

