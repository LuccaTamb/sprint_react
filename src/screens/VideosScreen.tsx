import React from 'react';
import { FlatList, StyleSheet, Dimensions } from 'react-native';
import VideoCard from '../components/VideoCard';
import { useTheme } from '../styles/globalStyles';

const videos = [
  { id: '1', title: 'Vídeo Genérico 1', thumbnail: 'https://img.youtube.com/vi/ueH75QNaRCE/mqdefault.jpg', url: 'https://www.youtube.com/watch?v=ueH75QNaRCE' },
  { id: '2', title: 'Vídeo Genérico 2', thumbnail: 'https://img.youtube.com/vi/SGWaWN9gdpg/mqdefault.jpg', url: 'https://www.youtube.com/watch?v=SGWaWN9gdpg' },
  { id: '3', title: 'Vídeo Genérico 3', thumbnail: 'https://img.youtube.com/vi/4ZIMlyb-DU4/mqdefault.jpg', url: 'https://www.youtube.com/watch?v=4ZIMlyb-DU4' },
  { id: '4', title: 'Vídeo Genérico 4', thumbnail: 'https://img.youtube.com/vi/Wj4814pYAYg/mqdefault.jpg', url: 'https://www.youtube.com/watch?v=Wj4814pYAYg' },
  { id: '5', title: 'Vídeo Genérico 4', thumbnail: 'https://img.youtube.com/vi/KYDxlcDi2cU/mqdefault.jpg', url: 'https://www.youtube.com/watch?v=KYDxlcDi2cU' },
  { id: '6', title: 'Vídeo Genérico 4', thumbnail: 'https://img.youtube.com/vi/wYXig5UCwYU/mqdefault.jpg', url: 'https://www.youtube.com/watch?v=wYXig5UCwYU' },
  { id: '7', title: 'Vídeo Genérico 4', thumbnail: 'https://img.youtube.com/vi/6sg6n0araLQ/mqdefault.jpg', url: 'https://www.youtube.com/watch?v=6sg6n0araLQ' },
  { id: '8', title: 'Vídeo Genérico 4', thumbnail: 'https://img.youtube.com/vi/Z0St-tW--nc/mqdefault.jpg', url: 'https://www.youtube.com/watch?v=Z0St-tW--nc' },
];

const screenWidth = Dimensions.get('window').width;
const numColumns = screenWidth < 360 ? 1 : 2;

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
