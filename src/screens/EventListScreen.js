import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { auth, db } from "../../firebaseConfig";
import { signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  query,
  where,
  setDoc
} from "firebase/firestore";
import FavouriteScreen from "./FavouriteScreen";

const EventListScreen = ({ navigation, route }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const q = query(
        collection(db, "events"),
        where("createdBy", "==", auth.currentUser.uid) // 過濾當前用戶的事件
      );
      const querySnapshot = await getDocs(q);
      const eventList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventList);
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (route.params?.updatedEvent) {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === route.params.updatedEvent.id
            ? route.params.updatedEvent
            : event
        )
      );
    }
  }, [route.params?.updatedEvent]);

  const handleEdit = (event) => {
    navigation.navigate("EditEvent", { event });
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "events", id));
      Alert.alert("Success", "Event deleted successfully!");
      setEvents(events.filter((event) => event.id !== id));
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      Alert.alert("Success", "You have been signed out!");
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };
  const handleFavourite = async (event) => {
    try {
      const favRef = doc(
        db,
        "favourites",
        `${auth.currentUser.uid}_${event.id}`
      );
      await setDoc(favRef, {
        ...event,
        userId: auth.currentUser.uid,
      });
      Alert.alert("Success", "Event added to favourites!");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.event}>
              <Text>{item.name}</Text>
              <Text>{item.description}</Text>
              {item.createdBy === auth.currentUser.uid && (
                <View style={styles.buttons}>
                  <Button title="Edit" onPress={() => handleEdit(item)} />
                  <Button
                    title="Delete"
                    onPress={() => handleDelete(item.id)}
                  />
                  <Button
                    title="Favourite"
                    onPress={() => handleFavourite(item)}
                  />
                </View>
              )}
            </View>
          )}
        />
        <View style={styles.footer}>
          <Button
            title="Add Event"
            onPress={() => navigation.navigate("AddEvent")}
          />
          <Button title="Sign Out" onPress={handleSignOut} />
          <Button title="Favourites" onPress={() => navigation.navigate('Favourites')} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  event: { marginBottom: 20, borderBottomWidth: 1, paddingBottom: 10 },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
});

export default EventListScreen;
