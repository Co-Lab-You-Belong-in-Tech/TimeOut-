const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['weekly', 'monthly'], required: true },
  target: { type: Number, required: true },
  progress: { type: Number, default: 0 },
  // start date should be the date that the user set the goal or the first day/date of the month
});

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;
