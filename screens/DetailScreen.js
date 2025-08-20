import React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import Header from '../components/Header';

export default function DetailScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Header title="Detalle del lugar" />
      <View style={styles.content}>
        <Text style={styles.name}>Alita Mía Tequisquiapan</Text>
        <Image source={{ uri: 'https://via.placeholder.com/200' }} style={styles.image} />
        <Text style={styles.description}>Las mejores alitas de la ciudad, con la mejor relación calidad-precio.</Text>
        <Button title="Desbloquear contenido" onPress={() => navigation.navigate('Unlock')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, alignItems: 'center', padding: 20 },
  name: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  image: { width: 200, height: 200, marginBottom: 10 },
  description: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
});
