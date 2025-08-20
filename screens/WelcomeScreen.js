import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/Header';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Header title="Bienvenido a Glotón Urbano" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>¡Hola!</Text>
        <Text style={styles.text}>
          Esta es la pantalla de bienvenida. Aquí puedes ver las novedades y explorar el mapa de restaurantes.
        </Text>
        <Button title="Ir al Mapa" onPress={() => navigation.navigate('Map')} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  text: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
});
