const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    venue: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    posterImage: {
      url: {
        type: String,
        trim: true,
        default: null,
      },
      public_id: {
        type: String,
        trim: true,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Helpful index for sorting upcoming/past events
eventSchema.index({ date: 1 });

module.exports = mongoose.model('Event', eventSchema);
