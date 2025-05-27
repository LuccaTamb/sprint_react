// src/components/VideoCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useTheme } from '../styles/globalStyles';

type VideoCardProps = {
  title: string;
  thumbnail: string;
  url: string;
};

export default function VideoCard({ title, thumbnail, url }: VideoCardProps) {
  const theme = useTheme();

  const handlePress = () => {
    Linking.openURL(url).catch(err => console.error('Erro ao abrir URL:', err));
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <Image
        source={{ uri: thumbnail }}
        style={styles.thumbnail}
        accessibilityLabel={`Thumbnail do vídeo ${title}`}
      />
      <View style={styles.infoContainer}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
        <Entypo name="video" size={20} color={theme.colors.primary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 8,
  },
  thumbnail: {
    width: '100%',
    height: 180,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  title: {
    flex: 1,
    fontSize: 16,
    marginRight: 12,
  },
});