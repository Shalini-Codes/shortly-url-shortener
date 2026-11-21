const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
  linkId: { type: mongoose.Schema.Types.ObjectId, ref: 'Link', required: true, index: true },
  clickedAt: { type: Date, default: Date.now, index: true },
  referrer: { type: String, trim: true, default: '' },
  browser: { type: String, trim: true, default: 'Unknown' },
  device: { type: String, trim: true, default: 'Unknown' },
  operatingSystem: { type: String, trim: true, default: 'Unknown' }
});

clickSchema.index({ linkId: 1, clickedAt: -1 });

module.exports = mongoose.model('Click', clickSchema);
