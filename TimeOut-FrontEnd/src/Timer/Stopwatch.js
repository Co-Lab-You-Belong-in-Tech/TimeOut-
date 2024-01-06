import  React, { useState, useRef, useCallback, useEffect } from "react";
import { StyleSheet, SafeAreaView, Text, View, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import Result from "./Result";
import Control from "./Control";
import { displayTime } from "./Util";
import { useNavigation } from '@react-navigation/native';


export default function StopWatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setRunning] = useState(false);
  const timer = useRef(null);
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState(false);
  const [showButton, setShowButton] = useState(true)
  



  const handleLeftButtonPress = useCallback(() => {
    
    clearInterval(timer.current);
    setRunning(false);
    setTime(0);
    
    
  }, []);

  const handleMiddleButtonPress = useCallback(() => {
    if (isRunning) {
      clearInterval(timer.current);
    } else {
      const interval = setInterval(() => {
        setTime((previousTime) => previousTime + 1);
      }, 10);
      timer.current = interval;
    }
    setRunning((previousState) => !previousState);
    navigation.setOptions({
      tabBarVisible: false,
    });
    setShowButton(true)
  }, [isRunning]);

  const handleRightButtonPress = useCallback(() => {
    clearInterval(timer.current);
    setRunning(false);
    setTime(0);
    navigation.setOptions({
      tabBarVisible: true,
    });
  }, [navigation]);

  
return (
    <SafeAreaView style={styles.container}>
        
      <StatusBar style="light" />
    <View style={styles.display}>
        <Text style={styles.displayText}>{displayTime(time)}</Text>
        <Text style={styles.label}>HMS</Text>
    </View>
<View style={styles.control}>
{showButton && (
        <Control
          isRunning={isRunning}
          handleLeftButtonPress={handleLeftButtonPress}
          handleMiddleButtonPress={handleMiddleButtonPress}
          handleRightButtonPress={handleRightButtonPress}
        />
        )}
      </View>

    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F5F3",
    paddingTop: Constants.statusBarHeight,
  },
  display: {
    flex: 3 / 5,
    justifyContent: "center",
    alignItems: "center",
  },
  displayText: {
    color: "#364329",
    fontSize: 64,
    fontWeight: "400",
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : null,
  },
  control: {
    height: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    bottom:0
  },
  result: { flex: 2 / 5 },
  label:{
    justifyContent:'space-between'
  }
});
