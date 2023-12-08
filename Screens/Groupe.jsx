import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Modal, TouchableOpacity } from 'react-native';

const Groupe = () => {
  const [groupName, setGroupName] = useState('');
  const [groups, setGroups] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [availablePeople, setAvailablePeople] = useState([
    { id: 1, name: 'Person 1' },
    { id: 2, name: 'Person 2' },
    { id: 3, name: 'Person 3' },
    // Add more people as needed
  ]);

  const addGroup = () => {
    if (groupName.trim() !== '') {
      setGroups((prevGroups) => [...prevGroups, { id: Date.now().toString(), name: groupName, people: selectedPeople }]);
      setGroupName('');
      setSelectedPeople([]);
      setModalVisible(false);
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const togglePerson = (person) => {
    const isSelected = selectedPeople.some((p) => p.id === person.id);

    if (isSelected) {
      setSelectedPeople((prevPeople) => prevPeople.filter((p) => p.id !== person.id));
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
        <Button title="Add People" onPress={openModal} />
      </View>

      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.groupItem}>
            <Text>{item.name}</Text>
            <Text>People: {item.people.map((person) => person.name).join(', ')}</Text>
          </View>
        )}
      />

      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <FlatList
            data={availablePeople}
            keyExtractor={(person) => person.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => togglePerson(item)}>
                <View style={[styles.personItem, { backgroundColor: selectedPeople.some((p) => p.id === item.id) ? '#ADD8E6' : '#FFFFFF' }]}>
                  <Text>{item.name}</Text>
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
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  groupItem: {
    marginBottom: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  modalContainer: {
    flex: 1,
    padding: 16,
  },
  personItem: {
    marginBottom: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
});

export default Groupe;
