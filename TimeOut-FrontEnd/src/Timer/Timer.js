import React from 'react';
import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Manual from './Manual';
import Stopwatch from './Stopwatch';


const Tabs = createMaterialTopTabNavigator();

const Home = () => {
  return (
    
    <SafeAreaView style={styles.background}>
      
    <Tabs.Navigator screenOptions={{
      tabBarActiveTintColor: '#4C5F3A',
      tabBarInactiveTintColor: '#192111',
      tabBarStyle:{
        justifyContent:"center",
        backgroundColor:'#F6F5F3',
        width:'50%',
        display:'flex',
        marginLeft:'auto',
        marginRight:'auto',
        capitalized: false,
        
      },
      tabBarIndicatorStyle: {
        backgroundColor:'#4C5F3A'
      }
      
    }}>
      <Tabs.Screen name='stopwatch' component={Stopwatch} options={{}}/>
      <Tabs.Screen name='Manual' component={Manual}/>
    </Tabs.Navigator>
    </SafeAreaView>
    
  )
};
const styles = StyleSheet.create({
  background: {
    backgroundColor:'#F6F5F3',
    flex:1
  }, 
  navbar:{
    
    left:'auto',
    right:'auto',
    justifyContent:'center'
  }

})

export default Home;