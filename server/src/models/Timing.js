const mongoose = require('mongoose');

const timingSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      enum: ['japamala', 'kurisinte-vazhi'],
      index: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Timing', timingSchema);
