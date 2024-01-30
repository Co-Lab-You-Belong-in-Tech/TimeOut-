import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, Text, Dimensions, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Rect, Text as TextSVG, Svg } from "react-native-svg";


const Week = () => {
  const [chartData, setChartData] = useState([]);
  const [previousWeekChartData, setPreviousWeekChartData] = useState([])
  const [loading, setLoading] = useState(true);
  const [dataExists, setDataExists] = useState(false); // State to track if data exists
  const [refreshing, setRefreshing] = useState(false); // State variable to track refresh status

  // Function to handle refresh action
  const onRefresh = async () => {
    setRefreshing(true); // Set refreshing to true to show the loading indicator
    await fetchDataFromAPI();
    // Simulate a delay before resetting refreshing state
    setTimeout(() => {
      setRefreshing(false); // Set refreshing to false when the operation is complete
    }, 2000); // Adjust the delay time as needed
  };

  useEffect(() => {
    checkDataExistence(); // Check if data exists for the userId
  }, []);

  const checkDataExistence = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(`https://timeout-api.onrender.com/api/stats/${userId}`);
      const data = await response.json();
      console.log(data)
      setDataExists(data); // Check if data array has any elements
    } catch (error) {
      console.error('Error checking data existence:', error);
    }

  };

  useEffect(() => {
    if (dataExists) {
      fetchDataFromAPI(); // Fetch data if it exists for the userId
      retrievePreviousWeekData()
    } else {
      setLoading(false); // Set loading to false if no data exists
    }
  }, [dataExists]);

  const retrievePreviousWeekData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(`https://timeout-api.onrender.com/api/stats/${userId}`);
      const responseData = await response.json();
      // Extract the required data for the chart
      console.log(responseData)
      const previousWeekStats = responseData.weeklyStats.previousWeekStats;
      console.log(previousWeekStats)
      // Check if previousWeekStats is defined and is an array
      if (previousWeekStats && Array.isArray(previousWeekStats)) {
        // Map the previous week stats to the format expected by your chart
        const previousWeekChartData = previousWeekStats.map(item => ({
          x: item.day,
          y: parseInt(item.timeDuration)
        }));

        // Check for invalid time duration values
        if (previousWeekChartData.some(item => isNaN(item.y))) {
          console.error('Invalid time duration values:', previousWeekStats);
        } else {
          // Set the previous week chart data state
          setPreviousWeekChartData(previousWeekChartData);
          console.log('Previous week data:', previousWeekChartData);
        }
      } else {
        console.error('Invalid data structure:', responseData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const fetchDataFromAPI = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(`https://timeout-api.onrender.com/api/stats/${userId}`);
      const responseData = await response.json();
      console.log(responseData.weeklyStats.currentWeekStats)
      // Extract the current week stats from the weeklyStats object
      const currentWeekStats = responseData.weeklyStats.currentWeekStats;
      console.log(currentWeekStats)
      // Check if currentWeekStats is defined and is an array
      if (currentWeekStats && Array.isArray(currentWeekStats)) {
        // Map the current week stats to the format expected by your chart
        const chartData = currentWeekStats.map(item => ({
          x: item.day,
          y: parseInt(item.timeDuration)
        }));

        // Check for invalid time duration values
        if (chartData.some(item => isNaN(item.y))) {
          console.error('Invalid time duration values:', currentWeekStats);
        } else {
          // Set the chart data state for the current week
          setChartData(chartData);
          console.log('Current week data:', chartData);
        }
      } else {
        console.error('Invalid data structure:', responseData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const [totalWeekTime, setTotalWeekTime] = useState('');

  const totalTime = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(`https://timeout-api.onrender.com/api/stats/${userId}`);
      const responseData = await response.json();
      
      // Extract the total weekly time in seconds
      const weeklyTotalTimeMinutes = responseData.weeklyStats.currentWeekTotal;
      const hours = Math.floor(weeklyTotalTimeMinutes / 60);
      const minutes = weeklyTotalTimeMinutes % 60;

      // Format the total weekly time
      let formattedTotalWeekTime = '';
      if (hours > 0) {
        formattedTotalWeekTime += `${hours}h `;
      }
      formattedTotalWeekTime += `${minutes}min`;

      // Update the state with the formatted total weekly time
      setTotalWeekTime(formattedTotalWeekTime);
    } catch (error) {
      console.error('Error fetching total weekly time:', error);
    }
  };


  useEffect(() => {
    totalTime();
  }); // Empty dependency array ensures useEffect runs only once


  let [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, visible: false, legend: " ", value: 0 })


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
        <View style={{ flex: 1 }}>
          <View style={{ padding: 20, width: "100%" }}>
            <Text>Progress</Text>
            <LineChart

              data={{
                labels: chartData.map(item => item.x), // X-axis labels
                datasets: [
                  {
                    data: chartData.map(item => item.y),
                    color: (opacity = 0) => `#A9FC02`,
                    legend: 'this week'
                  },
                  {
                    data: previousWeekChartData.map(item => item.y),
                    color: (opacity = 0) => `#87947B`,
                    legend: 'last week'
                  }], legend: ['this week', 'last week']
              }}
              width={Dimensions.get('window').width}
              flex={true}
              height={220}
              chartConfig={{
                backgroundColor: '#F6F5F3',
                backgroundGradientFrom: '#F6F5F3',
                backgroundGradientTo: '#F6F5F3',
                // Set the number of decimal places for Y-axis values
                color: (opacity = 0) => `rgba(0, 0, 0, ${opacity})`,
                yAxisLabel: '',
                style: {
                  borderRadius: 16,
                  width: Dimensions.get('screen').width,
                  justifyContent: 'center'
                },
              }}
              // hide the grid behind chart
              withHorizontalLabels={false} // hide horizontal labels
              withVerticalLines={false}


              // Smooth line chart
              style={{
                marginVertical: 8,
                borderRadius: 16,
                paddingRight: 10,

              }}

              

            />

          </View>

        </View>
        <View style={{ bottom: 16, marginBottom: 0, flex: 1, justifyContent: "flex-end", padding: 20, width: "100%" }}>
          <Text style={{fontSize:30}}>{totalWeekTime}</Text>
          <LineChart

            data={{
              labels: chartData.map(item => item.x), // X-axis labels
              datasets: [
                {
                  data: chartData.map(item => item.y),
                  color: (opacity = 1) => `#87947B`,
                  legend: 'this week'
                },
              ]
            }}
            width={Dimensions.get('screen').width}
            height={220}
            chartConfig={{
              backgroundColor: '#F6F5F3',
              backgroundGradientFrom: '#F6F5F3',
              backgroundGradientTo: '#F6F5F3',
              // Set the number of decimal places for Y-axis values
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            withHorizontalLabels={false} // hide horizontal labels
            withVerticalLines={false}
            
            // Smooth line chart
            style={{
              marginVertical: 8,
              borderRadius: 16,
              paddingRight: 10,

            }}
            decorator={() => {
              return tooltipPos.visible ? <View>
                <Svg
                height="100" width="100"
                >
                  <Rect x={tooltipPos.x - 15}
                    y={tooltipPos.y + 10}
                    width="85"
                    height="30"
                    fill="white"
                    shadow={{
                      shadowColor: 'black',
                      shadowOffset: { width: 2, height: 2 },
                      shadowOpacity: 0.5,
                      shadowRadius: 5,
                    }}
                     />
                  <TextSVG
                    x={tooltipPos.x + 5}
                    y={tooltipPos.y + 30}
                    fill="black"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="right">
                    {tooltipPos.value}
                    
                  </TextSVG>
                </Svg>
              </View> : null
            }}
            onDataPointClick={(data) => {
              const totalMinutes = data.value; // Assuming data.value represents total time in minutes
          
              // Calculate hours and remaining minutes
              const hours = Math.floor(totalMinutes / 60);
              const minutes = totalMinutes % 60;
          
              // Construct the time string
              const timeString = `${hours}h ${minutes}min`;
          
              let isSamePoint = (tooltipPos.x === data.x && tooltipPos.y === data.y);
          
              isSamePoint
                  ? setTooltipPos((previousState) => {
                      return {
                          ...previousState,
                          value: timeString, // Set the time string as the tooltip value
                          visible: !previousState.visible
                      }
                  })
                  : setTooltipPos({
                      x: data.x,
                      value: timeString, // Set the time string as the tooltip value
                      y: data.y,
                      legend: data.legend,
                      visible: true
                  });
          }}
          />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}


export default Week