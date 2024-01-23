import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import Home from '../Timer/Timer';
import Goals from '../Screens/Goals';
import Statistics from '../Statistics/Statistics';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profile from '../Screens/Profile';
import StopWatch from '../Timer/Stopwatch';
import { TabBarIndicator } from 'react-native-tab-view';


const Tab = createBottomTabNavigator()


const Tabs = () => {
  return (
    <Tab.Navigator 
        screenOptions={{
          tabBarActiveTintColor:'#4C5F3A',
          tabBarInactiveTintColor:'#192111',
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIndicatorStyle: {
            backgroundColor:'#4C5F3A',
            
          }, 
          TabBarIndicator:true
        }}>
          <Tab.Screen 
            name='Stopwatch' 
            component={Home}
            options={{
              tabBarIcon:({focused}) => (
                <View style={{alignItems:'center', justifyContent:'center'}}>
                  <Image 
                    source={require('../../assets/Stopwatch.png')}
                    resizeMode="contain"
                    style={{
                      width:20,
                      height: 20,
                      tintColor: focused ? '#4C5F3A' : 'grey',
                    }}
                  />
                  <Text
                  style={{color: focused? '#4C5F3A' : 'grey', fontSize:14}}>
                    Stopwatch</Text>
                </View>
              )
            }} />
          <Tab.Screen 
          name={'Statistics'} 
          component={Statistics}
          options={{
            tabBarIcon:({focused}) => (
              <View style={{alignItems:'center', justifyContent:'center'}}>
                <Image 
                  source={require('../../assets/Statistics.png')}
                  resizeMode="contain"
                  style={{
                    width:20,
                    height: 20,
                    tintColor: focused ? '#4C5F3A' : 'grey',
                  }}
                />
                <Text
                style={{color: focused? '#4C5F3A' : 'grey', fontSize:14}}>
                  Statistics</Text>
              </View>
            )
          }}
          />
          <Tab.Screen 
          name={'Goals'} 
          component={Goals}
          options={{
            tabBarIcon:({focused}) => (
              focused ?
              <View style={{alignItems:'center', justifyContent:'center'}}>
                
                <Image 
                  source={require('../../assets/Goals-Focused.png')}
                  resizeMode="contain"
                  style={{
                    width:20,
                    height: 20
                    
                  }}
                /> 
                <Text
                style={{color: focused? '#4C5F3A' : 'grey', fontSize:14}}>
                  Goals</Text>
              </View>
              :
              <View style={{alignItems:'center', justifyContent:'center'}}>
              <Image 
              source={require('../../assets/Goals.png')}
              resizeMode="contain"
              style={{
                width:20,
                height: 20
                
              }}
            /> 
            <Text
            style={{color: focused? '#4C5F3A' : 'grey', fontSize:14}}>
              Goals</Text>
              </View>
            )
          }}
          />
          <Tab.Screen 
          name={'Profile'} 
          component={Profile}
          options={{
            tabBarIcon:({focused}) => (
              focused ?
              <View style={{alignItems:'center', justifyContent:'center'}}>
                
                <Image 
                  source={require('../../assets/Profile-Focused.png')}
                  resizeMode="contain"
                  style={{
                    width:20,
                    height: 20
                    
                  }}
                /> 
                <Text
                style={{color: focused? '#4C5F3A' : 'grey', fontSize:14}}>
                  Profile</Text>
              </View>
              :
              <View style={{alignItems:'center', justifyContent:'center'}}>
              <Image 
              source={require('../../assets/Profile.png')}
              resizeMode="contain"
              style={{
                width:20,
                height: 20
                
              }}
            /> 
            <Text
            style={{color: focused? '#4C5F3A' : 'grey', fontSize:14}}>
              Profile</Text>
              </View>
            )
          }}
          />
      </Tab.Navigator>
  )
}

export default Tabs;