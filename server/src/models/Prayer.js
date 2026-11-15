const mongoose = require('mongoose');

const prayerSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['japamala', 'kurisinte-vazhi'],
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 250,
    },
    titleMl: {
      type: String,
      trim: true,
      maxlength: 250,
      default: '',
    },
    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10000,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
      index: true,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    imagePublicId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

prayerSchema.index({ type: 1, order: 1 });

module.exports = mongoose.model('Prayer', prayerSchema);

