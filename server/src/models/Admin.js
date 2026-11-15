const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Do not return password by default
    },
    failedLoginAttempts: {
      type: Number,
      required: true,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash password with cost 12
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password helper
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Check if account is locked
adminSchema.methods.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Increment failed attempts and lock if >= 5
adminSchema.methods.handleFailedLogin = async function () {
  const updates = { $inc: { failedLoginAttempts: 1 } };
  // If failed attempts + 1 >= 5, lock for 15 minutes
  if (this.failedLoginAttempts + 1 >= 5) {
    updates.$set = { lockUntil: new Date(Date.now() + 15 * 60 * 1000) };
  }
  return this.model('Admin').findByIdAndUpdate(this._id, updates, { new: true });
};

// Reset login attempts on successful login
adminSchema.methods.handleSuccessfulLogin = async function () {
  return this.model('Admin').findByIdAndUpdate(
    this._id,
    {
      $set: { failedLoginAttempts: 0 },
      $unset: { lockUntil: 1 },
    },
    { new: true }
  );
};

module.exports = mongoose.model('Admin', adminSchema);

