import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  View,
} from "react-native";
import React from "react";
import { Button, TextInput } from "react-native-paper";
import { useState, useEffect } from "react";
import firebase from "../config";
import * as ImagePicker from "expo-image-picker";
import Modal from 'react-native-modal';
// import { Audio } from  'react-loader-spinner'


export default function Profile() {
  const database = firebase.database();
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [tel, setTel] = useState("");
  const [defaultImage, setdefaultImage] = useState(true);
  const [urlImage, seturlImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const auth = firebase.auth();
  const storage = firebase.storage();
  const ref_profils = database.ref("Profils");
  const ref_imageFolder = storage.ref("MyImages");
  const ref_img = ref_imageFolder.child("images-" + auth.currentUser.uid);

  useEffect(() => {
    console.log("mounted");
    ref_profils.on("value", (snapshot) => {
      profile = snapshot.val()["profil-" + auth.currentUser.uid];
      setNom(profile.nom);
      setPrenom(profile.prenom);
      setTel(profile.numero);
      if (profile.url != undefined) {
        seturlImage(profile.url);
        setdefaultImage(false);
      } else {
        setdefaultImage(true);
      }
    });
  

    return () => {
      ref_profils.off("value");
    };
  }, []);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setdefaultImage(false);
      seturlImage(result.assets[0].uri);
    }
  };
  const imageToBlob = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob"; //bufferArray
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
    return blob;
  };

  const uploadImage = async (uri, key) => {
          setUploading(true);

    const blob = await imageToBlob(uri);
    // upload blob to firebase storage
    const storage = firebase.storage();
    const ref_imageFolder = storage.ref("MyImages");
    const key1 = auth.currentUser.uid;
    const ref_image = ref_imageFolder.child("images-" + key1);
    let uploadTask = ref_image.put(blob);
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        function (snapshot) {
          // Track the upload progress
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        function (error) {
          // Handle errors during the upload
          console.error("Upload failed: " + error.message);
          reject(error);
        },
        function () {
          // Handle successful upload
          console.log("Upload successful");
          // You can get the download URL of the uploaded file
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then(function (downloadURL) {
              console.log("File available at", downloadURL);
              resolve(downloadURL);
              setUploading(false);

              
            })
            .catch((error) => {
              console.error("Error getting download URL: ", error);
              reject(error);
            });
        }
      );
    });
  };

  // Usage

  return (
    <ImageBackground
      source={require("../assets/img.jpg")}
      style={styles.container}
    >
      <Text style={styles.text}>My Profile</Text>
      <TouchableOpacity
        onPress={() => {
          pickImage();
        }}
      >
        <Image
          style={styles.image}
          source={
            defaultImage ? require("../assets/avatar.jpg") : { uri: urlImage }
          }
        />
      </TouchableOpacity>
      <TextInput
        style={styles.textinput}
        blurOnSubmit={false}
        value={nom}
        onChangeText={(text) => setNom(text)}
        placeholder="Name"
      ></TextInput>
      <TextInput
        style={styles.textinput}
        blurOnSubmit={false}
        value={prenom}
        onChangeText={(text) => setPrenom(text)}
        placeholder="Last Name"
      ></TextInput>
      <TextInput
        style={styles.textinput}
        value={tel}
        blurOnSubmit={false}
        onChangeText={(text) => setTel(text)}
        placeholder="Phone Number"
      ></TextInput>
      <Button
        style={styles.btn}
        onPress={async () => {
          const ref_profils = database.ref("Profils");
          const key = auth.currentUser.uid;
          const ref = ref_profils.child("profil-" + key);

          try {
            console.log("pre");
            let url = await uploadImage(urlImage, key);
            console.log("pre");
            console.log(url);
            profile = await ref.set({
              id: key,
              nom: nom,
              prenom: prenom,
              numero: tel,
              url: url,
              state:"Online",
            });
            Alert.alert("Profile Updated", "Your profile has been updated", [
              {
                text: "OK",
              },
            ]);
          } catch (error) {
            console.log("error uplaod image");
            profile = await ref.set({
              key: key,
              nom: nom,
              prenom: prenom,
              numero: tel,
              state:"Online",

            });
            Alert.alert(
              "Profile Updated",
              "Your profile has been updated but without image",
              [
                {
                  text: "OK",
                },
              ]
            );
            setUploading(false);


          }
        }}
      >
        Validate
      </Button>
      

        
<Modal isVisible={uploading} backdropOpacity={0.5}>
<View style={styles.modalContainer}>
<ActivityIndicator size="large" color="#0000ff" />

</View>
</Modal>
     
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#005",
    alignItems: "center",
    justifyContent: "center",
  },
  textinput: {
    marginBottom: 5,
    backgroundColor: "#fff5",
    width: 200,
    height: 60,
  },
  text: {
    fontWeight: "bold",
    textAlignVertical: "center",
    color: "#fff",
    marginBottom: 10,
  },
  btn: {
    backgroundColor: "#9BBEC8",
    margin: 2,
    width: 110,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
});
