import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
// we will deal with buttons here
function Control({ isRunning, handleLeftButtonPress, handleMiddleButtonPress, handleRightButtonPress }) {
  return (
    <>
      <TouchableOpacity
        style={[
          styles.controlButtonBorder,
          { backgroundColor: "white" },
        ]}
        onPress={handleLeftButtonPress}
      >
        <View style={styles.controlButton}>
          <Text style={{ color: "#87947B"}}>
            {isRunning ? "Stop" : "Stop"}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.controlButtonBorder,
          { backgroundColor: "#87947B" },
        ]}
        onPress={handleMiddleButtonPress}
      >
        <View style={styles.controlButton}>
          <Text style={{ color: 'white' }}>
            {isRunning ? "Pause" : "Start"}
          </Text>
        </View>
      </TouchableOpacity>
<TouchableOpacity
        style={[
          styles.controlButtonBorder,
          { backgroundColor: "white" },
        ]}
        onPress={handleRightButtonPress}
      >
        <View style={styles.controlButton}>
          <Text style={{ color: "#4C5F3A" }}>
            {isRunning ? "Reset" : "Reset"}
          </Text>
        </View>
      </TouchableOpacity>
    </>
  );
}
const CENTER = {
  justifyContent: "center",
  alignItems: "center",
};
const styles = StyleSheet.create({
  controlButtonBorder: {
    ...CENTER,
    width: 70,
    height: 70,
    borderRadius: 70,
    backgroundColor:'#4C5F3A'
  },
  controlButton: {
    ...CENTER,
    width: 65,
    height: 65,
    borderRadius: 65,
    borderWidth: 1,
    color:'#4C5F3A'
  },
});
export default React.memo(Control);