// src/screens/AppsScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useTheme } from '../styles/globalStyles';
import LockButton from '../components/LockButton';
import AsyncService from '../storage/AsyncService';

import { useAuth } from '../context/AuthContext';

type AppItem = {
  id: string;
  name: string;
  usage: string;
};

export default function AppsScreen() {
  const theme = useTheme();
  const [apps, setApps] = useState<AppItem[]>([]);
  const { role } = useAuth();

  useEffect(() => {
    // Dados mockados
    const mockApps: AppItem[] = [
      { id: '1', name: 'Bet365',   usage: '2h 37m' },
      { id: '2', name: 'Betano',   usage: '1h 19m' },
      { id: '3', name: 'Superbet', usage: '0h 32m' },
      { id: '4', name: 'KTO',          usage: '1h 56m' },
      { id: '4', name: 'Sportingbet',          usage: '0h 06m' },
      { id: '4', name: 'F12 bet',          usage: '1h 47m' },
      { id: '4', name: 'Betnacional',          usage: '0h 16m' },
    ];
    setApps(mockApps);
  }, []);

  const handleToggleLock = async (appId: string) => {
    const updatedApps = apps.map(app => 
      app.id === appId ? { ...app, locked: !app.locked } : app
    );
    setApps(updatedApps);
    await AsyncService.setItem(`appLocked_${appId}_${role}`, !app.locked);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={apps}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.appItem}>
            <View style={styles.appInfo}>
              <Text style={[styles.appName, { color: theme.colors.text }]}>
                {item.name}
              </Text>
              <Text style={{ color: theme.colors.inactive }}>
                {item.usage}
              </Text>
            </View>
            <LockButton
              locked={item.locked || false}
              onToggle={() => handleToggleLock(item.id)}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  appItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  appInfo: {
    flex: 1,
    marginRight: 16,
  },
  appName: {
    fontSize: 16,
    fontWeight: '500',
  },
});