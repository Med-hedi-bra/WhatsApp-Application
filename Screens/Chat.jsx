import React, { useState, useEffect } from "react";
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
import { Icon } from "react-native-elements";
import firebase from "../config";
import * as Animatable from "react-native-animatable";

export default function Chat({ navigation, route }) {
  const database = firebase.database();
  const idSender = route.params.sender.idSender;
  const idReceiver = route.params.receiver.id;
  const ref_Discusions = database.ref("Discusions");
  const idDiscu =
    idReceiver > idSender
      ? idReceiver + "-" + idSender
      : idSender + "-" + idReceiver;
  const ref_Discusion = ref_Discusions.child("Discussion-" + idDiscu);
  const ref_Messages = ref_Discusion.child("Messages");
  const ref_Typing = ref_Discusion.child("Typing");
  const ref_Profil = database.ref("Profils").child("profil-" + idReceiver);

  const [defaultImage, setdefaultImage] = useState(true);

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const [userReceiver, setuserReceiver] = useState({
    nom: route.params.receiver.nom,
    url: route.params.receiver.url,
    state: route.params.receiver.state,
    numero: route.params.receiver.numero,
  });
  const [isTyping, setisTyping] = useState(false);

  useEffect(() => {
    // to test if the user has a default image or not
    if (route.params.receiver.url != undefined) {
      setdefaultImage(false);
    }

    // updateing the isTyping state
    ref_Typing.child(idReceiver).on("value", (snapshot) => {
      setisTyping(snapshot.val().typing);
    });

    // set the typing state for false when the user enter the chat
    ref_Typing.child(idSender).set({
      typing: false,
    });
    ref_Typing.child(idReceiver).set({
      typing: false,
    });

    // get All messages
    ref_Discusions
      .child("Discussion-" + idDiscu)
      .child("Messages")
      .on("value", (snapshot) => {
        var arrayMsg = [];

        snapshot.forEach((child) => {
          arrayMsg.push(child.val());
        });
        setMessages(arrayMsg);
      });

    // get the receiver state

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
          <Image
            style={styles.userProfileImage}
            source={{ uri: userReceiver.url }}
          />
          <View
            style={{
              paddingLeft: 10,
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "black", fontWeight: "700", fontSize: 18 }}>
              {userReceiver.nom}
            </Text>
            <View style={styles.stateContainer}>
              {userReceiver.state === "Offline" ? (
                <View style={[styles.statePoint, styles.offlinePoint]}></View>
              ) : (
                <View style={[styles.statePoint, styles.onlinePoint]}></View>
              )}
              <Text style={{ color: "black", fontWeight: "300" }}>
                {userReceiver.state}
              </Text>
            </View>
          </View>
        </View>
      ),
      headerRight: () => (
<React.Fragment>
      <TouchableOpacity
        style={{ paddingRight: 10 }}
        onPress={() => {
          console.log(userReceiver);
          Linking.openURL(`tel:${userReceiver.numero}`);
        }}
      >
        <Icon name="call" size={28} color="black" />
      </TouchableOpacity>

      <TouchableOpacity
        style={{ paddingRight: 10 }}
        onPress={() => {
          // Handle video call logic
navigation.navigate("VideoCall" , {
  info:{userId: idSender,
    callId: idDiscu,
    username: "Mohamed"}
})        }}
      >
        <Icon name="videocam" size={28} color="black" />
      </TouchableOpacity>
    </React.Fragment>
      ),
    });

    return () => {
      console.log("unmounting");
      ref_Typing.child(idSender).set({
        typing: false,
      });
      ref_Typing.child(idReceiver).set({
        typing: false,
      });
      // you have to remove the listener when the component is unmounted
    };
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
        sender: idSender,
        message: inputMessage,
        receiver: idReceiver,
        time: t,
      },
    ]);

    setInputMessage("");
    ref_Messages.push({
      message: inputMessage,
      time: t,
      idSender: idSender,
      idReceiver: idReceiver,
    });
  }

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
                <View
                  style={{
                    maxWidth: Dimensions.get("screen").width * 0.8,
                    backgroundColor: item.idReceiver === idSender ? '#d3d3d3'  :"#3a6ee8",
                    alignSelf:
                      item.idReceiver === idSender ? "flex-start" : "flex-end",
                    marginHorizontal: 10,
                    padding: 10,
                    borderRadius: 8,
                    borderBottomLeftRadius: item.idSender === idSender ? 8 : 0,
                    borderBottomRightRadius: item.idSender === idSender ? 0 : 8,
                  }}
                >
                  <Text
                    style={{
                      color:  item.idReceiver === idSender ? "black" : "white",
                      fontSize: 16,
                    }}
                  >
                    {item.message}
                  </Text>
                  <Text
                    style={{
                      color:  item.idReceiver === idSender ? "black" : "white",
                      fontSize: 14,
                      alignSelf: "flex-end",
                    }}
                  >
                    {item.time}
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          )}
        />

        {console.log("isTyping-" + isTyping)}
        {isTyping ? (
          <View style={styles.typingContainer}>
            <Animatable.Text
              animation="flash" // You can choose a different animation from the library
              iterationCount="infinite" // Repeat the animation indefinitely
              style={styles.typingText}
            >
              {userReceiver.nom} is typing ...
            </Animatable.Text>
          </View>
        ) : undefined}

        <View style={{ paddingVertical: 10 }}>
          <View style={styles.messageInputView}>
            <TextInput
              defaultValue={inputMessage}
              style={styles.messageInput}
              placeholder="Message"
              onChangeText={(text) => {
                setInputMessage(text);
                console.log("typing-" + idSender);
                if (text.length > 0) {
                  ref_Typing.child(idSender).update({ typing: true });
                } else {
                  ref_Typing.child(idSender).update({ typing: false });
                }
              }}
              onSubmitEditing={() => {
                sendMessage();
              }}
            />
            <TouchableOpacity
              style={styles.messageSendView}
              onPress={() => {
                sendMessage();
                ref_Typing.child(idSender).update({ typing: false });
              }}
            >
              <Icon name="send" type="material" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

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
  userProfileImage: { height: "100%", aspectRatio: 1, borderRadius: 100 },
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
  stateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statePoint: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5, // Adjust the margin as needed
  },
  offlinePoint: {
    backgroundColor: "red",
  },
  onlinePoint: {
    backgroundColor: "green",
  },
  typingContainer: {
    backgroundColor: "#f0f0f0", // Background color for the typing indicator container
    padding: 10,
    borderRadius: 8,
    marginBottom: 10, // Adjust the margin as needed
    alignSelf: "flex-start", // Align the container to the start of the parent (left in LTR languages)
  },
  typingText: {
    color: "#333", // Text color
    fontStyle: "italic", // Italicize the text to indicate a temporary status
  },
});
