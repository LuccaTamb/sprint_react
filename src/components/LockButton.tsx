// src/components/LockButton.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../styles/globalStyles'; // Você precisará criar este arquivo

type LockButtonProps = {
  locked: boolean;
  onToggle: () => void;
  size?: number;
};

export default function LockButton({ locked, onToggle, size = 24 }: LockButtonProps) {
  const theme = useTheme(); // Hook para acessar o tema

  return (
    <TouchableOpacity
      onPress={onToggle}
      style={styles.container}
      accessibilityLabel={locked ? 'Desbloquear' : 'Bloquear'}
    >
      <FontAwesome
        name={locked ? 'lock' : 'unlock'}
        size={size}
        color={locked ? theme.colors.danger : theme.colors.success}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});