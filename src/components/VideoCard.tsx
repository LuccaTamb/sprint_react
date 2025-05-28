// src/components/VideoCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking, Dimensions } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useTheme } from '../styles/globalStyles';

type VideoCardProps = {
  title: string;
  thumbnail: string;
  url: string;
  columns: number;
};

export default function VideoCard({ title, thumbnail, url, columns }: VideoCardProps) {
  const theme = useTheme();

  const screenWidth = Dimensions.get('window').width;
  const spacing = 24; // margem entre os cards
  const cardWidth = (screenWidth - spacing * (columns + 1)) / columns;

  const handlePress = () => {
    Linking.openURL(url).catch(err => console.error('Erro ao abrir URL:', err));
  };

  return (
    <TouchableOpacity onPress={handlePress} style={[styles.container, { width: cardWidth, backgroundColor: theme.colors.card }]}>
      <Image
        source={{ uri: thumbnail }}
        style={styles.thumbnail}
        accessibilityLabel={`Thumbnail do vídeo ${title}`}
      />
      <View style={styles.infoContainer}>
        <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={2}>
          {title}
        </Text>
        <Entypo name="video" size={20} color={theme.colors.primary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   borderRadius: 10,
  //   overflow: 'hidden',
  //   marginBottom: 12,
  //   elevation: 2,
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 1 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 2,
  // },
  // thumbnail: {
  //   width: '90%',
  //   height: 250, 
  //   resizeMode: 'cover',
  // },
  container: {
    flex: 1,
    margin: 6,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
    maxWidth: '48%', 
  },
  thumbnail: {
    width: '100%',
    aspectRatio: 16 / 9,  
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  }, //

  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
});
