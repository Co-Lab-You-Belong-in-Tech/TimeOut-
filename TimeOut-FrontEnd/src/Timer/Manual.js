import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
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

  function handleChangeStartDate(propDate) {
    setStartedDate(propDate);
  }
  const handleOnPressDuration = () => {
    setOpenTimeDuration(!openTimeDuration)
  }
  const handleOnPressTime = () => {
    setOpenTimePicker(!openTimePicker)
  }
  const TimePickerModal = ({ isVisible, closeModal }) => {
    return (
      <Modal animationType="slide" transparent={true} visible={isVisible}>
        {/* Modal Content for TimePicker */}
        {/* Add your second modal content here */}
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>TimePicker Modal Content</Text>
            <Button title="Close TimePicker Modal" onPress={closeModal} />
          </View>
        </View>
      </Modal>
    );
  };
  const TimeDurationModal = ({ isVisible, closeModal }) => {
    return (
      <Modal animationType="slide" transparent={true} visible={isVisible}>
        {/* Modal Content for TimePicker */}
        {/* Add your second modal content here */}
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>TimePicker Modal Content</Text>
            <Button title="Close TimePicker Modal" onPress={closeModal} />
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
  return (
    <SafeAreaView style={{ flex: 1 }}>

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
                <Text style={{ fontSize: 20 }}>{selectedStartDate || <Text style={{ color: 'grey' }}>HH:MM</Text>}</Text>

              </TouchableOpacity>

            </View>


          </View>
          <View style={{ width: "100%", marginTop: 40 }}>
            <View style={styles.dateView}>
              <Text style={styles.dateLabels}>Duration</Text>
              <TouchableOpacity

                onPress={handleOnPressDuration}
              >
                <Text style={{ fontSize: 20 }}>{selectedStartDate || <Text style={{ color: 'grey' }}>HH:MM</Text>}</Text>

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

              <TouchableOpacity onPress={handleOnPressStartDate}>
                <Text style={{ color: "black" }}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleClearDate}>
                <Text style={{ color: "black" }}>Clear</Text>
              </TouchableOpacity>
            </View>

          </View>

        </Modal>
        <TimePickerModal isVisible={openTimePicker} closeModal={handleOnPressTime} />
        <TimeDurationModal isVisible={openTimeDuration} closeModal={handleOnPressDuration} />


        <View style={styles.submitBtn}>
          <TouchableOpacity
            onPress={() => console.log("Subimit data")}
            style={styles.submitStyle}
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
});

export default Manual;
