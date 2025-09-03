import React, { useState, useRef } from 'react';
import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { useAuth } from '../contexts/AuthContext';
import analyticsService from '../services/AnalyticsService';

const { width: screenWidth } = Dimensions.get('window');

// Food types data
const FOOD_TYPES = [
  { id: '1', name: 'Restaurantes', icon: '🍽️' },
  { id: '2', name: 'Cafeterías', icon: '☕' },
  { id: '3', name: 'Pizzerías', icon: '🍕' },
  { id: '4', name: 'Hamburguesas', icon: '🍔' },
  { id: '5', name: 'Sushi', icon: '🍣' },
  { id: '6', name: 'Tacos', icon: '🌮' },
  { id: '7', name: 'Helados', icon: '🍦' },
  { id: '8', name: 'Bebidas', icon: '🥤' },
];

// Dietary restrictions data
const DIETARY_RESTRICTIONS = [
  { id: '1', name: 'Vegano', icon: '🌱' },
  { id: '2', name: 'Vegetariano', icon: '🥗' },
  { id: '3', name: 'Sin Gluten', icon: '🌾' },
  { id: '4', name: 'Sin Lactosa', icon: '🥛' },
  { id: '5', name: 'Sin Nuez', icon: '🥜' },
  { id: '6', name: 'Sin Mariscos', icon: '🦐' },
  { id: '7', name: 'Sin Huevo', icon: '🥚' },
  { id: '8', name: 'Halal', icon: '🕌' },
];

