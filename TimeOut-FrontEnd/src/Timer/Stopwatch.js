import React, { useState, useRef, useCallback, useEffect } from "react";
import { StyleSheet, SafeAreaView, Text, View, Platform, Button, Image, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import Result from "./Result";
import Control from "./Control";
import { displayTime } from "./Util";
import { useNavigation } from '@react-navigation/native';
import * as BackgroundFetch from 'expo-background-fetch';
import AsyncStorage from "@react-native-async-storage/async-storage";



export default function StopWatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setRunning] = useState(false);

  useEffect(() => {
    if (isRunning) {
      const intervalId = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000); // Update every second

      return () => clearInterval(intervalId);
    }
  }, [isRunning]);

  // Handle background fetch event
  async function handleBackgroundFetch(taskData) {
    // Update the time when the background task is triggered
    setTime(taskData.expirationTime);
    // Set the task as completed
    await BackgroundFetch.TaskManager.finish(taskData.taskId);
  }

  // Register the background fetch task

  const handleLeftButtonPress = useCallback(async () => {
    setRunning(false);
    setTime(0);
    await saveTimeToStorage()


  }, []);

  const handleStartStop = async () => {
    setRunning(prevState => !prevState);
    await saveDataIfNeeded()
  };

  const handleReset = () => {
    setTime(0);
    setRunning(false);
  };

  const saveDataIfNeeded = async () => {
    try {
      // Check if data exists for 'date' and 'startTime'
      const dateData = await AsyncStorage.getItem('date');
      const startTimeData = await AsyncStorage.getItem('startTime');

      // If data doesn't exist, save current time and date
      if (!dateData) {
        const currentDate = new Date().toISOString().substring(0, 10); // Get current date in YYYY-MM-DD format
        await AsyncStorage.setItem('date', currentDate);
      }

      if (!startTimeData) {
        const currentTime = new Date();
        const hours = currentTime.getHours().toString().padStart(2, '0'); // Ensure two digits for hours
        const minutes = currentTime.getMinutes().toString().padStart(2, '0'); // Ensure two digits for minutes
        const formattedTime = `${hours}:${minutes}`;
        await AsyncStorage.setItem('startTime', formattedTime);
        console.log(formattedTime)
        console.log(currentTime)
      }
      
      // If data exists, do nothing
    } catch (error) {
      console.error('Error saving data:', error);
      console.log(`already exists${startTimeData}`)

    }
  };
  const saveTimeToStorage = async () => {
    try{
    const endTime = new Date();
    const hours = endTime.getHours().toString().padStart(2, '0'); // Ensure two digits for hours
    const minutes = endTime.getMinutes().toString().padStart(2, '0'); // Ensure two digits for minutes
    const formattedTime = `${hours}:${minutes}`;

    const startTime = await AsyncStorage.getItem('startTime');
    const currentDate = await AsyncStorage.getItem('date')

    // Parse the times into hours and minutes
    const [hours1, minutes1] = startTime.split(':').map(Number);
    const [hours2, minutes2] = formattedTime.split(':').map(Number);

    // Convert the times to minutes
    const totalMinutes1 = hours1 * 60 + minutes1;
    const totalMinutes2 = hours2 * 60 + minutes2;

    // Calculate the difference in minutes
    const differenceInMinutes = totalMinutes2 - totalMinutes1;

    console.log(differenceInMinutes)
    const userId = await AsyncStorage.getItem('userId');

    console.log(currentDate);
    // Send data to backend
    const timelogData = {
      userId: userId,
      date: currentDate,
      startTime: startTime,
      timeSpent: differenceInMinutes
    }
    // Implement your logic to send data to the backend
    const timelogResponse = await fetch(`https://timeout-api.onrender.com/api/timelogs/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(timelogData), timeSpent: differenceInMinutes
        });
        if (timelogResponse.ok) {
          console.log('Timelog data posted successfully');
          // Clear selected data
          
        } else {
          console.error('Failed to post timelog data');
        }
      } catch(error){
        console.log(error)
      }
    // Clear start time from storage
    await AsyncStorage.removeItem('startTime');
    await AsyncStorage.removeItem('date');
    console.log(AsyncStorage.getAllKeys())
    
  };

  // Define your sendDataToBackend function to send data to the backend
  const sendDataToBackend = async(date, startTime, timeSpent, userId) => {
    
    console.log(`Sending data to backend - Date: ${date}, StartTime: ${startTime}, TimeSpent: ${timeSpent}, UserId: ${userId}`);
  };



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F6F5F3', }}>
      <View style={styles.container}>
        <Text style={styles.timer}>{formatTime(time)}</Text>
      </View>
      <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 10 }}>
        <View style={styles.buttons}>
          <TouchableOpacity

            onPress={handleLeftButtonPress}
          >
            {isRunning ?
              <View>
                <Image source={require('../../assets/Stop.png')}
                  style={{
                    width: 45,
                    height: 45

                  }} />
              </View>
              :
              <View>

              </View>}

          </TouchableOpacity>
          <TouchableOpacity onPress={handleStartStop} >
            {isRunning ?
              <View >

                <Image source={require('../../assets/Pause.png')}
                  style={{
                    width: 105,
                    height: 105

                  }} />
              </View>
              :
              <View>
                <Image source={require('../../assets/Play-Button.png')}
                  style={{
                    width: 105,
                    height: 105

                  }}
                />
              </View>}</TouchableOpacity>
          <TouchableOpacity
            onPress={handleReset}
          >
            {isRunning ?
              <View>
                <Image source={require('../../assets/Reset.png')}
                  style={{
                    width: 45,
                    height: 45

                  }} />
              </View>
              :
              <View>

              </View>}
          </TouchableOpacity>
        </View>
      </View>

    </SafeAreaView >
  );
}

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const remainingSeconds = seconds % 3600;
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;

  const formattedHours = hours < 10 ? '0' + hours : hours;
  const formattedMins = mins < 10 ? '0' + mins : mins;
  const formattedSecs = secs < 10 ? '0' + secs : secs;

  if (hours > 0) {
    return `${formattedHours}:${formattedMins}.${formattedSecs}`;
  } else {
    return `00:${formattedMins}.${formattedSecs}`;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  timer: {
    fontSize: 90,
    fontWeight: 100,
    color: '#364329',
    marginTop: 150

  },
  buttons: {
    flexDirection: 'row',
    justifyContent: "center",
    alignContent: "center",
    alignItems: 'center',
    bottom: 0
  },
});



/** export default function StopWatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setRunning] = useState(false);
  const timer = useRef(null);
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState(false);
  const [showButton, setShowButton] = useState(true)
  



  const handleLeftButtonPress = useCallback(() => {
    
    clearInterval(timer.current);
    setRunning(false);
    setTime(0);
    
    
  }, []);

  const handleMiddleButtonPress = useCallback(() => {
    if (isRunning) {
      clearInterval(timer.current);
    } else {
      const interval = setInterval(() => {
        setTime((previousTime) => previousTime + 1);
      }, 10);
      timer.current = interval;
    }
    setRunning((previousState) => !previousState);
    navigation.setOptions({
      tabBarVisible: false,
    });
    setShowButton(true)
  }, [isRunning]);

  const handleRightButtonPress = useCallback(() => {
    clearInterval(timer.current);
    setRunning(false);
    setTime(0);
    navigation.setOptions({
      tabBarVisible: true,
    });
  }, [navigation]);

  
return (
    <SafeAreaView style={styles.container}>
        
      <StatusBar style="light" />
    <View style={styles.display}>
        <Text style={styles.displayText}>{displayTime(time)}</Text>
        <Text style={styles.label}>HMS</Text>
    </View>
<View style={styles.control}>
{showButton && (
        <Control
          isRunning={isRunning}
          handleLeftButtonPress={handleLeftButtonPress}
          handleMiddleButtonPress={handleMiddleButtonPress}
          handleRightButtonPress={handleRightButtonPress}
        />
        )}
      </View>

    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F5F3",
    paddingTop: Constants.statusBarHeight,
  },
  display: {
    flex: 3 / 5,
    justifyContent: "center",
    alignItems: "center",
    top:60
  },
  displayText: {
    color: "#364329",
    fontSize: 64,
    fontWeight: "400",
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : null,
  },
  control: {
    
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems:'center',
    top:130
    
    
  },
  result: { flex: 2 / 5 },
  label:{
    justifyContent:'space-between'
  }
});**/