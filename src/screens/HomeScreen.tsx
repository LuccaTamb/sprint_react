// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../styles/globalStyles';


export default function HomeScreen() {
  const { user, role, logout } = useAuth();
  const theme = useTheme();

  const getWelcomeMessage = () => {
    switch (role) {
      case 'user':
        return 'Bem-vindo ao seu controle de gastos!';
      case 'family':
        return 'Acompanhamento familiar ativo';
      case 'psychologist':
        return 'Painel de monitoramento psicológico';
      default:
        return 'Bem-vindo';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.primary }]}>
        {getWelcomeMessage()}
      </Text>
      <Text style={{ color: theme.colors.text }}>Logado como: {user?.email}</Text>
      
      <Button
        title="Sair"
        onPress={logout}
        color={theme.colors.danger}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});