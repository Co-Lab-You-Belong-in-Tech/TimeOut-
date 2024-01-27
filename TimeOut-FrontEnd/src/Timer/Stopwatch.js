import  React, { useState, useRef, useCallback, useEffect } from "react";
import { StyleSheet, SafeAreaView, Text, View, Platform, Button } from "react-native";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import Result from "./Result";
import Control from "./Control";
import { displayTime } from "./Util";
import { useNavigation } from '@react-navigation/native';
import * as BackgroundFetch from 'expo-background-fetch';



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
  useEffect(() => {
    async function registerBackgroundTask() {
      await BackgroundFetch.registerTaskAsync('backgroundTimer', {
        minimumInterval: 1, // Minimum interval in seconds
        stopOnTerminate: false, // Continue background task even if the app is terminated
        startOnBoot: true, // Start the task when the device boots
      });
    }

    registerBackgroundTask();

    // Subscribe to background fetch events
    const fetchSubscription = BackgroundFetch.addFetchListener(handleBackgroundFetch);

    return () => {
      fetchSubscription.remove();
    };
  }, []);

  const handleStartStop = () => {
    setRunning(prevState => !prevState);
  };

  const handleReset = () => {
    setTime(0);
    setRunning(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{formatTime(time)}</Text>
      <View style={styles.buttons}>
        <Button title={isRunning ? 'Stop' : 'Start'} onPress={handleStartStop} />
        <Button title="Reset" onPress={handleReset} />
      </View>
    </View>
  );
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timer: {
    fontSize: 40,
    marginBottom: 20,
  },
  buttons: {
    flexDirection: 'row',
  },
});