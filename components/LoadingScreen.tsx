import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  error?: Error | null;
  onRetry?: () => void;
};

export default function LoadingScreen({ error, onRetry }: Props) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons 
          name="close-circle" 
          size={200} 
          color="#dc3545" 
          style={styles.errorIcon}
        />
        <Text style={styles.errorTitle}>Что то пошло не так.</Text>
        <Text style={styles.errorMessage}>
          {error.message ||
            'Неизвестная ошибка произошла при загрузке приложения.'}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Попробовать снова</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/icons/mainIcon.png')} // Replace with your logo/loading icon path
        style={styles.loadingIcon}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0073e6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIcon: {
    width: 200,
    height: 200,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorIcon: {
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#0073e6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});