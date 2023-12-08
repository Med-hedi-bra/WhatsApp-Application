import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {  ImageBackground, StyleSheet, Text, View,TouchableOpacity } from 'react-native';
import { Button,TextInput } from 'react-native-paper';
import firebase from '../config';
export default function Auth({navigation}) {
    const [email, setEmail] = useState(''); // mohamedhedibra8@gmail.com or balkys@gmail.com  or hamza@gmail.com
    const [pwd,setPwd] = useState('123456');
    const auth = firebase.auth()
    const database = firebase.database();
const ref_profils = database.ref("Profils");
  return (
    <ImageBackground 
      source={require("../assets/img.jpg")}
      style={styles.container}
      >
        <View
        style={{
            width: "90%",
            height: 350,
            borderRadius: 20,
            backgroundColor:'#0003',
            alignItems: 'center',
            justifyContent: 'center',
        }}
        >
        <Text 
        style={{
            fontSize: 32,
            color: "white",
            fontFamily: "sans-serif",
            fontWeight: "bold",
            marginBottom: 15,
        }}
        >
      Authentification</Text>
      <TextInput onChangeText={email => setEmail(email)}
         style={styles.textinput} placeholder="Email"  ></TextInput>
      <TextInput onChangeText={pwd => setPwd(pwd)}
      style={styles.textinput} placeholder="Password"></TextInput>
      
      <Button 
      style={styles.btn}
        onPress={()=>{
          auth.signInWithEmailAndPassword(email,pwd)
          .then(()=>{
            navigation.navigate("Home",{
              currentId: auth.currentUser.uid,
              email:email

            })
            console.log("login",auth.currentUser.uid)
            const currentId = auth.currentUser.uid;
            const ref_profile = ref_profils.child("profil-"+currentId);
            ref_profile.update({
              state:"Online"
            })
          })
          .catch((e)=>alert(e))
        }} 
        
        >
          Validate
       
      </Button>
    
      <Button onPress={()=>{
        //fermer l'application
      }} 
      style={styles.btn}
      > Cancel</Button>
      <StatusBar style="light" />
      <TouchableOpacity style={{
        paddingRight: 10,
        width: "100%",
        alignItems: "flex-end",
        marginTop: 10,
      }}>
      <Text 
        onPress={()=>{
          navigation.navigate("Register")
        }}
        style={{
        color: '#fff',
        fontWeight: "bold",
      }}>You don't have account? Sign Up</Text>
      </TouchableOpacity>
      </View>
    </ImageBackground>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#005',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textinput: {
    backgroundColor: '#fff5',
    width: "70%",
    height: 60,
  },
  btn: {
    backgroundColor: "#9BBEC8",
    margin: 2,
    width: 110,
    color:"#fff"
  }
});