import { StyleSheet, Text, View, Linking, TextInput } from "react-native";
import React from "react";
import firebase from "../config";
import { useEffect, useState } from "react";
import { FlatList, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Dialog, Portal, Button } from "react-native-paper";
const ListeProfile = () => {
  const database = firebase.database();
  const ref_profils = database.ref("Profils");
  const auth = firebase.auth();
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  const [isDialogDetailsVisible, setisDialogDetailsVisible] = useState(false);
  const [isDialogSmsIsVisible, setisDialogSmsIsVisible] = useState(false);
  const [selectedItem, setselectedItem] = useState(undefined);
  const [smsText, setsmsText] = useState("");

  useEffect(() => {
    ref_profils.on("value", (snapshot) => {
      let d = [];
      snapshot.forEach((child) => {
        if (auth.currentUser.uid != child.val().id) {
          d.push(child.val());
        }
      });
      setData(d);
    });

    return () => {
      ref_profils.off("value");
    };
  }, []);
  const setDialogSms = (isVisble, item) => {
    setisDialogSmsIsVisible(isVisble);
    setselectedItem(item);
  };
  const setDialogDetails = (isVisble, item) => {
    setisDialogDetailsVisible(isVisble);
    setselectedItem(item);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des Profils</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Chat", {
                sender: {
                  idSender: auth.currentUser.uid,
                },
                receiver: {
                  id: item.id,
                  nom: item.nom,
                  prenom: item.prenom,
                  numero: item.numero,
                  url: item.url,
                  state: item.state,
                },
              });
            }}
          >
            <View key={item.id} style={styles.profileContainer}>
              <TouchableOpacity
                onPress={() => {
                  setDialogDetails(true, item);
                }}
              >
                <Image
                  source={
                    item.url != undefined
                      ? { uri: item.url }
                      : require("../assets/avatar.jpg")
                  }
                  style={styles.profileImage}
                />
              </TouchableOpacity>

              <View style={styles.textContainer}>
                <Text style={styles.label}>
                  {`Nom: `}
                  <Text style={styles.value}>{item.nom}</Text>
                </Text>

                <Text style={styles.label}>
                  {`Prenom: `}
                  <Text style={styles.value}>{item.prenom}</Text>
                </Text>

                <Text style={styles.label}>
                  {`Telephone: `}
                  <Text style={styles.value}>{item.numero}</Text>
                </Text>

                {/* Add more fields as needed */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      Linking.openURL(`tel:${item.numero}`);
                    }}
                  >
                    <Image
                      source={require("../assets/call.png")}
                      style={styles.icon}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setDialogSms(true, item);
                    }}
                  >
                    <Image
                      source={require("../assets/mesg.png")}
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Dialog for sending sms */}
      <Dialog
        visible={isDialogSmsIsVisible}
        onDismiss={() => {
          setDialogSms(false, null);
        }}
      >
        <Dialog.Title>
         
          SEND SMS TO {selectedItem != undefined ? selectedItem.nom : null}
        </Dialog.Title>
        <Dialog.Content>
          <Image
            resizeMode="center"
            style={[styles.profileImage]}
            source={
              selectedItem?.url != undefined
                ? { uri: selectedItem.url }
                : require("../assets/avatar.jpg")
            }
          ></Image>
          <Text style={[styles.label, { marginTop: 20 }]}>
            Numéro: {selectedItem != undefined ? selectedItem.numero : null}
          </Text>

          <View style={[styles.smsInputContainer]}>
            <Text style={[styles.label]}>SMS: </Text>

            <TextInput
              style={[styles.textInput, styles.focusedTextInput]}
              placeholder="Type something..."
              onChangeText={(sms) => setsmsText(sms)}
            />
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={() => {
              setisDialogSmsIsVisible(false);
              console.log("sms ecrite est", smsText);

              Linking.openURL(`sms:${selectedItem.numero}?body=${smsText}`);
            }}
          >
            Send
          </Button>
          <Button
            onPress={() => {
              setisDialogSmsIsVisible(false);
            }}
          >
            Cancel
          </Button>
        </Dialog.Actions>
      </Dialog>


            {/* Dialog for profile details */}

      <Dialog
        visible={isDialogDetailsVisible}
        onDismiss={() => {
          setisDialogDetailsVisible(false);
        }}
      >
        <Dialog.Title> Details of {selectedItem != undefined ? selectedItem.nom : null}</Dialog.Title>
        <Dialog.Content>
        <Text style={[styles.label, { marginTop: 20 }]}>
            Nom: {selectedItem != undefined ? selectedItem.nom : null}
          </Text>
          <Text style={[styles.label, { marginTop: 20 }]}>
            Prenom: {selectedItem != undefined ? selectedItem.prenom : null}
          </Text>
        <Text style={[styles.label, { marginTop: 20 }]}>
            Numéro: {selectedItem != undefined ? selectedItem.numero : null}
          </Text>
          <Image
            resizeMode="center"
            style={[{marginTop:20},styles.profileImage]}
            source={
              selectedItem?.url != undefined
                ? { uri: selectedItem.url }
                : require("../assets/avatar.jpg")
            }
          ></Image>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => {
                        setisDialogDetailsVisible(false);

          }}>OK</Button>
          
        </Dialog.Actions>
      </Dialog>
    </View>
  );
};

export default ListeProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,

    backgroundColor: "#F5FCFF",
  },
  title: {
    fontSize: 24,
    marginTop: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  profileContainer: {
    flexDirection: "row", // Align children horizontally
    alignItems: "center", // Align children vertically

    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25, // Assuming the image is a circle
    marginRight: 10,
  },
  textContainer: {
    flex: 1, // Take remaining space in the row
  },

  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333333",
  },
  value: {
    fontSize: 16,
    marginBottom: 16,
    color: "#666666",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  icon: {
    width: 35,
    height: 30,
    marginHorizontal: 10,
  },

  textInput: {
    height: 40,
    width: 300,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    borderRadius: 25,
  },
  focusedTextInput: {
    borderColor: "blue", // Change border color when focused
    marginTop: 10,
    maxWidth: 280,
  },
  smsInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
