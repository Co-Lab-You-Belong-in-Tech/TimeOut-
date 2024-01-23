import {React, useEffect} from 'react';
import Tabs from './src/components/Tabs';
import { NavigationContainer} from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import 'react-native-get-random-values';
import { v4 as uuidv4 }from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LogLevel, OneSignal } from 'react-native-onesignal';


import * as Device from 'expo-device';



const App = () => {
  useEffect(()=>{
    // Remove this method to stop OneSignal Debugging
    

    // OneSignal Initialization
    OneSignal.initialize("21c68586-81f4-4f17-9273-7201e87d64e9");
  
    // requestPermission will show the native iOS or Android notification permission prompt.
    // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
    OneSignal.Notifications.requestPermission(true);
  
    // Method for listening for notification clicks
    OneSignal.Notifications.addEventListener('click', (event) => {
      console.log('OneSignal: notification clicked:', event);
    });
  })
  
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

        // Check if the UUID is already in the database
        const checkResponse = await fetch(`https://timeout-api.onrender.com/api/users/${uuid}`, {
          method: 'GET',
        });

        if (checkResponse.ok) {
          // UUID is not in the database, proceed to send it
          const sendResponse = await fetch('https://timeout-api.onrender.com/api/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uuid }),
            
          });
  
          if (sendResponse.ok) {
            console.log('UUID successfully sent to the server');
          } else {
            console.error('Failed to send UUID to the server');
          }
        } else {
          // UUID is already in the database
          console.log('UUID is already in the database');
        }
      } else {
        // If UUID is already stored, log it
        console.log('Stored UUID:', storedUUID);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Call the function to check and send UUID
  checkAndSendUUID();
}, []);

  return (
    <>
    
    <NavigationContainer>
      
      <Tabs/>
    </NavigationContainer>
    <StatusBar style="auto" />
    </>
  )
  
}



export default App;