const TimeLog = require('../models/TimeLog.model');
// const Statistics = require('../models/Statistics');
const dayjs = require("dayjs");

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
    }).sort("date");

    // Get time logs for the previous week
    const previousWeekTimeLogs = await TimeLog.find({
      userId,
      date: { $gte: startOfPreviousWeek, $lt: startOfCurrentWeek },
    }).sort("date");

    // Sum up time durations for the same day
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // current day of the week
    const curDayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' });

    // Index of the current day of the week
    const dayOfWeekIndex = daysOfWeek.indexOf(curDayOfWeek);

    const sumTimeDurations = (timeLogs) => {
      // The stats of each day is currently set to  0
      const summedStats = Object.fromEntries(daysOfWeek.map(day => [day, 0]));

      // Loop through the time logs and sum up the time durations of each day
      timeLogs.forEach((timelog) => {
        const day = timelog.date.toLocaleDateString('en-US', { weekday: 'long' });
        summedStats[day] += timelog.timeSpent;
      });

      return Object.entries(summedStats).map(([day, timeDuration]) => ({
        day,
        timeDuration,
      }));
    };

    // Format the data for the response
    const currentWeekStats = sumTimeDurations(currentWeekTimeLogs).slice(0, dayOfWeekIndex + 1);
    const previousWeekStats = sumTimeDurations(previousWeekTimeLogs);

    res.status(200).json({ currentWeekStats, previousWeekStats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get monthly stats
const getMonthlyStats = async (req, res) => {
  try {
    const { userId, date } = req.params;

    const currentDate = dayjs(date);
    const startOfCurrentMonth = currentDate.startOf("month");

    // Get time logs for the current month
    const currentMonthTimeLogs = await TimeLog.find({
      userId,
      date: { $gte: startOfCurrentMonth.toDate(), $lte: currentDate.toDate() },
    }).sort("date");

    // Sum up time durations for the same day
    const sumTimeDurations = (timeLogs) => {
      const summedStats = {};

      // Loop through the time logs and sum up the time durations of each day
      timeLogs.forEach((timelog) => {
        const day = dayjs(timelog.date).date();

        if (!summedStats[day]) {
          summedStats[day] = 0;
        }

        summedStats[day] += timelog.timeSpent;
      });

      // Convert the summed stats to the desired response format
      return Object.entries(summedStats).map(([day, timeDuration]) => ({
        day: parseInt(day),
        timeDuration,
      }));
    };

    // Format the data for the response
    const monthlyStats = sumTimeDurations(currentMonthTimeLogs);

    res.status(200).json({ monthlyStats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getWeeklyStats,
  getMonthlyStats,
};
