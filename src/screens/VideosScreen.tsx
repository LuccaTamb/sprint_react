import React from 'react';
import { FlatList, StyleSheet, Dimensions } from 'react-native';
import VideoCard from '../components/VideoCard';
import { useTheme } from '../styles/globalStyles';

const videos = [
  { id: '1', title: 'Vídeo Genérico 1', thumbnail: 'https://img.youtube.com/vi/Wj4814pYAYg/mqdefault.jpg', url: 'https://youtube.com/watch?v=Wj4814pYAYg' },
  { id: '2', title: 'Vídeo Genérico 2', thumbnail: 'https://img.youtube.com/vi/def456/mqdefault.jpg', url: 'https://youtube.com/watch?v=def456' },
  { id: '3', title: 'Vídeo Genérico 3', thumbnail: 'https://img.youtube.com/vi/ghi789/mqdefault.jpg', url: 'https://youtube.com/watch?v=ghi789' },
  { id: '4', title: 'Vídeo Genérico 4', thumbnail: 'https://img.youtube.com/vi/jkl012/mqdefault.jpg', url: 'https://youtube.com/watch?v=jkl012' },
];

const screenWidth = Dimensions.get('window').width;
const numColumns = screenWidth < 360 ? 1 : 2; // 360px é bem seguro pra celular

export default function VideosScreen() {
  const theme = useTheme();

  return (
    <FlatList
      data={videos}
      contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
      renderItem={({ item }) => (
        <VideoCard
          title={item.title}
          thumbnail={item.thumbnail}
          url={item.url}
          columns={numColumns}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});
