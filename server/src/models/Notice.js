const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    isPinned: {
      type: Boolean,
      default: false,
      index: true,
    },
    expiryDate: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

noticeSchema.index({ isPinned: -1, createdAt: -1 });

module.exports = mongoose.model('Notice', noticeSchema);

