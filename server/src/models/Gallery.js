const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    image: {
      url: {
        type: String,
        required: true,
        trim: true,
      },
      public_id: {
        type: String,
        required: true,
        trim: true,
      },
    },
    caption: {
      type: String,
      trim: true,
      maxlength: 300,
      default: '',
    },
    album: {
      type: String,
      trim: true,
      maxlength: 100,
      default: 'General',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

gallerySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Gallery', gallerySchema);