export default function OnboardingScreen({ navigation }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedFoodTypes, setSelectedFoodTypes] = useState([]);
  const [selectedRestrictions, setSelectedRestrictions] = useState([]);
  const { login } = useAuth();

  const totalSteps = 5;

  // Initialize analytics service on component mount
  React.useEffect(() => {
    console.log('🚀 OnboardingScreen: Initializing analytics service');
    try {
      // Generate a simple device UUID for testing
      const deviceUUID = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      analyticsService.initialize(deviceUUID);
      console.log('✅ OnboardingScreen: Analytics service initialized successfully');
    } catch (error) {
      console.error('❌ OnboardingScreen: Failed to initialize analytics service:', error);
    }
  }, []);

  const handleNext = async () => {
    console.log('🔄 OnboardingScreen: handleNext called', {
      currentStep,
      totalSteps,
      selectedFoodTypes: selectedFoodTypes.length,
      selectedRestrictions: selectedRestrictions.length,
    });

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Onboarding complete, track analytics
      console.log('🎉 OnboardingScreen: Onboarding complete, tracking analytics');
      try {
        const onboardingData = {
          food_types: selectedFoodTypes.map(food => food.name).join(','),
          dietary_restrictions: selectedRestrictions.map(restriction => restriction.name).join(','),
          location_granted: false, // You can implement location permission check here
        };

        console.log('📊 OnboardingScreen: Sending onboarding data:', onboardingData);
        await analyticsService.trackOnboardingComplete(onboardingData);
        console.log('✅ OnboardingScreen: Onboarding completion tracked successfully');
      } catch (error) {
        console.error('❌ OnboardingScreen: Failed to track onboarding completion:', error);
      }

      // Navigate to main app
      console.log('🧭 OnboardingScreen: Navigating to Welcome screen');
      navigation.replace('Welcome');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = async () => {
    // Track onboarding skip
    try {
      await analyticsService.trackCustomEvent('onboarding_skipped', {
        step: currentStep,
        food_types_selected: selectedFoodTypes.length,
        restrictions_selected: selectedRestrictions.length,
      });
      console.log('Onboarding skip tracked');
    } catch (error) {
      console.error('Failed to track onboarding skip:', error);
    }

    navigation.replace('Welcome');
  };

  const handleSwipeGesture = (event) => {
    const { translationX } = event.nativeEvent;
    const threshold = 50; // Minimum swipe distance

    if (translationX < -threshold) {
      // Swipe left - go to next step
      handleNext();
    } else if (translationX > threshold) {
      // Swipe right - go to previous step
      handlePrevious();
    }
  };

  const handleFoodTypeToggle = (foodType) => {
    setSelectedFoodTypes(prev => {
      if (prev.find(item => item.id === foodType.id)) {
        return prev.filter(item => item.id !== foodType.id);
      } else {
        return [...prev, foodType];
      }
    });
  };

  const handleRestrictionToggle = (restriction) => {
    setSelectedRestrictions(prev => {
      if (prev.find(item => item.id === restriction.id)) {
        return prev.filter(item => item.id !== restriction.id);
      } else {
        return [...prev, restriction];
      }
    });
  };

  const renderWelcomeStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.contentContainer}>
        <Text style={styles.stepTitle}>¡Bienvenido a Glotón Urbano!</Text>
        <Text style={styles.stepSubtitle}>
          Descubre los mejores restaurantes y lugares gastronómicos de tu ciudad
        </Text>
        <View style={styles.welcomeIcon}>
          <Image source={require('../assets/GUpin.png')} style={styles.welcomeIconImage} />
        </View>
        <Text style={styles.stepDescription}>
          Te ayudaremos a encontrar exactamente lo que buscas, 
          personalizando tu experiencia según tus preferencias.
        </Text>
      </View>
    </View>
  );

  const renderFoodTypesStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.contentContainer}>
        <Text style={styles.stepTitle}>Tipo de negocios</Text>
        <Text style={styles.stepSubtitle}>
          Selecciona los tipos de comida que más te interesan
        </Text>
        
        <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.optionsGrid}>
            {FOOD_TYPES.map((foodType) => (
              <TouchableOpacity
                key={foodType.id}
                style={[
                  styles.optionButton,
                  selectedFoodTypes.find(item => item.id === foodType.id) && styles.optionButtonSelected
                ]}
                onPress={() => handleFoodTypeToggle(foodType)}
              >
                <Text style={styles.optionIcon}>{foodType.icon}</Text>
                <Text style={[
                  styles.optionText,
                  selectedFoodTypes.find(item => item.id === foodType.id) && styles.optionTextSelected
                ]}>
                  {foodType.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );

  const renderRestrictionsStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.contentContainer}>
        <Text style={styles.stepTitle}>Restricciones alimentarias</Text>
        <Text style={styles.stepSubtitle}>
          Cuéntanos sobre tus preferencias y restricciones
        </Text>
        
        <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.optionsGrid}>
            {DIETARY_RESTRICTIONS.map((restriction) => (
              <TouchableOpacity
                key={restriction.id}
                style={[
                  styles.optionButton,
                  selectedRestrictions.find(item => item.id === restriction.id) && styles.optionButtonSelected
                ]}
                onPress={() => handleRestrictionToggle(restriction)}
              >
                <Text style={styles.optionIcon}>{restriction.icon}</Text>
                <Text style={[
                  styles.optionText,
                  selectedRestrictions.find(item => item.id === restriction.id) && styles.optionTextSelected
                ]}>
                  {restriction.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );

  const renderLocationStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.contentContainer}>
        <Text style={styles.stepTitle}>Ubicación</Text>
        <Text style={styles.stepSubtitle}>
          Permítenos acceder a tu ubicación para recomendarte lugares cercanos
        </Text>
        
        <View style={styles.locationIcon}>
          <Text style={styles.locationIconText}>📍</Text>
        </View>
        
        <Text style={styles.stepDescription}>
          Con tu ubicación podremos mostrarte los restaurantes más cercanos 
          y recomendaciones personalizadas para tu área.
        </Text>
        
        <TouchableOpacity style={styles.locationButton}>
          <Text style={styles.locationButtonText}>Permitir acceso a ubicación</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRegisterStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.contentContainer}>
        <Text style={styles.stepTitle}>¡Únete a nosotros!</Text>
        <Text style={styles.stepSubtitle}>
          Crea una cuenta para guardar tus preferencias y obtener recomendaciones personalizadas
        </Text>
        
        <View style={styles.registerIcon}>
          <Text style={styles.registerIconText}>👤</Text>
        </View>
        
        <Text style={styles.stepDescription}>
          Con una cuenta podrás guardar tus lugares favoritos, 
          recibir notificaciones de nuevos restaurantes y mucho más.
        </Text>
        
        <TouchableOpacity 
          style={styles.registerButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.registerButtonText}>Crear cuenta</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginButtonText}>Ya tengo cuenta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderWelcomeStep();
      case 1:
        return renderFoodTypesStep();
      case 2:
        return renderRestrictionsStep();
      case 3:
        return renderLocationStep();
      case 4:
        return renderRegisterStep();
      default:
        return renderWelcomeStep();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          {Array.from({ length: totalSteps }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index <= currentStep && styles.progressDotActive
              ]}
            />
          ))}
        </View>
      </View>

      {/* Step content with swipe gesture */}
      <PanGestureHandler onGestureEvent={handleSwipeGesture}>
        <View style={styles.stepWrapper}>
          {renderCurrentStep()}
        </View>
      </PanGestureHandler>

      {/* Navigation buttons */}
      <View style={styles.navigationContainer}>
        {currentStep < totalSteps - 1 && (
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Saltar</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentStep === totalSteps - 1 ? 'Comenzar' : 'Siguiente'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: '#FF6F00',
  },
  stepWrapper: {
    flex: 1,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  contentContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  stepSubtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  stepDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 20,
  },
  welcomeIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeIconText: {
    fontSize: 60,
  },
  locationIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  locationIconText: {
    fontSize: 50,
  },
  registerIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F3E5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  registerIconText: {
    fontSize: 50,
  },
  optionsContainer: {
    flex: 1,
    width: '100%',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  optionButton: {
    width: (screenWidth - 60) / 2,
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: '#FF6F00',
    borderColor: '#FF6F00',
  },
  optionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  optionTextSelected: {
    color: '#fff',
  },
  locationButton: {
    backgroundColor: '#FF6F00',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  locationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: '#FF6F00',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    marginBottom: 10,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  loginButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FF6F00',
  },
  loginButtonText: {
    color: '#FF6F00',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  skipButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: '#FF6F00',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
