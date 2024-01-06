import React from 'react';

import Home from '../Timer/Timer';
import Goals from '../Screens/Goals';
import Statistics from '../Statistics/Statistics';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profile from '../Screens/Profile';
import StopWatch from '../Timer/Stopwatch';


const Tab = createBottomTabNavigator()


const Tabs = () => {
  return (
    <Tab.Navigator 
        screenOptions={{
          tabBarActiveTintColor:'#4C5F3A',
          tabBarInactiveTintColor:'#192111',
          headerShown: false
        }}>
          <Tab.Screen name={'Stopwatch'} component={Home} />
          <Tab.Screen name={'Statistics'} component={Statistics}/>
          <Tab.Screen name={'Goals'} component={Goals}/>
          <Tab.Screen name={'Profile'} component={Profile}/>
      </Tab.Navigator>
  )
}

export default Tabs;