// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { RouteProp } from '@react-navigation/native';
import { Role } from '../types';

type LoginScreenRouteProp = RouteProp<{ params: { role: Role } }, 'params'>;

export default function LoginScreen({ route }: { route: LoginScreenRouteProp }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // const handleLogin = async () => {
  //   try {
  //     await login(route.params.role, email, password);
  //   } catch (error) {
  //     Alert.alert('Erro', error.message);
  //   }
  // };
  const handleLogin = async () => {
  try {
    await login(route.params.role, email, password);
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert('Erro', error.message);
    } else {
      Alert.alert('Erro', 'Ocorreu um erro desconhecido.');
    }
  }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
  },
});