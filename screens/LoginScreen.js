import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from 'react-native';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  // Navigate to Welcome if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigation.replace('Welcome');
    }
  }, [isAuthenticated, authLoading, navigation]);

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'El correo es requerido';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Ingresa un correo válido';
    }

    // Password validation
    if (!password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Simple email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle login
  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const credentials = {
        email: email.trim(),
        password: password,
        device_name: Platform.OS === 'ios' ? 'iPhone' : 'Android',
        remember: true,
      };

      console.log('Attempting login with:', { email: credentials.email, device_name: credentials.device_name });

      const result = await login(credentials);

      if (result.success) {
        console.log('Login successful:', result.user.name);
        
        // Show success message
        Alert.alert(
          '¡Bienvenido!',
          `Hola ${result.user.name}, has iniciado sesión correctamente.`,
          [
            {
              text: 'Continuar',
              onPress: () => navigation.replace('Welcome')
            }
          ]
        );
      } else {
        console.error('Login failed:', result.message);
        Alert.alert('Error', result.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle specific error types
      if (error.message.includes('401')) {
        Alert.alert('Error', 'Correo o contraseña incorrectos');
      } else if (error.message.includes('422')) {
        Alert.alert('Error', 'Datos de entrada inválidos');
      } else if (error.message.includes('Network')) {
        Alert.alert('Error de conexión', 'Verifica tu conexión a internet e intenta nuevamente');
      } else {
        Alert.alert('Error', 'Error al iniciar sesión. Intenta nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle forgot password
  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Ingresa tu correo para recuperar tu contraseña');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Ingresa un correo válido');
      return;
    }

    Alert.alert(
      'Funcionalidad pendiente',
      'La recuperación de contraseña estará disponible próximamente.',
      [{ text: 'OK' }]
    );
  };

  // Handle register navigation
  const handleRegister = () => {
    Alert.alert(
      'Registro',
      '¿Deseas crear una nueva cuenta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Registrarse', onPress: () => alert('Funcionalidad de registro pendiente') }
      ]
    );
  };

  // Show loading screen while auth is initializing
  if (authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6F00" />
        <Text style={styles.loadingText}>Inicializando...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header title="Iniciar Sesión" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <Text style={styles.title}>Bienvenido a Glotón Urbano</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Correo electrónico:</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Ingresa tu correo"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña:</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput, errors.password && styles.inputError]}
                placeholder="Ingresa tu contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eyeButtonText}>
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          {/* Forgot Password */}
          <TouchableOpacity 
            style={styles.forgotPassword}
            onPress={handleForgotPassword}
            disabled={isLoading}
          >
            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Iniciar sesión</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>¿No tienes cuenta?</Text>
          <TouchableOpacity 
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.registerButtonText}>Registrarse</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  form: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: '#ff4444',
    backgroundColor: '#fff5f5',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    padding: 5,
  },
  eyeButtonText: {
    fontSize: 20,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginTop: 5,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: '#FF6F00',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#FF6F00',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  registerButton: {
    padding: 10,
  },
  registerButtonText: {
    color: '#FF6F00',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
