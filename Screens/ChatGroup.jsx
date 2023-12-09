import React from "react";
import firebase from "../config";
import * as Animatable from "react-native-animatable";
import { Icon } from "react-native-elements";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  FlatList,
  Dimensions,
  Alert,
  Linking,
} from "react-native";

const ChatGroup = (props) => {
  const groupe = props.route.params.groupe;
  let navigation = props.navigation;
  const database = firebase.database();
  const currentUser = firebase.auth().currentUser;
  const ref_Groupes = database.ref("Groupes");
  const ref_Groupe = ref_Groupes.child("Groupe" + groupe.id);
  const ref_Messages = ref_Groupe.child("Messages");
  //   const idReceiver = route.params.receiver.id;
  //   const ref_Discusions = database.ref("Discusions");
  //   const idDiscu =
  //     idReceiver > idSender
  //       ? idReceiver + "-" + idSender
  //       : idSender + "-" + idReceiver;
  //   const ref_Discusion = ref_Discusions.child("Discussion-" + idDiscu);
  //   const ref_Messages = ref_Discusion.child("Messages");
  //   const ref_Typing = ref_Discusion.child("Typing");
  //   const ref_Profil = database.ref("Profils").child("profil-" + idReceiver);

  //   const [defaultImage, setdefaultImage] = useState(true);

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  //   const [userReceiver, setuserReceiver] = useState({
  //     nom: route.params.receiver.nom,
  //     url: route.params.receiver.url,
  //     state: route.params.receiver.state,
  //     numero: route.params.receiver.numero,
  //   });
  //   const [isTyping, setisTyping] = useState(false);

  useEffect(() => {
    // to test if the user has a default image or not
    // if (route.params.receiver.url != undefined) {
    //   setdefaultImage(false);
    // }

    // updateing the isTyping state
    // ref_Typing.child(idReceiver).on("value", (snapshot) => {
    //   setisTyping(snapshot.val().typing);
    // });

    // set the typing state for false when the user enter the chat
    // ref_Typing.child(idSender).set({
    //   typing: false,
    // });
    // ref_Typing.child(idReceiver).set({
    //   typing: false,
    // });

    // get All messages
    ref_Messages.on("value", (snapshot) => {
      var arrayMsg = [];

      snapshot.forEach((child) => {
        arrayMsg.push(child.val());
      });
      setMessages(arrayMsg);
    });

    // Setting the header navigation value base on the data fetched
    navigation.setOptions({
      title: "",
      headerLeft: () => (
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={{ paddingRight: 10 }}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Icon
              name="angle-left"
              type="font-awesome"
              size={30}
              color="black"
            />
          </TouchableOpacity>

          <View
            style={{
              paddingLeft: 10,
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "black", fontWeight: "700", fontSize: 18 }}>
              {groupe.name}
            </Text>
          </View>
        </View>
      ),
    });

    return () => {};
  }, []);
  function getTime(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }

  function sendMessage() {
    if (inputMessage === "") {
      return setInputMessage("");
    }
    let t = getTime(new Date());
    setMessages([
      ...messages,
      {
        sender: currentUser.uid,
        message: inputMessage,
        time: t,
      },
    ]);

    setInputMessage("");
    ref_Messages.push({
      message: inputMessage,
      time: t,
      idSender: currentUser.uid,
    });
  }
  groupe.members.map((member) => {
    if (member != undefined) {
      console.log("*********member", member.id);
    }
  });
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.container}>
        <FlatList
          style={{ backgroundColor: "#f2f2ff" }}
          inverted={true}
          data={JSON.parse(JSON.stringify(messages)).reverse()}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback>
              <View style={{ marginTop: 6 }}>
                <View style={{ marginTop: 6 }}>
                  <View style={styles.container}>
                  {groupe.members.map((member) => {
                        if (member && member.id === item.idSender) {
                          return (
                            <View
                              key={member.id}
                              style={[styles.senderNameContainer,{marginLeft: 10}]}
                            >
                              <Text style={{ color: "#000", fontSize: 14 }}>
                                {member.nom}
                              </Text>
                            </View>
                          );
                        }
                        return null;
                      })}
                    <View
                      style={[
                        styles.messageContainer,
                        {
                          justifyContent:
                            item.idSender !== currentUser.uid
                              ? "flex-start"
                              : "flex-end",
                        },
                      ]}
                    >
                     

                      <View
                        style={[
                          styles.messageContent,
                          {
                            backgroundColor:
                              item.idSender !== currentUser.uid
                                ? "#d3d3d3"
                                : "#3a6ee8",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.messageText,
                            {
                              color:
                                item.idSender !== currentUser.uid
                                  ? "black"
                                  : "white",
                            },
                          ]}
                        >
                          {item.message}
                        </Text>

                        <Text
                          style={[
                            styles.timeText,
                            {
                              color:
                                item.idSender !== currentUser.uid
                                  ? "black"
                                  : "white",
                            },
                          ]}
                        >
                          {item.time}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          )}
        />
        <View style={{ paddingVertical: 10 }}>
          <View style={styles.messageInputView}>
            <TextInput
              defaultValue={inputMessage}
              style={styles.messageInput}
              placeholder="Message"
              onChangeText={(text) => {
                setInputMessage(text);
              }}
              onSubmitEditing={() => {
                sendMessage();
              }}
            />
            <TouchableOpacity
              style={styles.messageSendView}
              onPress={() => {
                sendMessage();
              }}
            >
              <Icon name="send" type="material" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginTop: 10,
  },
  headerLeft: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#f2f2ff",
  },
  messageInputView: {
    display: "flex",
    flexDirection: "row",
    marginHorizontal: 14,
    backgroundColor: "#fff",
    borderRadius: 4,
  },
  messageInput: {
    height: 40,
    flex: 1,
    paddingHorizontal: 10,
  },

  text: {
    fontSize: 14,
    color: "#333",
  },
  messageSendView: {
    paddingHorizontal: 10,
    justifyContent: "center",
  },

  messageContainer: {
    flexDirection: "row",
    marginHorizontal: 10,
    justifyContent: "flex-start", // Default to flex-start
  },
  senderNameContainer: {
    marginRight: 8,
  },
  messageContent: {
    maxWidth: Dimensions.get("screen").width * 0.8,
    backgroundColor: "#3a6ee8",
    padding: 10,
    borderRadius: 8,
  },
  messageText: {
    color: "#fff",
    fontSize: 16,
  },
  timeText: {
    color: "#dfe4ea",
    fontSize: 14,
    alignSelf: "flex-end",
  },
});

export default ChatGroup;
