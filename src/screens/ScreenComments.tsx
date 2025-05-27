// src/screens/ScreenComments.tsx
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';
import { useTheme } from '../styles/globalStyles';
import AsyncService from '../storage/AsyncService';

type Comment = {
  id: string;
  text: string;
  author: string;
  timestamp: number;
};

export default function ScreenComments() {
  const theme = useTheme();
  const { role } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const loadComments = async () => {
      const savedComments = await AsyncService.getItem<Comment[]>(`comments_${role}`);
      setComments(savedComments || []);
    };
    loadComments();
  }, []);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      text: newComment,
      author: role === 'psychologist' ? 'Psicólogo' : 'Familiar',
      timestamp: Date.now(),
    };

    const updated = [...comments, comment];
    setComments(updated);
    await AsyncService.setItem(`comments_${role}`, updated);
    setNewComment('');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[
            styles.commentBubble,
            { 
              backgroundColor: item.author === 'Psicólogo' 
                ? theme.colors.primary 
                : '#e0e0e0'
            }
          ]}>
            <Text style={styles.commentAuthor}>{item.author}</Text>
            <Text style={styles.commentText}>{item.text}</Text>
            <Text style={styles.timestamp}>
              {new Date(item.timestamp).toLocaleDateString('pt-BR')}
            </Text>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={newComment}
          onChangeText={setNewComment}
          placeholder="Adicione um comentário..."
          style={[styles.input, { borderColor: theme.colors.primary }]}
        />
        <Button 
          title="Enviar" 
          onPress={handleAddComment} 
          color={theme.colors.primary} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  commentBubble: {
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    maxWidth: '80%',
  },
  commentAuthor: {
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  commentText: {
    color: 'white',
  },
  timestamp: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
  },
});