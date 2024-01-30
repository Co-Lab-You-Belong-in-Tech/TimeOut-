import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, Text, ScrollView, RefreshControl, Dimensions } from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';






const Summary = () => {
  const [consecutiveDaysWithData, setConsecutiveDaysWithData] = useState(0);
  const [markedDates, setMarkedDates] = useState({});
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

      <SafeAreaView style={{ flex: 1, backgroundColor:'#F6F5F3', }}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: 'space-between' }}>
          <View style={{ padding: 20, width: "100%" }}>
            <Text style={{ fontSize: 30 }}>Streaks</Text>
            <Text style={{ fontSize: 15, paddingTop: 15, paddingBottom: 15 }}>Current Streak <Text style={{ fontSize: 25, fontWeight: 500 }}>{consecutiveDaysWithData} days</Text></Text>
            <Calendar
              markingType={'period'}
              markedDates={markedDates}
              style={{ borderRadius: 20 }}

            />
          </View>
        </View>
        
      </SafeAreaView>
    </ScrollView>
  );

};
export default Summary