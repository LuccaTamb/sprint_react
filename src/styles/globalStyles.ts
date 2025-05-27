// src/styles/globalStyles.ts
import { StyleSheet } from 'react-native';

export const theme = {
  colors: {
    primary: '#2ecc71',
    danger: '#e74c3c',
    success: '#2ecc71',
    background: '#ffffff',
    text: '#2c3e50',
    inactive: '#95a5a6',
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
  },
};

export const useTheme = () => theme;

export const globalStyles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});