const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, unique: true },
  timeLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'timeLog' }],
  goals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Goal' }],
  timeAverage: { type: Number, default: 0 }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
