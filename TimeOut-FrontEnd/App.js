import { React, useEffect, useState, useCallback } from 'react';
import Tabs from './src/components/Tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';


//import { LogLevel, OneSignal } from 'react-native-onesignal';


import * as Device from 'expo-device';

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 3000);
const App = () => {
  /**  useEffect(() async =>{
     OneSignal.addSubscriptionObserver(async event => {
   if (event.to.userId) {
     const playerId = event.to.userId;
 
     await setOneSignalPlayerId(playerId);
 
     // Now you have the player ID to send notifications to this device.
     // You can save this player ID to your server for later use.
   }
 });
 
     // OneSignal Initialization
     OneSignal.initialize("21c68586-81f4-4f17-9273-7201e87d64e9");
   
     // requestPermission will show the native iOS or Android notification permission prompt.
     // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
     OneSignal.Notifications.requestPermission(true);
   
     // Method for listening for notification clicks
     OneSignal.Notifications.addEventListener('click', (event) => {
       console.log('OneSignal: notification clicked:', event);
       
     });
   })**/

  useEffect(() => {
    const checkAndSendUUID = async () => {
      try {
        // Check if UUID is already stored in AsyncStorage
        const storedUUID = await AsyncStorage.getItem('deviceId');

        if (!storedUUID) {
          // If UUID is not stored, generate a new one
          const uuid = uuidv4();
          console.log('Generated UUID:', uuid);

          // Save the new UUID to AsyncStorage
          await AsyncStorage.setItem('deviceId', uuid);

          // Send the generated UUID to the backend
          sendToBackend(uuid);
        } else {
          // If UUID is already stored, check if it exists in the backend
          const existsInBackend = await checkIfExistsInBackend(storedUUID);

          if (existsInBackend) {
            console.log('UUID exists in the backend');

          } else {
            // If UUID does not exist in the backend, send it
            sendToBackend(storedUUID);
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const checkIfExistsInBackend = async (uuid) => {
      try {
        const response = await fetch(`https://timeout-api.onrender.com/api/users/${uuid}`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json'
          },
        });


      } catch (error) {
        console.error('Error:', error);
        return false;
      }
    };

    const sendToBackend = async (uuid) => {
      try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const responses = await fetch("https://timeout-api.onrender.com/api/users", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "deviceId": uuid,
            "timezone": timezone
          })
        })



        if (responses.ok) {
          const data = await responses.json();
          console.log(data); // Log the response data to check its structure and contents

          // Extract the _id from the response data
          const userId = data?.user?._id;

          if (userId) {
            // Save the _id in AsyncStorage
            await AsyncStorage.setItem('userId', userId);
            console.log('User ID saved in AsyncStorage:', userId);
          } else {
            console.error('User ID not found in response data');
          }
        } else {
          console.error('Error sending data to the backend');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    // Call the function to check and send UUID
    checkAndSendUUID();

  })



  return (
    <>

      <NavigationContainer>

        <Tabs />
      </NavigationContainer>
      <StatusBar style="auto" />
    </>
  )

}



export default App;