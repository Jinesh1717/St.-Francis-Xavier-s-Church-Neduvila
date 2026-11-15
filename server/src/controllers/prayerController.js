const Prayer = require('../models/Prayer');
const Timing = require('../models/Timing');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

// GET /api/prayers?type=japamala|kurisinte-vazhi
const getPrayers = async (req, res, next) => {
  try {
    const { type } = req.query;
    let query = {};
    if (type && ['japamala', 'kurisinte-vazhi'].includes(type)) {
      query.type = type;
    }

    const prayers = await Prayer.find(query).sort({ order: 1, createdAt: 1 }).lean();
    res.json(prayers);
  } catch (error) {
    next(error);
  }
};

// GET /api/timings?type=japamala|kurisinte-vazhi
const getTimings = async (req, res, next) => {
  try {
    const { type } = req.query;
    let query = {};
    if (type) {
      query.type = type;
    }

    const timings = await Timing.find(query).lean();
    if (type) {
      const single = timings.find((t) => t.type === type);
      return res.json(single || { type, text: '' });
    }
    res.json(timings);
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/prayers
const createPrayer = async (req, res, next) => {
  try {
    const { type, title, titleMl, body, order } = req.body;
    let imageUrl = null;
    let imagePublicId = null;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        req.file.originalname,
        `church_neduvila/${type}`
      );
      imageUrl = uploadResult.url;
      imagePublicId = uploadResult.public_id;
    }

    const prayer = await Prayer.create({
      type,
      title,
      titleMl: titleMl || '',
      body,
      order: order !== undefined ? Number(order) : 0,
      imageUrl,
      imagePublicId,
    });

    res.status(201).json({
      message: 'Prayer record created successfully',
      prayer,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/prayers/:id
const updatePrayer = async (req, res, next) => {
  try {
    const prayer = await Prayer.findById(req.params.id);
    if (!prayer) {
      return res.status(404).json({ error: 'Prayer record not found' });
    }

    const { type, title, titleMl, body, order, removeImage } = req.body;

    if (type) prayer.type = type;
    if (title !== undefined) prayer.title = title;
    if (titleMl !== undefined) prayer.titleMl = titleMl;
    if (body !== undefined) prayer.body = body;
    if (order !== undefined) prayer.order = Number(order);

    if (req.file) {
      if (prayer.imagePublicId) {
        await deleteFromCloudinary(prayer.imagePublicId);
      }
      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        req.file.originalname,
        `church_neduvila/${prayer.type}`
      );
      prayer.imageUrl = uploadResult.url;
      prayer.imagePublicId = uploadResult.public_id;
    } else if (removeImage === 'true' || removeImage === true) {
      if (prayer.imagePublicId) {
        await deleteFromCloudinary(prayer.imagePublicId);
      }
      prayer.imageUrl = null;
      prayer.imagePublicId = null;
    }

    await prayer.save();
    res.json({
      message: 'Prayer record updated successfully',
      prayer,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/prayers/:id
const deletePrayer = async (req, res, next) => {
  try {
    const prayer = await Prayer.findById(req.params.id);
    if (!prayer) {
      return res.status(404).json({ error: 'Prayer record not found' });
    }

    if (prayer.imagePublicId) {
      await deleteFromCloudinary(prayer.imagePublicId);
    }

    await Prayer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Prayer record deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/timings/:type
const updateTiming = async (req, res, next) => {
  try {
    const { type } = req.params;
    const { text } = req.body;

    if (!['japamala', 'kurisinte-vazhi'].includes(type)) {
      return res.status(400).json({ error: 'Invalid timing type' });
    }

    const timing = await Timing.findOneAndUpdate(
      { type },
      { type, text },
      { new: true, upsert: true }
    );

    res.json({
      message: 'Timing updated successfully',
      timing,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPrayers,
  getTimings,
  createPrayer,
  updatePrayer,
  deletePrayer,
  updateTiming,
};
