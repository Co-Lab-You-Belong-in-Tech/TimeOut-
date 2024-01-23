import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";

// we will deal with buttons here
function Control({ isRunning, handleLeftButtonPress, handleMiddleButtonPress, handleRightButtonPress }) {
  return (
    <>
    
      <TouchableOpacity
        
        onPress={handleLeftButtonPress}
      >
        {isRunning ?
        <View>
          <Image source={require('../../assets/Stop.png')}
          style={{
            width:45,
            height: 45
            
          }}/>
        </View>
        :
        <View>
          
        </View>}

      </TouchableOpacity>

      
      <TouchableOpacity
        
        onPress={handleMiddleButtonPress}
      >
        {isRunning ?
        <View >
      
          <Image source={require('../../assets/Pause-Button.png')}
          style={{
            width:105,
            height: 105
            
          }}/>
        </View>
        :
        <View>
          <Image source={require('../../assets/Play-Button.png')}
            style={{
              width:105,
              height: 105
              
            }}
            />
        </View>}
      </TouchableOpacity>
      


<TouchableOpacity
        onPress={handleRightButtonPress}
      >
        {isRunning ?
        <View>
          <Image source={require('../../assets/Reset.png')}
          style={{
            width:45,
            height: 45
            
          }}/>
        </View>
        :
        <View>
          
        </View>}
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