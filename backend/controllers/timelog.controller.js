const { updateGoalProgress } = require('../helpers/goal.helper');
const TimeLog = require('../models/timeLog');

// Create a timelog
const createTimeLog = async (req, res) => {
  try {
    const { userId, date, timeSpent } = req.body;

    // Check if the date is in the future
    const currentDate = new Date();
    if (date > currentDate) {
      return res.status(400).json({ message: 'Cannot create timelog for future dates' });
    }

    // Check if a timelog already exists for the given date
    const existingTimelog = await TimeLog.findOne({ userId, date });
    if (existingTimelog) {
      return res.status(400).json({ message: 'Timelog already exists for this date. Use update endpoint.' });
    }

    // Create a new timelog for either the current date or past date
    const timelog = new TimeLog({ userId, date, timeSpent });
    await timelog.save();

    // Update the user's goal progress
    await updateGoalProgress(userId, timeSpent);

    res.status(201).json({ timelog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a timelog
const updateTimeLog = async (req, res) => {
  try {
    const { timelogId } = req.params;
    const { timeSpent } = req.body;

    // Find the timelog to update
    const timelog = await TimeLog.findById(timelogId);

    if (!timelog) {
      return res.status(404).json({ message: 'Timelog not found' });
    }

    // Update the timelog
    timelog.timeSpent = timeSpent;
    await timelog.save();

    // Update the user's goal progress
    await updateGoalProgress(timelog.userId, timeSpent);

    res.status(200).json({ timelog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get time logs for a user
const getUserTimeLogs = async (req, res) => {
  try {
    const { userId } = req.params;
    const timeLogs = await TimeLog.find({ userId });

    res.status(200).json({ timeLogs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get time logs for a specific date
const getUserTimeLogsForDate = async (req, res) => {
  try {
    const { userId, date } = req.params;
    const timeLog = await TimeLog.findOne({ userId, date });

    if (!timeLog) {
      return res.status(200).json({ timeLog: {} });
    }

    res.status(200).json({ timeLog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTimeLog,
  updateTimeLog,
  getUserTimeLogs,
  getUserTimeLogsForDate,
};
