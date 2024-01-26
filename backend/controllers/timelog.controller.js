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
    const { userId, date, startTime, timeSpent } = req.body;

    // Check if the date is in the future
    const currentDate = new Date();
    if (new Date(date) > currentDate) {
      return res.status(400).json({ message: 'Cannot create timelog for future dates' });
    }

    // Create a new timelog for the current date or past date
    const timelog = new TimeLog({ userId, date, startTime, timeSpent });
    await timelog.save();

    // Update the user's goal progress
    await updateGoalProgress(userId, date, timeSpent);

    const formattedDate = timelog.date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    res.status(201).json({ date: formattedDate, timelog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a timelog
const updateTimeLog = async (req, res) => {
  try {
    const { timelogId } = req.params;
    const { timeSpent, startTime } = req.body;

    // Find the timelog to update
    const timelog = await TimeLog.findById(timelogId);

    if (!timelog) {
      return res.status(404).json({ message: 'Timelog not found' });
    }

    // Update the timelog
    const updatedTimelog = await TimeLog.findByIdAndUpdate(
      timelogId,
      {
        $set: {
          timeSpent,
          startTime,
        },
      },
      { new: true }
    );

    // Check if the timelog is for a current date not a previous date before updating goal progress
    // Update the user's goal progress
    await updateGoalProgress(timelog.userId, timelog.date, timeSpent);

    res.status(200).json({ updatedTimelog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a timelog
const deleteTimeLog = async (req, res) => {
  try {
    const { timelogId } = req.params;

    // Find and delete the timelog
    const timelog = await TimeLog.findByIdAndDelete(timelogId);

    if (!timelog) {
      return res.status(404).json({ message: 'Timelog not found' });
    }

    // Update the user's goal progress after deletion
    await updateGoalProgress(timelog.userId, timelog.date, -timelog.timeSpent); // Subtract the deleted time

    res.status(200).json({ message: 'Timelog deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get time logs for a user
const getUserTimeLogs = async (req, res) => {
  try {
    const { userId } = req.params;
    const timeLogs = await TimeLog.find({ userId }).sort("date");

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
    const timeLog = await TimeLog.find({
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

// get overall user's daily average
const getUserDailyAverage = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Fetch all time logs for the user
    const timeLogs = await TimeLog.find({ userId });

    // Calculate the sum of time spent
    const timeLogSum = timeLogs.reduce((total, log) => total + log.timeSpent, 0);

    // Calculate the overall daily average
    const numberOfTimeLogs = timeLogs.length;
    const dailyAverage = numberOfTimeLogs > 0 ? timeLogSum / numberOfTimeLogs : 0;

    res.status(200).json({ dailyAverage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get the time log streak
const getTimeLogStreak = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch all time logs for the user
    const timeLogs = await TimeLog.find({ userId }).sort({ date: 'asc' });

    // Calculate the streak based on the current date
    const currentDate = new Date();
    let streak = 0;

    // Loop through the timeLogs to calculate the streak
    for (let i = timeLogs.length - 1; i >= 0; i--) {
      const timeLogDate = timeLogs[i].date;
      const timeLogDayDifference = Math.floor((currentDate - timeLogDate) / (1000 * 60 * 60 * 24));

      if (timeLogDayDifference === streak) {
        streak++;
      } else {
        // Break the loop if the streak is broken
        break; 
      }
    }

    res.status(200).json({ streak });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  createTimeLog,
  updateTimeLog,
  deleteTimeLog,
  getUserTimeLogs,
  getUserTimeLogsByDate,
  getUserDailyAverage,
  getTimeLogStreak,
};
