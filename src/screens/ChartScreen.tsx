// src/screens/ChartScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useTheme } from '../styles/globalStyles';
import LockButton from '../components/LockButton';
import AsyncService from '../storage/AsyncService';

import { useAuth } from '../context/AuthContext';

export default function ChartScreen() {
  const theme = useTheme();
  const [isBlocked, setIsBlocked] = useState(false);
  const { role } = useAuth();

  useEffect(() => {
    const loadBlockedStatus = async () => {
      const blocked = await AsyncService.getItem<boolean>(`blocked_${role}`);
      setIsBlocked(!!blocked);
    };
    loadBlockedStatus();
  }, []);

  const handleToggleBlock = async () => {
    const newStatus = !isBlocked;
    setIsBlocked(newStatus);
    await AsyncService.setItem(`blocked_${role}`, newStatus);
  };

  const chartData = {
    labels: ['Alimentação', 'Essenciais', 'Apostas'],
    datasets: [{
      data: [300, 450, 800],
      colors: [
        theme.colors.success,
        theme.colors.primary,
        theme.colors.danger,
      ]
    }]
  };

  return (
    <View style={styles.container}>
      <LockButton
        locked={isBlocked}
        onToggle={handleToggleBlock}
        size={32}
        style={styles.lockButton}
      />
      
      <BarChart
        data={chartData}
        width={350}
        height={220}
        yAxisLabel="R$"
        chartConfig={{
          backgroundColor: theme.colors.background,
          backgroundGradientFrom: theme.colors.background,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          barPercentage: 0.5,
        }}
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  chart: {
    marginVertical: 20,
    borderRadius: 16,
  },
  lockButton: {
    position: 'absolute',
    top: 10,
    right: 20,
    zIndex: 1,
  },
});

