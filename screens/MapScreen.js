// screens/MapScreen.js
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Platform, Text } from 'react-native';
import { AppleMaps, GoogleMaps } from 'expo-maps';
import * as Location from 'expo-location';

export default function MapScreen() {
  const [pos, setPos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permDenied, setPermDenied] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setPermDenied(true);
          return;
        }
        const { coords } = await Location.getCurrentPositionAsync({});
        setPos({ latitude: coords.latitude, longitude: coords.longitude });
      } catch (e) {
        console.warn('Ubicación no disponible', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.msg}>Cargando mapa…</Text>
      </View>
    );
  }

  if (!pos) {
    return (
      <View style={styles.center}>
        <Text style={styles.msg}>
          {permDenied ? 'Permiso de ubicación denegado' : 'No se pudo obtener tu ubicación'}
        </Text>
      </View>
    );
  }

  // Marcadores de ejemplo
  const markers = [
    { id: 'yo', title: 'Estás aquí', coordinates: pos },
    { id: '1', title: 'Alita Mía', coordinates: { latitude: 20.5222, longitude: -99.8931 }, snippet: '4.8★' },
    { id: '2', title: 'Taquitos El Güero', coordinates: { latitude: 20.5240, longitude: -99.8900 }, snippet: '4.5★' },
    { id: '3', title: 'Pizza La Toscana', coordinates: { latitude: 20.5205, longitude: -99.8960 }, snippet: '4.9★' }
  ];

  if (Platform.OS === 'ios') {
    return (
      <AppleMaps.View
        style={styles.map}
        cameraPosition={{ coordinates: pos, zoom: 14 }}
        annotations={markers.map(m => ({
          id: m.id,
          title: m.title,
          coordinates: m.coordinates
        }))}
      />
    );
  }

  return (
    <GoogleMaps.View
      style={styles.map}
      cameraPosition={{ coordinates: pos, zoom: 14 }}
      markers={markers.map(m => ({
        id: m.id,
        title: m.title,
        snippet: m.snippet,
        coordinates: m.coordinates
      }))}
      onMarkerClick={(marker) => {
        // Aquí podrías navegar al detalle: navigation.navigate('Detail', { id: marker.id })
        // Por ahora, solo mostramos en consola:
        console.log('Marker clicado:', marker.title);
      }}
    />
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  msg: { marginTop: 8 }
});
