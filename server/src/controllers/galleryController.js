const Gallery = require('../models/Gallery');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const { sanitizeText } = require('../middleware/validation');

// GET /api/gallery
const getGallery = async (req, res, next) => {
  try {
    const { album } = req.query;
    let query = {};
    if (album && album !== 'All') {
      query.album = album;
    }

    const items = await Gallery.find(query).sort({ createdAt: -1 }).lean();

    // Also get list of distinct album names
    const albums = await Gallery.distinct('album');

    res.json({
      items,
      albums: ['All', ...albums.filter(Boolean)],
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/gallery (Multi-upload)
const uploadGalleryImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Please select at least one image to upload' });
    }

    const album = sanitizeText(req.body.album) || 'General';
    const caption = sanitizeText(req.body.caption) || '';

    const uploadPromises = req.files.map(async (file) => {
      const result = await uploadToCloudinary(
        file.buffer,
        file.originalname,
        'church_neduvila/gallery'
      );
      return Gallery.create({
        image: {
          url: result.url,
          public_id: result.public_id,
        },
        album,
        caption,
      });
    });

    const createdItems = await Promise.all(uploadPromises);

    res.status(201).json({
      message: `Successfully uploaded ${createdItems.length} photo(s)`,
      items: createdItems,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/gallery/:id
const updateGalleryItem = async (req, res, next) => {
  try {
    const { caption, album } = req.body;
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    if (caption !== undefined) item.caption = sanitizeText(caption);
    if (album !== undefined) item.album = sanitizeText(album) || 'General';

    await item.save();
    res.json({ message: 'Photo updated successfully', item });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/gallery/:id
const deleteGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    // Delete image from Cloudinary or local storage
    if (item.image?.public_id) {
      await deleteFromCloudinary(item.image.public_id);
    }

    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGallery,
  uploadGalleryImages,
  updateGalleryItem,
  deleteGalleryItem,
};

