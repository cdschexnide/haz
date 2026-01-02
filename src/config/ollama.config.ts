import { Platform } from 'react-native';

/**
 * Ollama configuration for different environments
 */
export const getOllamaUrl = (): string => {
  // For iOS Simulator on Mac
  if (Platform.OS === 'ios' && __DEV__) {
    // iOS simulator can use localhost
    return 'http://localhost:11434';
  }
  
  // For Android - use actual IP address
  if (Platform.OS === 'android' && __DEV__) {
    // For physical Android devices, use the Mac's IP address
    // Android can't use localhost unless you run: adb reverse tcp:11434 tcp:11434
    return 'http://192.168.12.210:11434';
  }
  
  // For physical devices on WiFi or production
  // Update this with your Mac's actual IP address when testing on physical devices
  // You can find it using: ifconfig | grep "inet " | grep -v 127.0.0.1
  return 'http://192.168.12.210:11434';
};

// Export the default URL
export const OLLAMA_BASE_URL = getOllamaUrl();

// Model configuration
export const OLLAMA_CONFIG = {
  model: 'gemma-sddg-v3',
  timeout: 60000,
  temperature: 0.1,
  numPredict: 3000,
  topK: 10,
  topP: 0.9
};