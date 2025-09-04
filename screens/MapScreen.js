// screens/MapScreen.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import GUpin from '../assets/GUpin.png';

export default function MapScreen({ navigation }) {
  const [pos, setPos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permDenied, setPermDenied] = useState(false);
  const [locationError, setLocationError] = useState(false);

  useEffect(() => {
    const getLocation = async () => {
      try {
        console.log('📍 MapScreen: Requesting location permissions...');
        const { status } = await Location.requestForegroundPermissionsAsync();
        console.log('📍 MapScreen: Location permission status:', status);
        
        if (status !== 'granted') { 
          setPermDenied(true); 
          console.log('📍 MapScreen: Location permission denied');
          setLoading(false);
          return; 
        }
        
        console.log('📍 MapScreen: Getting current position...');
        const { coords } = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          timeout: 10000,
          maximumAge: 60000,
        });
        
        console.log('📍 MapScreen: Position obtained:', coords);
        setPos({ latitude: coords.latitude, longitude: coords.longitude });
        setLoading(false);
      } catch (e) {
        console.warn('📍 MapScreen: Error getting location:', e);
        setLocationError(true);
        setPos({ latitude: 19.4326, longitude: -99.1332 });
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const retryLocation = async () => {
    setLoading(true);
    setLocationError(false);
    setPermDenied(false);
    
    try {
      console.log('📍 MapScreen: Retrying location...');
      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 10000,
        maximumAge: 60000,
      });
      
      console.log('📍 MapScreen: Position obtained on retry:', coords);
      setPos({ latitude: coords.latitude, longitude: coords.longitude });
      setLoading(false);
    } catch (e) {
      console.warn('📍 MapScreen: Error on retry:', e);
      setLocationError(true);
      setPos({ latitude: 19.4326, longitude: -99.1332 });
      setLoading(false);
    }
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
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={{ marginTop: 16, fontSize: 16, color: '#666' }}>
            Obteniendo tu ubicación…
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (permDenied) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Text style={styles.backButtonText}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mapa</Text>
        </View>
        <View style={styles.center}>
          <Text style={styles.errorTitle}>Permiso de ubicación denegado</Text>
          <Text style={styles.errorText}>
            Para mostrar tu ubicación en el mapa, necesitas permitir el acceso a la ubicación.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={retryLocation}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
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
          <Text style={styles.errorTitle}>No se pudo obtener tu ubicación</Text>
          <Text style={styles.errorText}>
            Verifica que tengas conexión a internet y que la ubicación esté habilitada.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={retryLocation}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
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

  console.log('📍 MapScreen: Rendering map with region:', region);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mapa</Text>
        {locationError && (
          <Text style={styles.locationWarning}>Ubicación aproximada</Text>
        )}
      </View>

      <MapView
        style={styles.map}
        initialRegion={region}
        onMapReady={() => console.log('📍 MapScreen: Map loaded successfully')}
        onError={(error) => console.error('📍 MapScreen: Map error:', error)}
      >
        <Marker 
          coordinate={pos} 
          title="Tu ubicación"
          description={locationError ? "Ubicación aproximada" : "Estás aquí"}
        >
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
    paddingTop: 10,
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
  locationWarning: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '500',
  },
  map: { 
    flex: 1,
    backgroundColor: '#e0e0e0'
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 16 
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  errorText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
