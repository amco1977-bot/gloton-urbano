import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import Header from '../components/Header'; // si está en components, ajusta a '../components/Header'

export default function UnlockScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Header title="Desbloqueo" />
      <View style={styles.content}>
        <Text style={styles.text}>Contenido desbloqueado. ¡Felicidades!</Text>
        <Button title="Volver al inicio" onPress={() => navigation.navigate('Login')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  text: { fontSize: 18, marginBottom: 20, textAlign: 'center' },
});
