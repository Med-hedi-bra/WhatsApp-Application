import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import ListeProfile from "./ListeProfile";
import Profile from "./Profile";
import Groupe from "./Groupe";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import firebase from "../config";
const Tab = createMaterialBottomTabNavigator();

const Home = ({ navigation }) => {
  const auth = firebase.auth();
const currentId = auth.currentUser.uid;
const database = firebase.database();
const ref_profile = database.ref("Profils").child("profil-"+currentId);
  useEffect(() => {
    
  
    return () => {
      console.log("logout",currentId)
      ref_profile.update({
        state:"Offline"
      })
    }
  }, [])
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Liste des profils") {
            iconName = "ios-list";
          } else if (route.name === "Profile") {
            iconName = "ios-person";
          } else if (route.name === "Groupe") {
            iconName = "ios-people";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Liste des profils" component={ListeProfile}></Tab.Screen>
      <Tab.Screen name="Profile" component={Profile}></Tab.Screen>
      <Tab.Screen name="Groupe" component={Groupe}></Tab.Screen>
    </Tab.Navigator>
  );
};





export default Home;
