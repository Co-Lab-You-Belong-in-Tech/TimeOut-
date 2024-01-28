const cron = require("node-cron");
const { sendPushNotification } = require("../services/notification");
const User = require("../models/User");
// const { DateTime } = require("luxon");
const TimeLog = require("../models/TimeLog.model");

exports.notificationSchedule = () => {
  // Schedule the notification to be sent every day at 11:30 AM
  cron.schedule("30 11 * * *", async () => {
    try {
      // Get all users
      const users = await User.find();

      // Iterate through each user and check if they have a timelog for the day
      for (const user of users) {
        // Convert user's timezone to a valid IANA timezone
        //   const timezone = user.timezone || "UTC";

        //   // Get the current time in the user's timezone
        //   const currentTime = DateTime.now().setZone(timezone);

        // Check if the user has a timelog for the current day
        const hasTimelogForDay = await TimeLog.exists({
          userId: user._id,
          date: new Date(),
        });

        // If the user doesn't have a timelog, send the notification
        if (!hasTimelogForDay) {
          const notificationContent = "Don't forget to go outside today!";
          const playerId = user.playerId;

          // Send the push notification
          await sendPushNotification({
            content: notificationContent,
            playerId,
          });

          console.log(
            `Push notification sent to user ${user.deviceId} successfully!`
          );
        }
      }
    } catch (error) {
      console.error("Error scheduling or sending push notification:", error);
    }
  });
};
