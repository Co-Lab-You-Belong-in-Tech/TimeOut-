import * as OneSignal from "@onesignal/node-onesignal";
import "dotenv/config";
import axios from "axios";

const onesignalApiUrl = "https://onesignal.com/api/v1/notifications";
const ONESIGNAL_APP_ID = process.env.ONE_SIGNAL_APP_ID;
const ONESIGNAL_API_KEY = process.env.ONE_SIGNAL_API_KEY;

const app_key_provider = {
  getToken() {
    return ONESIGNAL_API_KEY;
  },
};

const configuration = OneSignal.createConfiguration({ authMethods: { app_key: { tokenProvider: app_key_provider, }, }, });
const client = new OneSignal.DefaultApi(configuration);



const sendPushNotification = ({ content, playerId }) => {
  const headers = {
    "Content-Type": "application/json;charset=utf-8",
    Authorization: `Basic ${ONESIGNAL_API_KEY}`,
  };
  const notificationData = {
    app_id: ONESIGNAL_APP_ID,
    contents: {
      en: content,
    },
    include_player_ids: Array.isArray(playerId) ? playerId : [playerId],
  };

  axios.post(onesignalApiUrl, notificationData, { headers })
    .then((response) => {
      console.log("Push notification sent:", response.data);
    })
    .catch((error) => {
      console.error("Error sending push notification:", error.response);
    })
}
 
const getNotification = async (id) => {
  try {
    if (id) {
      const response = await client.getNotification(ONESIGNAL_APP_ID, id);
      return response;
    }
  } catch (error) {
    // using this to monitor the error from one signal handler const resp = await error.body.text();
    console.log(resp);
  }
};

module.exports = { getNotification, sendPushNotification };