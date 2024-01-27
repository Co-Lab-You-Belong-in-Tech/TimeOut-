import React,{useState, useEffect} from 'react';
import {View, Text, SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native';
import { v4 as uuidv4 }from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

//import DeviceInfo from 'react-native-device-info';
import 'expo-dev-client';



const Profile = () => {
  //const [deviceId, setdeviceId] = useState('Click Below to get unique ID')
  const [uuid, setUuid] = useState(null); // State to hold the UUID

  useEffect(() => {
    const checkAndSendUUID = async () => {
      try {
        // Check if UUID is already stored in AsyncStorage
        const storedUUID = await AsyncStorage.getItem('deviceId');
        console.log(storedUUID)
        setUuid(storedUUID)
      } catch (error) {
        console.error('Error:', error);
      }
    };checkAndSendUUID()
  })
  
  
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.text}>
            <Text >Your deviceID is {uuid}</Text>
  
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F5F3"
  },
  text:{
    justifyContent:'center',
    alignItems:'center',
    marginTop:100
  }
})

export default Profile