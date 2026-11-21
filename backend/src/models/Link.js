const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  originalUrl: { type: String, required: true, trim: true },
  shortCode: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  title: { type: String, trim: true, maxlength: 120, default: '' },
  clicks: { type: Number, default: 0, min: 0 },
  isActive: { type: Boolean, default: true },
  expiresAt: { type: Date, default: null }
}, { timestamps: true });

linkSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Link', linkSchema);
