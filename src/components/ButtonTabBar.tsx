// src/components/BottomTabBar.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../styles/globalStyles';
import { Entypo, FontAwesome } from '@expo/vector-icons';

type TabBarProps = {
  state: any;
  descriptors: any;
  navigation: any;
};

export default function BottomTabBar({ state, descriptors, navigation }: TabBarProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const iconMap: { [key: string]: JSX.Element } = {
          Home: <Entypo name="home" size={24} color={isFocused ? theme.colors.primary : theme.colors.inactive} />,
          Gráficos: <FontAwesome name="bar-chart" size={24} color={isFocused ? theme.colors.primary : theme.colors.inactive} />,
          Apps: <Entypo name="grid" size={24} color={isFocused ? theme.colors.primary : theme.colors.inactive} />,
          Vídeos: <FontAwesome name="video-camera" size={24} color={isFocused ? theme.colors.primary : theme.colors.inactive} />,
          Chat: <Entypo name="chat" size={24} color={isFocused ? theme.colors.primary : theme.colors.inactive} />,
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={() => navigation.navigate(route.name)}
            style={styles.tabButton}
          >
            {iconMap[route.name]}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
