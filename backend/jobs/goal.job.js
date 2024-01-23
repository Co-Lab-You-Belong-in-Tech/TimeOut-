const cron = require("node-cron");
const { saveAndCreateNewGoal } = require("../controllers/goal.controller");
const Goal = require("../models/Goal.model");
const User = require("../models/User.model");

exports.goalSchedule = () => {
  // Check if it's the end of the week for a given date
  const isEndOfWeek = (date) => date.getDay() === 0; // Assuming Sunday is considered the end of the week

  // Check if it's the end of the month for a given date
  const isEndOfMonth = (date) => {
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    return date.getMonth() !== nextDay.getMonth();
  };

  // Schedule the task to run at the end of each day
  cron.schedule("0 0 * * *", async () => {
    try {
      // Retrieve all users
      const allUsers = await User.find();

      // Iterate through each user
      for (const user of allUsers) {
        // Get the current date
        const currentDate = new Date().toLocaleString('en-US', { timeZone: user.timezone });

        // Implement logic to check if it's the end of the week or month for the user
        const userIsEndOfWeek = isEndOfWeek(currentDate);
        const userIsEndOfMonth = isEndOfMonth(currentDate);

        if (userIsEndOfWeek || userIsEndOfMonth) {
          // Get the user's current goal
          const currentGoal = await Goal.findOne({ userId: user._id }).sort({
            createdAt: -1,
          });

          if (currentGoal) {
            // Save the current week's or month's progress and create a new goal
            await saveAndCreateNewGoal({
              body: { userId: user._id, progress: user.progress },
            });
          }
        }
      }
    } catch (error) {
      console.error("Error in goal job:", error);
    }
  });
};