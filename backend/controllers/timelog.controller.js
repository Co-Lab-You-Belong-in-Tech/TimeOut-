const { validationResult } = require("express-validator");
const { updateGoalProgress } = require("../helpers/goal.helper");
const TimeLog = require("../models/TimeLog.model");

// Create a timelog
const createTimeLog = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { userId, date, timeSpent } = req.body;

    // Check if the date is in the future
    const currentDate = new Date();
    if (date > currentDate) {
      return res
        .status(400)
        .json({ message: "Cannot create timelog for future dates" });
    }

    // Check if a timelog already exists for the given date
    const existingTimelog = await TimeLog.findOne({ userId, date });
    if (existingTimelog) {
      const formattedDate = existingTimelog.date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      return res
        .status(400)
        .json({
          message: `Timelog already exists for ${formattedDate}. Update your timelog if needed.`,
        });
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
    const { userId } = req.params;
    const { timeSpent } = req.body;

    // Find the timelog to update
    const timelog = await TimeLog.findOne({ userId });

    if (!timelog) {
      return res.status(404).json({ message: "Timelog not found" });
    }

    // Update the timelog (timeSpent only)
    timelog.timeSpent = timeSpent;
    await timelog.save();

    // Update the user's goal progress
    await updateGoalProgress(timelog.userId, timeSpent);

    res.status(200).json({ message: "Time spent updated", timelog });
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
const getUserTimeLogsByDate = async (req, res) => {
  try {
    const { userId, date } = req.params;

    // Validate the date format using a regular expression
    const dateFormatRegex = /^[a-zA-Z]{3}-\d{2}-\d{4}$/;
    if (!dateFormatRegex.test(date)) {
      return res.status(400).json({ error: 'Invalid date format. Please use /MMM-DD-YYYY.' });
    }

    // Find the time log using the original date format in the database
    const timeLog = await TimeLog.findOne({
      userId,
      date: { $gte: new Date(date), $lt: new Date(date).setDate(new Date(date).getDate() + 1) }
    });

    // Convert the date parameter to a JavaScript Date object
    const formattedDate = new Date(date);

    // Format the date to the desired string format: "Month DD, YYYY"
    const formattedDateString = formattedDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    if (!timeLog) {
      return res.status(400).json({ error: `No timelog for ${formattedDateString} found` });
    }

    res.status(200).json({ timeLog });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ msg: "Date doesn't exist" });
    }
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTimeLog,
  updateTimeLog,
  getUserTimeLogs,
  getUserTimeLogsByDate,
};
