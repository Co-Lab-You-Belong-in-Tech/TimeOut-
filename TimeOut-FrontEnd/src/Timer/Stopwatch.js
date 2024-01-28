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
    fontSize: 40,
    marginBottom: 20,
  },
  buttons: {
    flexDirection: 'row',
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