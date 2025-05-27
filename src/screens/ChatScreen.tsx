// src/screens/ChatScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';
import { useTheme } from '../styles/globalStyles';
import AsyncService from '../storage/AsyncService';
import { Message } from '../types';

import { useAuth } from '../context/AuthContext';

export default function ChatScreen() {
  const theme = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { role } = useAuth();

  useEffect(() => {
    const loadMessages = async () => {
      const storedMessages = await AsyncService.getItem<Message[]>(`chat_${role}`);
      setMessages(storedMessages || []);
    };
    loadMessages();
  }, []);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      timestamp: Date.now(),
      sender: 'user',
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    await AsyncService.setItem(`chat_${role}`, updatedMessages);
    setNewMessage('');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[
            styles.messageBubble,
            { 
              backgroundColor: item.sender === 'user' ? theme.colors.primary : '#e0e0e0',
              alignSelf: item.sender === 'user' ? 'flex-end' : 'flex-start',
            }
          ]}>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.timestamp}>
              {new Date(item.timestamp).toLocaleTimeString()}
            </Text>
          </View>
        )}
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Digite uma mensagem..."
          style={styles.input}
        />
        <Button title="Enviar" onPress={handleSend} color={theme.colors.primary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginVertical: 8,
  },
  messageText: {
    color: 'white',
  },
  timestamp: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
});