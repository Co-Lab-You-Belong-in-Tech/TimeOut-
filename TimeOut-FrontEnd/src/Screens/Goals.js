import React, { useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Modal, Button, TextInput } from 'react-native';


const Goals = () => {
  const [selectedRadio, setSelectedRadio] = useState(null);
  const [openTimeDuration, setOpenTimeDuration] = useState(false)
  const [selectedDuration, setSelectedDuration] = useState("")


  const handleOnPressDuration = () => {
    setOpenTimeDuration(!openTimeDuration)
  }

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
        setSelectedDuration(selectedDurationStr); //
        console.log(`Selected Time: ${hour}:${minute}`);
      } else if (hour == "" && minute !== '') {
        const selectedDurationStr = `00:${minute}`;
        setSelectedDuration(selectedDurationStr); //

      }
      closeModal();
    };


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

  return (

    <SafeAreaView style={{ flex: 1,backgroundColor:'#F6F5F3' }}>
      <View style={{ flex: 1, alignItems: "center" }}>
        <View style={{ padding: 20, width: "100%"}}>
          <Text style={{ fontSize: 34, fontWeight: 300 }}>
            Set your goal
          </Text>
          <Text style={{ fontSize: 17, marginTop: 10 }}>
            Choose your schedule & track progress
          </Text>
          <TouchableOpacity style={styles.weekly} onPress={() => setSelectedRadio(1)}>
            <View style={styles.wrapper}>
              <View style={styles.radio}>
                {selectedRadio == 1 ? <View style={styles.radioBg}></View> : null}
              </View>

              <Text style={{ fontSize: 20 }}>Weekly</Text>

            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.weekly} onPress={() => setSelectedRadio(2)}>
            <View style={styles.wrapper}>
              <View style={styles.radio}>
                {selectedRadio == 2 ? <View style={styles.radioBg}></View> : null}
              </View>
              <Text style={{ fontSize: 20 }}>Monthly</Text>

            </View>
          </TouchableOpacity>

          <View style={{ width: "100%" }}>
            <View style={styles.dateView}>
              <Text style={styles.dateLabels}>Goal</Text>
              <TouchableOpacity

                onPress={handleOnPressDuration}
              >
                <Text style={{ fontSize: 20 }}>{selectedDuration || <Text style={{ color: 'grey' }}>HH:MM</Text>}</Text>

              </TouchableOpacity>

            </View>




          </View>

        </View>
        <View style={styles.submitBtn}>
          <TouchableOpacity
            style={styles.submitStyle}
          >
            <Text style={{ fontSize: 20, color: "white" }}>Submit</Text>
          </TouchableOpacity>
        </View>
        <TimeDurationModal isVisible={openTimeDuration} closeModal={handleOnPressDuration} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F5F3",
    alignItems: 'center'

  },
  text: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100
  },
  radio: {
    width: 30,
    height: 30,
    borderColor: 'black',
    borderRadius: 15,
    borderWidth: 2,
    margin: 10
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  radioBg: {
    backgroundColor: '#87947B',
    height: 20,
    width: 20,
    margin: 3,
    borderRadius: 20
  },
  weekly: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 20
  },
  dateView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',


    paddingVertical: 5,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 20,
    padding: 10,
    height: 50





  },
  dateLabels: {
    marginRight: 8,
    fontSize: 20,
    color: "#111",
    fontWeight: 300
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
    backgroundColor: '#3498db',
  },
  selectedPeriodButton: {
    backgroundColor: '#2980b9',
  },
  periodText: {
    color: 'white',
    fontSize: 16,
  },
  confirmButton: {

    margin:20,


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
})

export default Goals