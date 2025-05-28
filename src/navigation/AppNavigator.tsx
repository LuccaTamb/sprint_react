// src/navigation/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import LoginSelectionScreen from '../screens/LoginSelectionScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ChartScreen from '../screens/ChartScreen';
import AppsScreen from '../screens/AppsScreen';
import VideosScreen from '../screens/VideosScreen';
import ChatScreen from '../screens/ChatScreen';
import ScreenLearning from '../screens/ScreenLearning';
import ScreenComments from '../screens/ScreenComments';

import { Entypo, FontAwesome } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Gráficos') iconName = 'bar-graph';
          else if (route.name === 'Apps') iconName = 'browser';
          else if (route.name === 'Vídeos') iconName = 'video';
          else if (route.name === 'Chat') iconName = 'chat';
          return <Entypo name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2ecc71',
        tabBarInactiveTintColor: '#95a5a6',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Gráficos" component={ChartScreen} />
      <Tab.Screen name="Apps" component={AppsScreen} />
      <Tab.Screen name="Vídeos" component={VideosScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { role, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <Stack.Navigator>
      {role ? (
        <Stack.Screen
          name="Main"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="LoginSelection"
            component={LoginSelectionScreen}
            options={{ title: 'Selecione o Tipo de Login' }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: 'Login' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}