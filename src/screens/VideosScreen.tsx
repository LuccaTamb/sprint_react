// src/screens/VideosScreen.tsx
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import VideoCard from '../components/VideoCard';
import { useTheme } from '../styles/globalStyles';

const videos = [
  {
    id: '1',
    title: 'Controlando impulsos',
    thumbnail: 'https://img.youtube.com/vi/abc123/mqdefault.jpg',
    url: 'https://youtube.com/watch?v=abc123',
  },
  {
    id: '2',
    title: 'Gerenciamento financeiro',
    thumbnail: 'https://img.youtube.com/vi/def456/mqdefault.jpg',
    url: 'https://youtube.com/watch?v=def456',
  },
];

export default function VideosScreen() {
  const theme = useTheme();

  return (
    <FlatList
      data={videos}
      contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <VideoCard
          title={item.title}
          thumbnail={item.thumbnail}
          url={item.url}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});