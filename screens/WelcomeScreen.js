import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, SafeAreaView } from 'react-native';
import ApiTest from '../components/ApiTest';
import { useAuth } from '../contexts/AuthContext';

export default function WelcomeScreen({ navigation }) {
  const { user, logout, isAdmin, isSectorAdmin, isPropertyOwner, storageAvailable } = useAuth();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar sesión', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              navigation.replace('Login');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Error al cerrar sesión');
            }
          }
        }
      ]
    );
  };

  const getRoleDescription = () => {
    if (isAdmin()) return 'Administrador del Sistema';
    if (isSectorAdmin()) return 'Administrador de Sector';
    if (isPropertyOwner()) return 'Propietario de Propiedad';
    return 'Usuario Regular';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bienvenido a Glotón Urbano</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        {/* User Welcome Section */}
        <View style={styles.userSection}>
          <Text style={styles.greeting}>¡Hola, {user?.name || 'Usuario'}!</Text>
          <Text style={styles.role}>{getRoleDescription()}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          
          {/* Storage Status (for debugging) */}
          {__DEV__ && (
            <View style={styles.storageStatus}>
              <Text style={[styles.storageStatusText, { color: storageAvailable ? '#28a745' : '#dc3545' }]}>
                💾 Storage: {storageAvailable ? 'Available' : 'Not Available'}
              </Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Acciones rápidas</Text>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Map')}
          >
            <Text style={styles.actionButtonText}>🗺️ Ver Mapa</Text>
            <Text style={styles.actionButtonSubtext}>Explora restaurantes en el mapa</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('List')}
          >
            <Text style={styles.actionButtonText}>📋 Lista de Restaurantes</Text>
            <Text style={styles.actionButtonSubtext}>Ver todos los restaurantes</Text>
          </TouchableOpacity>

          {isPropertyOwner() && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => Alert.alert('Funcionalidad pendiente', 'Gestión de propiedades próximamente')}
            >
              <Text style={styles.actionButtonText}>🏠 Mis Propiedades</Text>
              <Text style={styles.actionButtonSubtext}>Gestiona tus propiedades</Text>
            </TouchableOpacity>
          )}

          {isSectorAdmin() && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => Alert.alert('Funcionalidad pendiente', 'Administración de sector próximamente')}
            >
              <Text style={styles.actionButtonText}>⚙️ Administrar Sector</Text>
              <Text style={styles.actionButtonSubtext}>Gestiona tu sector</Text>
            </TouchableOpacity>
          )}

          {isAdmin() && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => Alert.alert('Funcionalidad pendiente', 'Panel de administración próximamente')}
            >
              <Text style={styles.actionButtonText}>🔧 Panel de Admin</Text>
              <Text style={styles.actionButtonSubtext}>Administración del sistema</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* API Test Section (for development) */}
        {__DEV__ && (
          <View style={styles.testSection}>
            <Text style={styles.sectionTitle}>🔧 API Testing (Development)</Text>
            <ApiTest />
          </View>
        )}

        {/* App Information */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Acerca de Glotón Urbano</Text>
          <Text style={styles.infoText}>
            Descubre los mejores restaurantes de tu ciudad. Navega por el mapa, 
            encuentra nuevos lugares y disfruta de la experiencia gastronómica local.
          </Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10, // Additional padding for extra safety
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
  content: { 
    flexGrow: 1, 
    padding: 20 
  },
  userSection: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 30,
  },
  greeting: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 8,
    color: '#333',
  },
  role: {
    fontSize: 16,
    color: '#FF6F00',
    fontWeight: '600',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  storageStatus: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  storageStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionsSection: {
    marginBottom: 30,
  },
  testSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  actionButton: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  actionButtonSubtext: {
    fontSize: 14,
    color: '#666',
  },
  infoSection: {
    marginBottom: 30,
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
