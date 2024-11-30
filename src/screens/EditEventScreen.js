import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { db } from '../../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

const EditEventScreen = ({ route, navigation }) => {
  const { event } = route.params;
  const [eventName, setEventName] = useState(event.name);
  const [eventDescription, setEventDescription] = useState(event.description);

  const handleSave = async () => {
    if (!eventName || !eventDescription) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const eventRef = doc(db, 'events', event.id);
      await updateDoc(eventRef, {
        name: eventName,
        description: eventDescription,
      });
      Alert.alert('Success', 'Event updated successfully!');
      navigation.navigate('Events', { updatedEvent: { ...event, name: eventName, description: eventDescription } });
    } catch (error) {
      Alert.alert('Error', error.message);
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
      <Button title="Save Changes" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderBottomWidth: 1, marginBottom: 20, height: 40 },
  textArea: { height: 80, textAlignVertical: 'top' },
});

export default EditEventScreen;
