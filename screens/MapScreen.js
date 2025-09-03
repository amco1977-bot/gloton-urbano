// screens/MapScreen.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Platform } from 'react-native';
import * as Location from 'expo-location';
import GUpin from '../assets/GUpin.png'; // asegúrate que existe en /assets

export default function MapScreen({ navigation }) {
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

  const handleGoBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Text style={styles.backButtonText}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mapa</Text>
        </View>
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 8 }}>Obteniendo tu ubicación…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!pos) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Text style={styles.backButtonText}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mapa</Text>
        </View>
        <View style={styles.center}>
          <Text style={{ textAlign: 'center' }}>
            {permDenied
              ? 'Permiso de ubicación denegado. Actívalo en Ajustes → Apps → Glotón Urbano → Permisos.'
              : 'No se pudo obtener tu ubicación.'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const region = {
    latitude: pos.latitude,
    longitude: pos.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mapa</Text>
      </View>

      {/* Map */}
      <MapView
        style={styles.map}
        provider={Platform.OS === 'ios' ? undefined : PROVIDER_GOOGLE}
        initialRegion={region}
        showsUserLocation={false}
      >
        {/* Marker con imagen personalizada */}
        <Marker coordinate={pos} anchor={{ x: 0.5, y: 1 }}>
          <Image source={GUpin} style={{ width: 40, height: 40 }} />
        </Marker>
      </MapView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10, // Reduced padding since SafeAreaView handles the top
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  map: { 
    flex: 1 
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 16 
  },
});
