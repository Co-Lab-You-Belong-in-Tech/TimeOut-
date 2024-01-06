import React, {useState} from 'react';
import { SafeAreaView, Text, StyleSheet} from 'react-native';

import { DatePickerOptions } from '@react-native-community/datetimepicker';
import { View, Button, DateTimePicker, Modal } from 'react-native';

const Manual = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const showTimePicker = () => {
    setTimePickerVisible(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisible(false);
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
    hideTimePicker();
  };

  return (
    <View>
      <Button title="Select Date" onPress={showDatePicker} />
      <Text>Selected Date: {selectedDate.toDateString()}</Text>
      <Modal visible={isDatePickerVisible} animationType="slide">
        <View>
          <DatePickerOptions date={selectedDate} onDateChange={handleDateChange} />
          <Button title="Done" onPress={hideDatePicker} />
        </View>
      </Modal>

      <Button title="Select Time" onPress={showTimePicker} />
      <Text>Selected Time: {selectedTime.toLocaleTimeString()}</Text>
      <Modal visible={isTimePickerVisible} animationType="slide">
        <View>
          <DateTimePicker date={selectedTime} onDateChange={handleTimeChange} />
          <Button title="Done" onPress={hideTimePicker} />
        </View>
      </Modal>
    </View>
  );
};

export default Manual;