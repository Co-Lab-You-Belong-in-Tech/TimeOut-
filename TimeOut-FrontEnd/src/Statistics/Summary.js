import React,{useState,useEffect} from 'react';
import {View, SafeAreaView, Text, ScrollView, RefreshControl} from 'react-native';
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

  console.log(`current date:${formattedCurrentDate}`)
    // Sort the timeLogs by date in descending order
    const descending = timeLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
  
   let prevDate = null; 
    descending.forEach((log) =>  {
      
      
        const logDate = processedDatesSet.add(log.date.substring(0, 10)); // Extract date (yyyy-mm-dd)
      
        // Check if the log date is equal to the currentDate

        const datesArray = Array.from(processedDatesSet).sort();
        console.log(datesArray)

        if (prevDate && !isNextDay(prevDate, formattedCurrentDate)) {
          return
        } 
          markedDatesObj[formattedCurrentDate] = { marked: true, dotColor: 'red' }; // Mark the date
          processedDatesSet.add(formattedCurrentDate); // Add the date to the set
          consecutiveDays++;
  
          prevDate = currentDate;
        
    })
console.log(markedDatesObj)
console.log(processedDatesSet)
    setConsecutiveDaysWithData(consecutiveDays);
    setMarkedDates(markedDatesObj);
};
const isNextDay = (prevDate, formattedCurrentDate) => {
  const prev = new Date(prevDate);
  const current = new Date(formattedCurrentDate);
  prev.setDate(prev.getDate() +1); // Increment previous date by one day
  return current.getTime()=== prev.getTime() ;
};

return (
    <View>
        <Text>Consecutive Days with Data: {consecutiveDaysWithData}</Text>
        <Calendar
            markedDates={markedDates}
            
        />
    </View>
);

};
export default Summary