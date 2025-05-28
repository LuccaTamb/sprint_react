// src/screens/ChartScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useTheme } from '../styles/globalStyles';
import { useAuth } from '../context/AuthContext';
import AsyncService from '../storage/AsyncService';

export default function ChartScreen() {
  const theme = useTheme();
  const [isBlocked, setIsBlocked] = useState<boolean | null>(null);
  const { role } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        if (!role) {
          throw new Error('Perfil de usuário não definido');
        }

        const blocked = await AsyncService.getItem<boolean>(`blocked_${role}`);
        setIsBlocked(!!blocked);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar dados do gráfico');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [role]);

  const handleToggleBlock = async () => {
    try {
      if (!role) return;

      const newStatus = !isBlocked;
      setIsBlocked(newStatus);
      await AsyncService.setItem(`blocked_${role}`, newStatus);
    } catch (err) {
      console.error('Erro ao atualizar bloqueio:', err);
    }
  };

  // Caso esteja carregando
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  const chartData = {
    labels: ['Alimentação', 'Essenciais', 'Apostas'],
    datasets: [{
      data: [300, 450, 800]
    }]
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <BarChart
          data={chartData}
          width={350}
          height={220}
          yAxisLabel="R$"
          fromZero
          chartConfig={{
            backgroundColor: theme.colors.background,
            backgroundGradientFrom: theme.colors.background,
            backgroundGradientTo: theme.colors.background,
            decimalPlaces: 0,
            color: () => theme.colors.text,
            barPercentage: 0.5,
            propsForLabels: {
              fontSize: 12,
              fontWeight: 'bold'
            }
          }}
          style={styles.chart}
          // Adiciona cor customizada para cada barra
          customBarColor={({ index }) => [
            theme.colors.success,
            theme.colors.primary,
            theme.colors.danger
          ][index]}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  chart: {
    marginVertical: 20,
    borderRadius: 16,
    padding: 8,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
});