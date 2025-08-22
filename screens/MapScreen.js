// screens/MapScreen.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import GUpin from '../assets/GUpin.png'; // asegúrate que existe en /assets

export default function MapScreen() {
  const [pos, setPos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permDenied, setPermDenied] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') { setPermDenied(true); return; }
        const { coords } = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setPos({ latitude: coords.latitude, longitude: coords.longitude });
      } catch (e) {
        console.warn('No se pudo obtener ubicación', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Obteniendo tu ubicación…</Text>
      </View>
    );
  }

  if (!pos) {
    return (
      <View style={styles.center}>
        <Text style={{ textAlign: 'center' }}>
          {permDenied
            ? 'Permiso de ubicación denegado. Actívalo en Ajustes → Apps → Glotón Urbano → Permisos.'
            : 'No se pudo obtener tu ubicación.'}
        </Text>
      </View>
    );
  }

  const region = {
    latitude: pos.latitude,
    longitude: pos.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <MapView
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      initialRegion={region}
      showsUserLocation={false}
    >
      {/* Marker con imagen personalizada */}
      <Marker coordinate={pos} anchor={{ x: 0.5, y: 1 }}>
        <Image source={GUpin} style={{ width: 40, height: 40 }} />
      </Marker>
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
});
