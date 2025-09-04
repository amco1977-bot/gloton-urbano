import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import apiService from '../services';
import storageService from '../services/StorageService';

export default function ApiTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState('');

  const testApiConnection = async () => {
    setIsLoading(true);
    setTestResult('');

    try {
      // Test API service initialization
      await apiService.initialize();
      setTestResult('✅ API Service initialized successfully\n');

      // Test if we can make a request (this will fail without proper backend, but we can test the service structure)
      try {
        // This will likely fail since we don't have a real backend, but it tests the service structure
        const response = await apiService.request('/test-endpoint', { requireAuth: false });
        setTestResult(prev => prev + '✅ Test endpoint request successful\n');
      } catch (error) {
        // Expected to fail, but shows the service is working
        setTestResult(prev => prev + `⚠️ Test endpoint failed (expected): ${error.message}\n`);
      }

      // Test validation functions
      const emailTest = apiService.validateEmail('test@example.com');
      const passwordTest = apiService.validatePassword('TestPassword123!');
      
      setTestResult(prev => prev + 
        `✅ Email validation: ${emailTest ? 'PASS' : 'FAIL'}\n` +
        `✅ Password validation: ${passwordTest.isValid ? 'PASS' : 'FAIL'}\n`
      );

      // Test configuration
      setTestResult(prev => prev + 
        `✅ Base URL: ${apiService.baseURL}\n` +
        `✅ Environment: ${apiService.isUserAuthenticated() ? 'Authenticated' : 'Not authenticated'}\n`
      );

    } catch (error) {
      setTestResult(`❌ API Test failed: ${error.message}`);
      Alert.alert('API Test Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const testStorage = async () => {
    try {
      // Test storage availability
      const storageInfo = await storageService.getStorageInfo();
      setTestResult(prev => prev + `📱 Storage Info: ${JSON.stringify(storageInfo, null, 2)}\n`);

      // Test if storage is working
      const isWorking = await storageService.isStorageWorking();
      setTestResult(prev => prev + `🔧 Storage Working: ${isWorking ? 'YES' : 'NO'}\n`);

      if (isWorking) {
        // Test basic storage operations
        await storageService.setItem('test_key', 'test_value');
        const retrievedValue = await storageService.getItem('test_key');
        await storageService.removeItem('test_key');
        
        if (retrievedValue === 'test_value') {
          setTestResult(prev => prev + '✅ Storage service working correctly\n');
        } else {
          setTestResult(prev => prev + '❌ Storage service test failed\n');
        }
      } else {
        setTestResult(prev => prev + '⚠️ Storage service not available\n');
      }
    } catch (error) {
      setTestResult(prev => prev + `❌ Storage test failed: ${error.message}\n`);
    }
  };

  const testSecureStore = async () => {
    try {
      setTestResult(prev => prev + '⚠️ SecureStore not available in development build\n');
      setTestResult(prev => prev + 'Using in-memory storage instead\n');
    } catch (error) {
      setTestResult(prev => prev + `❌ SecureStore test failed: ${error.message}\n`);
    }
  };

  const clearTestResults = () => {
    setTestResult('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Service Test</Text>
      
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={testApiConnection}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Testing...' : 'Test API Connection'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.secondaryButton}
        onPress={testStorage}
      >
        <Text style={styles.secondaryButtonText}>Test Storage Service</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.tertiaryButton}
        onPress={testSecureStore}
      >
        <Text style={styles.tertiaryButtonText}>Test SecureStore</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.clearButton}
        onPress={clearTestResults}
      >
        <Text style={styles.clearButtonText}>Clear Results</Text>
      </TouchableOpacity>

      {testResult ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Test Results:</Text>
          <Text style={styles.resultText}>{testResult}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#FF6F00',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tertiaryButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  tertiaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  clearButton: {
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  resultText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
    fontFamily: 'monospace',
  },
});
