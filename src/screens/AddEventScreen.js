import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { db, auth } from "../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const AddEventScreen = ({ navigation }) => {
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");

  const handleAddEvent = async () => {
    if (!eventName || !eventDescription) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "events"), {
        name: eventName,
        description: eventDescription,
        createdBy: auth.currentUser.uid,
        timestamp: new Date(),
      });
      Alert.alert("Success", "Event added successfully!");

      navigation.navigate("Events", {
        newEvent: {
          id: docRef.id,
          name: eventName,
          description: eventDescription,
          createdBy: auth.currentUser.uid,
        },
      });
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Event Name"
        value={eventName}
        onChangeText={setEventName}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Event Description"
        value={eventDescription}
        onChangeText={setEventDescription}
        multiline
      />
      <Button title="Add Event" onPress={handleAddEvent} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderBottomWidth: 1, marginBottom: 20, height: 40 },
  textArea: { height: 80, textAlignVertical: "top" },
});

export default AddEventScreen;
