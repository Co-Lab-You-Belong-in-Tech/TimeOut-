import React, {useState} from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Modal, Button } from 'react-native';


const Goals = () => {
  const [selectedRadio, setSelectedRadio] = useState(null);
  const [openTimeDuration, setOpenTimeDuration] = useState(false)

  const handleOnPressDuration = () => {
    setOpenTimeDuration(!openTimeDuration)
  }

  const TimeDurationModal = ({ isVisible, closeModal }) => {
    return (
      <Modal animationType="slide" transparent={true} visible={isVisible}>
        {/* Modal Content for TimePicker */}
        {/* Add your second modal content here */}
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>TimePicker Modal Content</Text>
            <Button title="Close TimePicker Modal" onPress={closeModal} />
          </View>
        </View>
      </Modal>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 34, fontWeight: 300 }}>
          Set your goal
        </Text>
        <Text style={{ fontSize: 17, marginTop: 10 }}>
          Choose your schedule & track progress
        </Text>
        <TouchableOpacity style={styles.weekly} onPress={()=>setSelectedRadio(1)}>
          <View style={styles.wrapper}>
            <View style={styles.radio}>
              {selectedRadio==1? <View style={styles.radioBg}></View>:null}
            </View>

            <Text style={{fontSize:20}}>Weekly</Text>

          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.weekly} onPress={()=>setSelectedRadio(2)}>
          <View style={styles.wrapper}>
            <View style={styles.radio}>
            {selectedRadio==2? <View style={styles.radioBg}></View>:null}
              </View>
            <Text style={{fontSize:20}}>Monthly</Text>

          </View>
        </TouchableOpacity>
        
        <View style={{ width: "100%"}}>
            <View style={styles.dateView}>
              <Text style={styles.dateLabels}>Goal</Text>
              <TouchableOpacity

                onPress={handleOnPressDuration}
              >
                <Text style={{ fontSize: 20 }}>{<Text style={{ color: 'grey' }}>HH:MM</Text>}</Text>

              </TouchableOpacity>

            </View>


          </View>
          </View>
          <TimeDurationModal isVisible={openTimeDuration} closeModal={handleOnPressDuration} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F5F3",

  },
  text: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100
  },
  radio: {
    width: 30,
    height: 30,
    borderColor: 'black',
    borderRadius: 15,
    borderWidth: 2,
    margin: 10
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  radioBg: {
    backgroundColor: '#87947B',
    height: 20,
    width: 20,
    margin: 3,
    borderRadius: 20
  },
  weekly:{
    borderColor:'black',
    borderWidth:1,
    borderRadius:5,
    marginTop:20
  },
  dateView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
   
    
    paddingVertical: 5,
    borderColor:'black',
    borderWidth:1,
    borderRadius:5,
    marginTop:20,
    padding:10,
    height:50
  




  },
  dateLabels: {
    marginRight: 8,
    fontSize: 20,
    color: "#111",
    fontWeight:300
  },
  centeredView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    padding: 35,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
})

export default Goals