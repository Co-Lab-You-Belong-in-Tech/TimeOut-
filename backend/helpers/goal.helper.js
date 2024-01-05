const Goal = require("../models/Goal.model");
const TimeLog = require("../models/TimeLog.model");

// Calculate the start date based on the type (weekly or monthly)
exports.calculateStartDate = (type, date) => {
  // Use givenDate if provided, otherwise use the current date
  const currentDate = date ? new Date(date) : new Date();
  if (type === 'weekly') {
    // For weekly goals, set the start date to the first day of the current week
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
  } else if (type === 'monthly') {
    // For monthly goals, set the start date to the first day of the current month
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  }
};

// Helper function to update goal progress based on an array of timelogs
exports.updateGoalProgress = async (userId, date) => {
  try {
    // Find the user's current goal that has a start date lte to the given date
    const currentGoal = await Goal.findOne({ userId, startDate: { $lte: new Date(date) } })
      .sort({ createdAt: -1 });


    if(!currentGoal){
      console.log("No goal exist yet")
    }

    if (currentGoal) {
      // Get all timelogs for the user from the start of the week or month up to the specified date
      const timelogs = await TimeLog.find({
        userId,
        // Filter timelogs based on the goal type and date range
        date: {
          $gte: calculateStartDate(currentGoal.type, date), // Start of the week or month
          $lte: new Date(date), // Specified date
        },
      });

      // Calculate the total time spent by summing up timeSpent from each timelog
      const totalTimeSpent = timelogs.reduce((total, timelog) => total + timelog.timeSpent, 0);

      // Update the goal progress with the calculated total time spent
      currentGoal.progress = totalTimeSpent;

      // Save the updated goal to the database
      await currentGoal.save();
    }
  } catch (error) {
    console.error('Error updating goal progress:', error);
  }
};

// Helper function to calculate progress for weekly goal type
exports.calculateWeeklyProgress = async (userId, startDate, endDate) => {
  try {
    // Get all time logs for the specified date range
    const timelogs = await TimeLog.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    });

    // Calculate the total time spent in minutes
    const totalTimeSpent = timelogs.reduce((total, timelog) => total + timelog.timeSpent, 0);

    return totalTimeSpent;
  } catch (error) {
    throw error;
  }
};

// Helper function to calculate progress for monthly goal type
exports.calculateMonthlyProgress = async (userId, startDate, endDate) => {
  try {
    // Get all time logs for the specified date range
    const timelogs = await TimeLog.find({
      userId,
      date: { $gte: startDate, $lt: endDate },
    });

    // Calculate the total time spent in minutes
    const totalTimeSpent = timelogs.reduce((total, timelog) => total + timelog.timeSpent, 0);

    return totalTimeSpent;
  } catch (error) {
    throw error;
  }
};

// Helper function to handle goal type change without losing data
exports.handleGoalTypeChange = async (currentGoal, userId, newType, target) => {
  try {
    // Calculate progress based on the new goal type
    let progress = 0;

    if (newType === 'weekly') {
      // Calculate progress for weekly goal type
      const startDate = calculateStartDate(newType);
      const endDate = new Date();  // Current date
      progress = await calculateWeeklyProgress(userId, startDate, endDate);
    } else if (newType === 'monthly') {
      // Calculate progress for monthly goal type
      const startDate = calculateStartDate(newType);
      const endDate = new Date();  // Current date
      progress = await calculateMonthlyProgress(userId, startDate, endDate);
    }

    return progress;
  } catch (error) {
    console.log(error)
    throw error;
  }
};


