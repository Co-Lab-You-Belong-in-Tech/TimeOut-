import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Button, TextInput,Image,ScrollView, RefreshControl } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

//import DeviceInfo from 'react-native-device-info';
import 'expo-dev-client';



const Profile = () => {
  //const [deviceId, setdeviceId] = useState('Click Below to get unique ID')
  const [consecutiveDaysWithData, setConsecutiveDaysWithData] = useState(0);
  const [markedDates, setMarkedDates] = useState({});
  const [uuid, setUuid] = useState(null); // State to hold the UUID
  const [name, setName] = useState('');
  const [editing, setEditing] = useState(false); // State to toggle editing mode
  const [newName, setNewName] = useState(''); // State to store the new name
  const [timeLogs, setTimeLogs] = useState([]);
  const [averageTimeSpent, setAverageTimeSpent] = useState(0);

  const [refreshing, setRefreshing] = useState(false);




  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWeeklyStats();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };
  useEffect(() => {

    fetchWeeklyStats();
  }, []);

  const fetchWeeklyStats = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(`https://timeout-api.onrender.com/api/timelogs/${userId}`);
      const responseData = await response.json();
      calculateConsecutiveDays(responseData.timeLogs);

    } catch (error) {
      console.error('Error fetching weekly stats:', error);
    }
  };
  const calculateConsecutiveDays = (timeLogs) => {
    const markedDatesObj = {};
    const processedDatesSet = new Set(); // Maintain a set of processed dates
    let consecutiveDays = 0;
    let currentDate = new Date(); // Start from the current date
    let formattedCurrentDate = currentDate.toISOString().substring(0, 10); // Format it to yyyy-mm-dd

    // Sort the timeLogs by date in descending order
    const descending = timeLogs.sort((a, b) => new Date(b.date) - new Date(a.date));



    let prevDate = null;
    descending.forEach((log) => {



      const logDate = processedDatesSet.add(log.date.substring(0, 10)); // Extract date (yyyy-mm-dd)

      const descendingArray = Array.from(processedDatesSet);
      // Sort the array in descending order
      descendingArray.sort((a, b) => new Date(b) - new Date(a));
      // Now, descendingArray contains the elements of the set in descending order
      // Convert dates to Date objects
      const dateObjects = descendingArray.map(dateStr => new Date(dateStr));
      // Sort dates in descending order
      dateObjects.sort((a, b) => b - a);
      // Create a set to store consecutive dates
      const consecutiveDatesSet = new Set();
      consecutiveDatesSet.add(formatDate(dateObjects[0]))
      let prevDate = dateObjects[0]; // Initialize with the first date
      for (let i = 1; i < dateObjects.length; i++) {
        const currentDate = dateObjects[i];

        // If current date is consecutive with the previous date
        if (isConsecutive(prevDate, currentDate)) {
          consecutiveDatesSet.add(formatDate(currentDate)); // Add the date to the set

        } else {
          break; // Break the loop if the dates are not consecutive
        }
        consecutiveDays = consecutiveDatesSet.size
        prevDate = currentDate;
      }
      // Helper function to check if two dates are consecutive
      function isConsecutive(prevDate, currentDate) {
        const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in one day
        const prevTime = prevDate.getTime();
        const currentTime = currentDate.getTime();
        return (prevTime - currentTime === oneDay);
      }
      // Helper function to format date in yyyy-mm-dd format
      function formatDate(date) {
        return date.toISOString().split('T')[0];
      }
      // Output the set containing consecutive dates
      // Check if the log date is equal to the currentDate
      consecutiveDatesSet.forEach(date => {
        markedDatesObj[date] = { color: '#A9FC02', startingDay: true, endingDay: true, textColor: 'black' };
      });
      prevDate = formattedCurrentDate;
    })

    setConsecutiveDaysWithData(consecutiveDays);
    setMarkedDates(markedDatesObj);
  };

  useEffect(() => {
    // Fetch time logs data from your API
    const fetchTimeLogs = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const response = await fetch(`https://timeout-api.onrender.com/api/timelogs/${userId}`);
        const data = await response.json();
        setTimeLogs(data.timeLogs); // Assuming the API response contains timeLogs array
      } catch (error) {
        console.error('Error fetching time logs:', error);
      }
    };

    fetchTimeLogs();
  }, []);

  useEffect(() => {
    // Calculate average time spent daily when timeLogs data changes
    if (timeLogs.length > 0) {
      let totalTimeSpent = 0;
      let totalDays = 0;

      // Iterate through timeLogs array to calculate total time spent and total days
      timeLogs.forEach(log => {
        totalTimeSpent += log.timeSpent;
        totalDays++;
      });

      // Calculate the average time spent daily
      const averageTime = parseInt(totalTimeSpent / totalDays);
      setAverageTimeSpent(averageTime);
    }
  }, [timeLogs]);

  useEffect(() => {
    // Fetch the user name when the component mounts
    fetchUserName();
  }, []);

  // Function to fetch the user name from AsyncStorage
  const fetchUserName = async () => {
    try {
      const storedName = await AsyncStorage.getItem('userName');
      if (storedName) {
        setName(storedName);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Function to handle changes in the name input field
  const handleNameChange = (text) => {
    setNewName(text);
  };

  // Function to save the updated name to AsyncStorage
  const saveNewName = async () => {
    try {
      await AsyncStorage.setItem('userName', newName);
      setName(newName); // Update the name displayed on the screen
      setEditing(false); // Exit editing mode
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  return (
    <ScrollView
    contentContainerStyle={{ flex: 1 }}
    refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    }
  >
    <SafeAreaView style={{ flex: 1, backgroundColor:'#F6F5F3' }}>
      <View style={{ flex: 1, }}>
        <View style={{ padding: 20, width: "100%", alignItems: 'center' }}>
          <Text style={{ fontSize: 30 }}>Profile</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.wrapper}>
            <View style={styles.radio}>
              <View style={styles.radioBg}></View>
            </View>

          </View>
          <View style={{ alignItems: 'flex-start' }}>
            <Text style={{ fontSize: 20 }}>Welcome, {name ? name : 'Guest'}</Text>

            {editing ? (
              <View >
                <TextInput
                  placeholder="Enter your new name"
                  value={newName}
                  onChangeText={handleNameChange}
                />
                <Button title="Save" onPress={saveNewName} />
              </View>
            ) : (
              <Button title="Edit" onPress={() => setEditing(true)} />
            )}
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 30 }}>
          <View style={{alignItems:'center'}}>
            <Image
              source={require('./Stopwatch(1).png')}
            />
            <Text style={{ fontSize: 20, fontWeight: 500 }}>{averageTimeSpent} mins</Text>
            <Text style={{ fontSize: 15, fontWeight: 300 }}>Daily Average</Text>
          </View>
          <View style={{alignItems:'center'}}>
          <Image
              source={require('../../assets/streak.png')} 
            />
            <Text style={{ fontSize: 20, fontWeight: 500 }}>{consecutiveDaysWithData} days</Text>
            <Text style={{ fontSize: 15, fontWeight: 300 }}>Streak</Text>
          </View>
        </View>
      </View>

    </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F5F3"
  },
  text: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100
  },
  radio: {
    width: 80,
    height: 80,
    borderColor: '#87947B',
    borderRadius: 40,
    borderWidth: 2,
    margin: 10
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  radioBg: {
    backgroundColor: '#87947B',
    height: 70,
    width: 70,
    margin: 3,
    borderRadius: 70
  },
})

export default Profile