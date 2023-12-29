const TimeLog = require('../models/TimeLog.model');
// const Statistics = require('../models/Statistics');

// Get weekly stats
const getWeeklyStats = async (req, res) => {
  try {
    const { userId, date } = req.params;

    // Calculate the start date of the current week and the previous week
    const currentDate = new Date(date);
    const startOfCurrentWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
    const startOfPreviousWeek = new Date(startOfCurrentWeek);
    startOfPreviousWeek.setDate(startOfCurrentWeek.getDate() - 7);

    // Get time logs for the current week
    const currentWeekTimeLogs = await TimeLog.find({
      userId,
      date: { $gte: startOfCurrentWeek, $lte: currentDate },
    });

    // Get time logs for the previous week
    const previousWeekTimeLogs = await TimeLog.find({
      userId,
      date: { $gte: startOfPreviousWeek, $lt: startOfCurrentWeek },
    });

    // Format the data for the response
    const currentWeekStats = currentWeekTimeLogs.map(timelog => ({
      day: timelog.date.toLocaleDateString('en-US', { weekday: 'long' }),
      timeDuration: timelog.timeSpent,
    }));

    const previousWeekStats = previousWeekTimeLogs.map(timelog => ({
      day: timelog.date.toLocaleDateString('en-US', { weekday: 'long' }),
      timeDuration: timelog.timeSpent,
    }));

    res.status(200).json({ currentWeekStats, previousWeekStats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get monthly stats
const getMonthlyStats = async (req, res) => {
  try {
    const { userId, date } = req.params;

    // Calculate the start date of the current month
    const currentDate = new Date(date);
    const startOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    // Get time logs for the current month
    const currentMonthTimeLogs = await TimeLog.find({
      userId,
      date: { $gte: startOfCurrentMonth, $lte: currentDate },
    });

    // Format the data for the response
    const monthlyStats = currentMonthTimeLogs.map(timelog => ({
      day: timelog.date.getDate(), // Use the day of the month as the identifier
      timeDuration: timelog.timeSpent,
    }));

    res.status(200).json({ monthlyStats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getWeeklyStats,
  getMonthlyStats,
};
