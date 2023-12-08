import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { Button, TextInput } from 'react-native-paper';

import firebase from '../config';

export default function CreateUser({ navigation}) {
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    const [pwd,setPwd] = useState('');
    const [num, setNum] = useState('');
    const [confirmedPass , setConfirmedPass] = useState("123456")
    const refinput2 = useRef();
    const refinput3 = useRef();
    const refinput4 = useRef();
    const refinput5 = useRef();

    const auth = firebase.auth()
    const database = firebase.database();
    const ref_profils = database.ref("Profils");
    const key = auth.currentUser.uid;
    const ref = ref_profils.child("profil-" + key);





  return (
    <ImageBackground  source={require("../assets/img.jpg")}
    style={styles.container}>
    <View
    style={{
        width: "90%",
        height: 500,
        borderRadius: 20,
        backgroundColor:'#0003',
        alignItems: 'center',
        justifyContent: 'center',
    }}>
      <Text style={{
        color: '#fff',
        fontWeight: "bold",
        marginBottom: 25,
      }}>Sign up</Text>
      <View style={{ flexDirection: 'row'}}>
        <Text style={styles.text}> Email : </Text>
        <TextInput 
            ref={refinput3}
            onSubmitEditing={()=>{ refinput4.current.focus();}}
            blurOnSubmit={false}
            keyboardType='email-address'
            onChangeText={text => setEmail(text)}
            style={styles.textinput} placeholder="Email"  ></TextInput>
      </View>

      <View style={{ flexDirection: 'row'}}>
        <Text style={styles.text}> Password : </Text>
        <TextInput 
            secureTextEntry={true}
            ref={refinput4}
            onSubmitEditing={()=>{ refinput5.current.focus();}}
            blurOnSubmit={false}
            onChangeText={text => setPwd(text)}
            style={styles.textinput} placeholder="password"  ></TextInput>
      </View>
      <Button style={styles.btn} onPress={async()=>{

        if(pwd == confirmedPass){
            auth.createUserWithEmailAndPassword(email,pwd)
            .then(()=>{
                navigation.replace("Home")
            })
            .catch((e)=>alert(e))
        }
      }

      } title='Sign up'>
        Sign up
      
      </Button>
      <TouchableOpacity style={{
        paddingRight: 10,
        width: "100%",
        alignItems: "flex-end",
        marginTop: 10,
      }}>
      <Text 
        onPress={()=>{
          navigation.navigate("Auth")
        }}
        style={{
        color: '#fff',
        fontWeight: "bold",
      }}>Already have an account</Text>
      </TouchableOpacity>
    </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#005',
          alignItems: 'center',
          justifyContent: 'center',
        },
         textinput: {
            marginBottom: 5,
            backgroundColor: '#fff5',
            width: "65%",
            height: 60,
        },
        text: {
            width: 100,
            textAlignVertical: 'center',
            color: '#fff',
            
        },
        btn: {
            backgroundColor: "#9BBEC8",
            margin: 2,
            width: 110,
          }
})