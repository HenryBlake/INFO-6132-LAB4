import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { auth, db } from '../../firebaseConfig';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, getDocs } from 'firebase/firestore';

const FavouriteScreen = () => {
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'favourites'), where('userId', '==', auth.currentUser.uid)),
      (querySnapshot) => {
        const favList = querySnapshot.docs.map(doc => doc.data());
        setFavourites(favList);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleFavourite = async (event) => {
    try {
      await addDoc(collection(db, 'favourites'), {
        id: event.id,
        name: event.name,
        description: event.description,
        userId: auth.currentUser.uid,
        createdBy: event.createdBy,
        timestamp: new Date(),
      });
      Alert.alert('Success', 'Event added to favourites!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleRemoveFavourite = async (eventId) => {
    try {
      const favToDelete = favourites.find(fav => fav.id === eventId);
      if (favToDelete) {
        const snapshot = await getDocs(
          query(collection(db, 'favourites'), where('id', '==', favToDelete.id))
        );
        snapshot.forEach(async (doc) => await deleteDoc(doc.ref));
        setFavourites(prevFavourites =>
          prevFavourites.filter(fav => fav.id !== eventId)
        );
        Alert.alert('Success', 'Event removed from favourites!');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {favourites.length === 0 ? (
        <Text>No favourites yet!</Text>
      ) : (
        <FlatList
          data={favourites}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.event}>
              <Text>{item.name}</Text>
              <Text>{item.description}</Text>
              <Button title="Remove" onPress={() => handleRemoveFavourite(item.id)} />
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  event: { marginBottom: 20, borderBottomWidth: 1, paddingBottom: 10 },
});

export default FavouriteScreen;
