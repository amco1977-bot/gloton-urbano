import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function RestaurantCard({ restaurant, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.name}>{restaurant.name}</Text>
      <Text style={styles.rating}>Calificación: {restaurant.rating}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  name: { fontSize: 18, fontWeight: 'bold' },
  rating: { fontSize: 16, marginTop: 5 },
});
