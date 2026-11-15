const Event = require('../models/Event');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

// GET /api/events?type=upcoming|past
const getEvents = async (req, res, next) => {
  try {
    const { type } = req.query;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let query = {};
    let sort = { date: 1 };

    if (type === 'past') {
      query.date = { $lt: today };
      sort = { date: -1 };
    } else if (type === 'upcoming') {
      query.date = { $gte: today };
      sort = { date: 1 };
    }

    const events = await Event.find(query).sort(sort).lean();
    res.json(events);
  } catch (error) {
    next(error);
  }
};

// GET /api/events/:id
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).lean();
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/events
const createEvent = async (req, res, next) => {
  try {
    const { title, date, time, venue, description } = req.body;
    let posterImage = { url: null, public_id: null };

    if (req.file) {
      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        req.file.originalname,
        'church_neduvila/events'
      );
      posterImage = {
        url: uploadResult.url,
        public_id: uploadResult.public_id,
      };
    }

    const newEvent = await Event.create({
      title,
      date: new Date(date),
      time,
      venue,
      description,
      posterImage,
    });

    res.status(201).json({
      message: 'Event created successfully',
      event: newEvent,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/events/:id
const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const { title, date, time, venue, description, removePoster } = req.body;

    if (title !== undefined) event.title = title;
    if (date !== undefined) event.date = new Date(date);
    if (time !== undefined) event.time = time;
    if (venue !== undefined) event.venue = venue;
    if (description !== undefined) event.description = description;

    // Handle poster replacement
    if (req.file) {
      if (event.posterImage?.public_id) {
        await deleteFromCloudinary(event.posterImage.public_id);
      }
      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        req.file.originalname,
        'church_neduvila/events'
      );
      event.posterImage = {
        url: uploadResult.url,
        public_id: uploadResult.public_id,
      };
    } else if (removePoster === 'true' || removePoster === true) {
      if (event.posterImage?.public_id) {
        await deleteFromCloudinary(event.posterImage.public_id);
      }
      event.posterImage = { url: null, public_id: null };
    }

    await event.save();
    res.json({
      message: 'Event updated successfully',
      event,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/events/:id
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.posterImage?.public_id) {
      await deleteFromCloudinary(event.posterImage.public_id);
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};

