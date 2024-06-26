const mongoose = require('mongoose');

const timeLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  startTime: {type: String, required: true},
  timeSpent: { type: Number, required: true } //in minutes
}, { timestamps: true });

const TimeLog = mongoose.model('TimeLog', timeLogSchema);

module.exports = TimeLog;
