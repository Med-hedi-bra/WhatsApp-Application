import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import firebase from "../config";
import { useNavigation } from "@react-navigation/native";

const Groupe = () => {
  const database = firebase.database();
  const ref_profils = database.ref("Profils");
  const auth = firebase.auth();
  const currentUser = auth.currentUser;
  const ref_Groupes = database.ref("Groupes");
  const [groupName, setGroupName] = useState("");
  const [groups, setGroups] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [availablePeople, setAvailablePeople] = useState([]);
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get all profiles
        const profilesSnapshot = await ref_profils.once("value");
        const profilesData = profilesSnapshot.val();
        if (profilesData && typeof profilesData === "object") {
          // Convert the object of profiles into an array
          const profilesArray = Object.values(profilesData);

          const filteredProfiles = profilesArray.filter(
            (profile) => currentUser.uid !== profile.id
          );
          setData(filteredProfiles);
          setAvailablePeople(filteredProfiles);

          // Get groups by the current user's ID
          const groupsSnapshot = await ref_Groupes.once("value");
          const allGroups = groupsSnapshot.val() || {};
          const groupsWithMember = [];

          // Iterate through each group
          Object.keys(allGroups).forEach((groupId) => {
            const group = allGroups[groupId];

            // Check if the currentUser.uid is in the "members" array of the current group
            if (group.members && group.members.includes(currentUser.uid)) {
              groupsWithMember.push(group);
            }
          });

          // Replace the member IDs with the actual member objects
          let groupsWithDataCleaned = [];
          const groupsWithData = await Promise.all(
            groupsWithMember.map(async (group) => {
              const membersWithData = await Promise.all(
                group.members.map(async (memberId) => {
                  const member = filteredProfiles.find(
                    (person) => person.id === memberId
                  );
                  return member;
                })
              );
              group.members = membersWithData;
              return group;
            })
          );

          setGroups(groupsWithData);
        } else {
          console.log("Invalid or empty profiles data:", profilesData);
        }
      } catch (error) {
        console.error("Error retrieving data:", error);
      }
    };

    fetchData();

    return () => {
      ref_profils.off("value");
    };
  }, []);

  const addGroup = () => {
    if (groupName.trim() !== "") {
      setGroups((prevGroups) => [
        ...prevGroups,
        { id: Date.now().toString(), name: groupName, members: selectedPeople },
      ]);
      setGroupName("");
      setSelectedPeople([]);
      setModalVisible(false);
      console.log("********new",groups)

      // adding the groupe to the database
      const key = ref_Groupes.push().key;
      const ref_Groupe = ref_Groupes.child("Groupe" + key);
      membersId = selectedPeople.map((person) => person.id);
      membersId.push(auth.currentUser.uid);
      ref_Groupe.set({
        id: key,
        name: groupName,
        members: membersId,
      });
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const togglePerson = (person) => {
    const isSelected = selectedPeople.some((p) => p.id === person.id);

    if (isSelected) {
      setSelectedPeople((prevPeople) =>
        prevPeople.filter((p) => p.id !== person.id)
      );
    } else {
      setSelectedPeople((prevPeople) => [...prevPeople, person]);
    }
  };

  const cancelSelection = () => {
    setSelectedPeople([]);
    setModalVisible(false);
  };


  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter group name"
          value={groupName}
          onChangeText={(text) => setGroupName(text)}
        />
        <Button title="Add Groupe" onPress={openModal} />
      </View>

      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={()=>{
            navigation.navigate("ChatGroup",{groupe:item})
          }}>
            <View style={styles.groupItem}>
            <Text style={[styles.label]}>{item.name}</Text>

            <Text>
               {/* To avoid the error "undefined is not an object"  */}
              Memebrs:{" "}
              {item?.members?.map((person) => {
                  return person != undefined ?  person.nom : "";
                })
                .join(", ")}
            </Text>
          </View>
          </TouchableOpacity>
        )} 
      />

      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select People</Text>

          <FlatList
            data={availablePeople}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  togglePerson(item);
                }}
              >
                <View
                  key={item.id}
                  style={[
                    styles.profileContainer,
                    {
                      backgroundColor: selectedPeople.some(
                        (p) => p.id === item.id
                      )
                        ? "#ADD8E6"
                        : "#FFFFFF",
                    },
                  ]}
                >
                  <Image
                    source={
                      item.url != undefined
                        ? { uri: item.url }
                        : require("../assets/avatar.jpg")
                    }
                    style={styles.profileImage}
                  />

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
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />

          <View style={styles.modalButtons}>
            <Button title="Add Selected People" onPress={addGroup} />
            <Button title="Cancel" onPress={cancelSelection} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5FCFF",
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  groupItem: {
    marginBottom: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  modalContainer: {
    flex: 1,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  personItem: {
    marginBottom: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
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
});

export default Groupe;
