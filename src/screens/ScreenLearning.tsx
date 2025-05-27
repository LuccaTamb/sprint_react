// src/screens/ScreenLearning.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useTheme } from '../styles/globalStyles';
import VideoCard from '../components/VideoCard';
import LockButton from '../components/LockButton';
import AsyncService from '../storage/AsyncService';

type VideoStatus = {
  watched: boolean;
  locked: boolean;
};

export default function ScreenLearning() {
  const theme = useTheme();
  const { role } = useAuth();
  const [videos, setVideos] = useState([
    {
      id: '1',
      title: 'Controle de Impulsos',
      url: 'https://youtube.com/watch?v=ABC123',
      status: { watched: false, locked: false },
    },
    {
      id: '2',
      title: 'Gerenciamento Financeiro',
      url: 'https://youtube.com/watch?v=DEF456',
      status: { watched: true, locked: false },
    },
  ]);

  useEffect(() => {
    const loadVideoStatus = async () => {
      const savedStatus = await AsyncService.getItem<VideoStatus[]>(`learningStatus_${role}`);
      if (savedStatus) {
        setVideos(prev => prev.map((video, index) => ({
          ...video,
          status: savedStatus[index] || video.status
        }))
    )}
    };
    loadVideoStatus();
  }, []);

  const handleToggleLock = async (videoId: string) => {
    const updated = videos.map(video => 
      video.id === videoId 
        ? { ...video, status: { ...video.status, locked: !video.status.locked } } 
        : video
    );
    setVideos(updated);
    await AsyncService.setItem(`learningStatus_${role}`, updated.map(v => v.status));
  };

  const handlePressVideo = (url: string) => {
    Linking.openURL(url).catch(err => 
      Alert.alert('Erro', 'Não foi possível abrir o vídeo')
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {videos.map((video) => (
        <View key={video.id} style={styles.videoContainer}>
          <TouchableOpacity 
            onPress={() => !video.status.locked && handlePressVideo(video.url)}
            disabled={video.status.locked}
          >
            <VideoCard
              title={video.title}
              thumbnail={video.status.watched ? '✅' : '📺'}
              url={video.url}
              style={{ opacity: video.status.locked ? 0.5 : 1 }}
            />
          </TouchableOpacity>
          
          <View style={styles.statusContainer}>
            <Text style={{ color: video.status.watched ? theme.colors.success : theme.colors.text }}>
              {video.status.watched ? 'Concluído' : 'Não assistido'}
            </Text>
            <LockButton
              locked={video.status.locked}
              onToggle={() => handleToggleLock(video.id)}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  videoContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
});