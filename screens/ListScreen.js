import React from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Header from '../components/Header';

const DATA = [
  { id: '1', name: 'Alita Mía Tequisquiapan' },
  { id: '2', name: 'La Sublime Hamburguesas' },
];

export default function ListScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Header title="Lista de lugares" />
      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Detail')}>
            <Text style={styles.itemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  list: { padding: 20 },
  item: { padding: 15, backgroundColor: '#FF6F00', marginBottom: 10, borderRadius: 5 },
  itemText: { color: '#fff', fontSize: 16 },
});
