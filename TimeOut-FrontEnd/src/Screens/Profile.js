import React,{useState, useEffect} from 'react';
import {View, Text, SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native';
import { v4 as uuidv4 }from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';

//import DeviceInfo from 'react-native-device-info';
import 'expo-dev-client';



const Profile = () => {
  //const [deviceId, setdeviceId] = useState('Click Below to get unique ID')
  useEffect(() => {
    const generateAndSaveUUID = async () => {
      try {
        // Check if UUID is already stored in AsyncStorage
        const storedUUID = await AsyncStorage.getItem('deviceId');

        if (!storedUUID) {
          // If UUID is not stored, generate a new one
          const uuid = uuidv4();
          console.log('Generated UUID:', uuid);

          // Save the new UUID to AsyncStorage
          await AsyncStorage.setItem('deviceId', uuid);
        } else {
          // If UUID is already stored, log it
          console.log('Stored UUID:', storedUUID);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    // Call the function to generate and save UUID
    generateAndSaveUUID();
  }, []);
  
  const [unuqueId, setUniqueId] = useState()
  const save = async() =>{
    try{
      await AsyncStorage.setItem('deviceId', uuid)
    } catch(err){
      alert(err)
    }
  }
  const displayData = async()=>{
    try{
      let user = await AsyncStorage.getItem('deviceId')
      alert(user)
    } catch(error){
      alert(error)
    }
  }

  let showId =  AsyncStorage.getItem('deviceId')


  //let uniqueId = DeviceInfo.getUniqueId();
  let uuid = uuidv4();
  console.log(uuid)
  
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.text}>
            <Text >Your unique ID is {uuid}</Text>
            <TouchableOpacity onPress={()=>save()}>
              <Text>Save my UUID</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>displayData()}>
              <Text>display my UUID </Text>
            </TouchableOpacity>
  
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