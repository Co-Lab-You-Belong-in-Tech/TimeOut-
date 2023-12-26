const mongoose = require('mongoose');

const statisticsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
  data: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TimeLog' }],
  totalOutdoorTime: { type: Number, default: 0 },
}, { timestamps: true });

const Statistics = mongoose.model('Statistics', statisticsSchema);

module.exports = Statistics;
