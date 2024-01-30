import React from 'react';
import {View, Text, SafeAreaView, StyleSheet, } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Month from './Month';
import Week from './Week';
import Summary from './Summary';

const Tabs = createMaterialTopTabNavigator();

const Statistics = () => {
  return (
    <SafeAreaView style={styles.background}>
      <Tabs.Navigator screenOptions={{
      tabBarActiveTintColor: {
        color:'white'
      },
      tabBarInactiveTintColor: '#192111',
      tabBarStyle:{
        justifyContent:"center",
        backgroundColor:'#F6F5F3',
        width:'94%',
        height:'6%',
        display:'flex',
        marginLeft:'auto',
        marginRight:'auto',
        marginTop:1,

        
        
        
      },
      tabBarIndicatorStyle: {
        backgroundColor:'#4C5F3A',
        height:'7%',
        position:'absolute'
      },
      tabBarIndicatorContainerStyle:{
        backgroundColor:'#E1E1E1',
        borderRadius:4,
      },
      
      
      
    }}>
          <Tabs.Screen name='Week' component={Week} options={{}}/>
          <Tabs.Screen name='Month' component={Month}/>
          <Tabs.Screen name='Summary' component={Summary}/>
      </Tabs.Navigator>
   </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  background: {
    backgroundColor:'#F6F5F3',
    flex:1
  }
})

export default Statistics