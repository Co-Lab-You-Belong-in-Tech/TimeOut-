import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, TextInput } from 'react-native';
import DatePicker from 'react-native-modern-datepicker';
import { getFormatedDate } from 'react-native-modern-datepicker';
import { View, Button, DateTimePicker, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Manual = () => {
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [openTimePicker, setOpenTimePicker] = useState(false)
  const [openTimeDuration, setOpenTimeDuration] = useState(false)

  const today = new Date();
  const startDate = getFormatedDate(
    today.setDate(today.getDate()),
    "YYYY/MM/DD"
  );
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [startedDate, setStartedDate] = useState("12/12/2023");
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedDuration, setSelectedDuration] = useState("")

  function handleChangeStartDate(propDate) {
    setStartedDate(propDate);
  }
  const handleOnPressDuration = () => {
    setOpenTimeDuration(!openTimeDuration)
  }
  const handleOnPressTime = () => {
    setOpenTimePicker(!openTimePicker)
  }

  //Time Selector Modal
  const [selectedTimeData, setSelectedTimeData] = useState("")
  const TimePickerModal = ({ isVisible, closeModal }) => {
    const [hour, setHour] = useState('');
    const [minute, setMinute] = useState('');
    const [period, setPeriod] = useState('AM');

    const getCurrentTime = () => {
      const currentHour = new Date().getHours();
      const currentMinute = new Date().getMinutes();
      return { currentHour, currentMinute };
    };
    const { currentHour, currentMinute } = getCurrentTime();

    const handleConfirm = () => {
      // Perform any validation or additional logic here
      // For example, check if a valid time is selected
      if (hour !== '' && minute !== '') {
        // Handle the selected time
        const seletectedTimeDataStr = `${hour}:${minute}`
        const selectedTimeStr = `${hour}:${minute} ${period}`;
        setSelectedTime(selectedTimeStr); //
        setSelectedTimeData(seletectedTimeDataStr)
        console.log(`Selected Time: ${hour}:${minute} ${period}`);
      } else {
        console.log('Please enter a valid time');
      }
      closeModal();
    };
    return (
      <Modal animationType="slide" transparent={true} visible={isVisible} >
        {/* Modal Content for TimePicker */}
        {/* Add your second modal content here */}
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.headerText}>Enter Time</Text>
            <View style={styles.timeContainer}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="HH"
                  keyboardType="numeric"
                  maxLength={2}
                  value={hour}
                  onChangeText={text => setHour(text)}
                />
                <Text style={styles.label}>Hours</Text>
              </View>
              <Text style={styles.colon}>:</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="MM"
                  keyboardType="numeric"
                  maxLength={2}
                  value={minute}
                  onChangeText={text => setMinute(text)}
                />
                <Text style={styles.label}>Minutes</Text>
              </View>
              <View style={styles.periodContainer}>
                <TouchableOpacity
                  style={[styles.periodButton, period === 'AM' && styles.selectedPeriodButton]}
                  onPress={() => setPeriod('AM')}>
                  <Text style={styles.periodText}>AM</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.periodButton, period === 'PM' && styles.selectedPeriodButton]}
                  onPress={() => setPeriod('PM')}>
                  <Text style={styles.periodText}>PM</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 20 }}>
              <TouchableOpacity style={styles.confirmButton} onPress={closeModal} >
                <Text style={styles.confirmButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, !((parseInt(hour) >= 0 && parseInt(hour) < 24) && (parseInt(minute) >= 0 && parseInt(minute) < 60)) && styles.disabledButton]}
                onPress={handleConfirm}
                disabled={!((parseInt(hour) >= 0 && parseInt(hour) < 24) && (parseInt(minute) >= 0 && parseInt(minute) < 60))}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </Modal>
    );
  };




  //Time Duration Modal
  const [selectedTimeDurationData, setSelectedTimeDurationData] = useState("")
  const TimeDurationModal = ({ isVisible, closeModal }) => {
    const [hour, setHour] = useState('');
    const [minute, setMinute] = useState('');
    const [period, setPeriod] = useState('AM');

    const handleConfirm = () => {
      // Perform any validation or additional logic here
      // For example, check if a valid time is selected
      if (hour !== '' && minute !== '') {
        // Handle the selected time
        const selectedDurationStr = `${hour}:${minute}`;
        const [selectedHour, selectedMinute] = selectedDurationStr.split(':');

        // Parse the hour and minute components into integers
        const hourValue = parseInt(selectedHour, 10);
        const minuteValue = parseInt(selectedMinute, 10);

        // Calculate the total duration in minutes
        const totalMinutes = hourValue * 60 + minuteValue;
        setSelectedTimeDurationData(totalMinutes)
        setSelectedDuration(selectedDurationStr); //
        console.log(`Selected Time: ${hour}:${minute}`);
      } else if (hour == "" && minute !== '') {
        const selectedDurationStr = `00:${minute}`;
        const selectedDurationStrMin = parseInt(minute);
        setSelectedTimeDurationData(selectedDurationStrMin)
        setSelectedDuration(selectedDurationStr); //

      }
      closeModal();
    };
    return (
      <Modal animationType="slide" transparent={true} visible={isVisible} >
        {/* Modal Content for TimePicker */}
        {/* Add your second modal content here */}
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.headerText}>Enter Duration</Text>
            <View style={styles.timeContainer}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="HH"
                  keyboardType="numeric"
                  maxLength={2}
                  value={hour}
                  onChangeText={text => setHour(text)}
                />
                <Text style={styles.label}>Hours</Text>
              </View>
              <Text style={styles.colon}>:</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="MM"
                  keyboardType="numeric"
                  maxLength={2}
                  value={minute}
                  onChangeText={text => setMinute(text)}
                />
                <Text style={styles.label}>Minutes</Text>
              </View>

            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 20 }}>
              <TouchableOpacity style={styles.confirmButton} onPress={closeModal} >
                <Text style={styles.confirmButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton]}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmButtonText}>OK</Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </Modal>
    );
  };


  const handleOnPressStartDate = () => {
    setOpenStartDatePicker(!openStartDatePicker);
  };
  const handleClearDate = () => {
    // Clear the selected date
    setStartedDate("Today");
    setSelectedStartDate(null);
  };

  //Send time to database




  const handleSubmit = async () => {
    try {
      // Retrieve userId from AsyncStorage
      const userId = await AsyncStorage.getItem('userId');

      // Check if userId exists
      if (userId) {
        const durationInSeconds = selectedDuration * 60;
        // Construct timelog data
        const timelogData = {
          userId: userId,
          date: selectedStartDate,
          startTime: selectedTimeData,
          timeSpent: selectedTimeDurationData

        };
        console.log(timelogData)
        // Post timelog data to the backend
        const timelogResponse = await fetch(`https://timeout-api.onrender.com/api/timelogs/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(timelogData), timeSpent: selectedDuration
        });
        // Check if timelog data was posted successfully
        if (timelogResponse.ok) {
          console.log('Timelog data posted successfully');
          // Clear selected data
          setSelectedStartDate(null);
          setSelectedTime("");
          setSelectedDuration("");
        } else {
          console.error('Failed to post timelog data');
        }
      } else {
        console.error('User ID not found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const checkIfExistsInBackend = async (deviceID) => {
    try {
      const response = await fetch(`https://timeout-api.onrender.com/api/users/user/:id/deviceId/${deviceID}`, {
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
  //Other
  /**const sendToBackend = async (uuid) => {
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
      }).then(res=>res.json())
      .then(data=>{
        console.log(data)
      });
  
      
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  // Call the function to check and send UUID
  checkAndSendUUID();
})**/





  return (
    <SafeAreaView style={{ flex: 1,backgroundColor:'#F6F5F3' }}>

      <View style={{ flex: 1, alignItems: "center" }}>

        <View style={{ width: "100%", paddingHorizontal: 22, marginTop: 40 }}>
          <Text style={{ fontSize: 25, fontWeight: 500 }}>Add Time</Text>
          <View style={styles.dateView}>
            <Text style={styles.dateLabel}>Date</Text>
            <TouchableOpacity

              onPress={handleOnPressStartDate}
            >
              <Text style={{ fontSize: 20 }}>{selectedStartDate || <Text style={{ color: 'grey' }}>Today</Text>}</Text>

            </TouchableOpacity>

          </View>
          <View style={{ width: "100%", marginTop: 40 }}>
            <View style={styles.dateView}>
              <Text style={styles.dateLabels}>Time</Text>
              <TouchableOpacity

                onPress={handleOnPressTime}
              >
                <Text style={{ fontSize: 20 }}>{selectedTime || <Text style={{ color: 'grey' }}>HH:MM</Text>}</Text>

              </TouchableOpacity>

            </View>


          </View>
          <View style={{ width: "100%", marginTop: 40 }}>
            <View style={styles.dateView}>
              <Text style={styles.dateLabels}>Duration</Text>
              <TouchableOpacity

                onPress={handleOnPressDuration}
              >
                <Text style={{ fontSize: 20 }}>{selectedDuration || <Text style={{ color: 'grey' }}>HH:MM</Text>}</Text>

              </TouchableOpacity>

            </View>


          </View>

        </View>

        {/* Create modal for date picker */}


        <Modal
          animationType="slide"
          transparent={true}
          visible={openStartDatePicker}
        >

          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <DatePicker
                mode="calendar"
                maximumDate={startDate}
                startedDate={handleClearDate}
                onDateChanged={handleChangeStartDate}
                onSelectedChange={(date) => setSelectedStartDate(date)}
                options={{
                  backgroundColor: "white",
                  textHeaderColor: "black",
                  textDefaultColor: "black",
                  selectedTextColor: "#FFF",
                  mainColor: "#4C5F3A",
                  textSecondaryColor: "#FFFFFF",
                  borderColor: "white",
                }}
              />
              <View style={{flexDirection:'row', }}>
                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              
              <TouchableOpacity onPress={handleClearDate} style={{marginRight:50}}>
                <Text style={{ color: "black", fontSize:20,  }}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleOnPressStartDate}>
                <Text style={{ color: "black", fontSize:20, }}>Close</Text>
              </TouchableOpacity>
              </View>
              </View>
            </View>

          </View>

        </Modal>
        <TimePickerModal isVisible={openTimePicker} closeModal={handleOnPressTime} />
        <TimeDurationModal isVisible={openTimeDuration} closeModal={handleOnPressDuration} />


        <View style={styles.submitBtn}>
          <TouchableOpacity
            onPress={handleSubmit}
            style={[styles.submitStyle,
            (!selectedStartDate || !selectedTime || !selectedDuration) && styles.disabledButton
            ]}
            disabled={!selectedStartDate || !selectedTime || !selectedDuration}
          >
            <Text style={{ fontSize: 20, color: "white" }}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textHeader: {
    fontSize: 36,
    marginVertical: 60,
    color: "#111",
  },
  dateView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 10,
    borderBottomColor: '#1921114d',
    borderBottomWidth: 1,
    paddingVertical: 5




  },
  dateLabels: {
    marginRight: 8,
    fontSize: 20,
    color: "#111",
  },
  dateLabel: {
    marginRight: 8,
    marginTop: 20,
    color: "#111",
    fontSize: 20,


  },
  textSubHeader: {
    fontSize: 25,
    color: "#111",
  },
  inputBtn: {

    fontSize: 18,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  submitStyle: {
    backgroundColor: "#4C5F3A",
    paddingVertical: 22,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    paddingVertical: 12,
    marginVertical: 16,
    marginBottom: 10,
    height: 50
  },
  submitBtn: {
    justifyContent: "flex-end",
    paddingVertical: 12,
    width: '90%',
    bottom: 0,
    marginBottom: 0,
    flex: 1,

  },
  centeredView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    padding: 35,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    width: 100,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    textAlign: 'center',
    marginRight: 10,

  },
  colon: {
    fontSize: 50,
    marginRight: 10,
    marginBottom: 20
  },
  periodContainer: {

  },
  periodButton: {
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: '#87947B',
  },
  selectedPeriodButton: {
    backgroundColor: '#87947B1C',
  },
  periodText: {
    color: '#192111',
    fontSize: 16,
  },
  confirmButton: {

    margin:20,
    fontSize:50,

    opacity: 1,
  },
  confirmButtonText: {
    color: '#4C5F3A',
    fontSize: 25,
  },
  disabledButton: {
    backgroundColor: '#ccc', // Change the color for the disabled state
    opacity: 0.5, // Reduce the opacity to indicate that the button is disabled
  },
});

export default Manual;
