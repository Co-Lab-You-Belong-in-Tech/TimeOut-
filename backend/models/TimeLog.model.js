const mongoose = require('mongoose');

const timeLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  timeSpent: {type: Number, required: true}
});

const TimeLog = mongoose.model('TimeLog', timeLogSchema);

module.exports = TimeLog;
