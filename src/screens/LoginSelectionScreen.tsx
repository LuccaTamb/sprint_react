// src/screens/LoginSelectionScreen.tsx
import { View, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Role } from '../types';

export default function LoginSelectionScreen() {
  const navigation = useNavigation();

  const handleRoleSelection = (role: Role) => {
    navigation.navigate('Login', { role });
  };

  return (
    <View style={styles.container}>
      <Button
        title="Entrar como Usuário"
        onPress={() => handleRoleSelection('user')}
      />
      <Button
        title="Entrar como Família"
        onPress={() => handleRoleSelection('family')}
      />
      <Button
        title="Entrar como Psicólogo"
        onPress={() => handleRoleSelection('psychologist')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
});