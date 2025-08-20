import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import Header from '../components/Header';

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Header title="Login" />
      <View style={styles.form}>
        <Text style={styles.label}>Correo:</Text>
        <TextInput style={styles.input} placeholder="Ingresa tu correo" />
        <Text style={styles.label}>Contraseña:</Text>
        <TextInput style={styles.input} placeholder="Ingresa tu contraseña" secureTextEntry />
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Welcome')}>
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <Text>¿No tienes cuenta?</Text>
        <Button title="Registrarse" onPress={() => alert('Registro pendiente')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  form: { flex: 1, padding: 20, justifyContent: 'center' },
  label: { fontSize: 16, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 15, padding: 10 },
  button: { backgroundColor: '#FF6F00', padding: 15, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  footer: { padding: 20, alignItems: 'center' },
});
