import AsyncStorage from '@react-native-async-storage/async-storage';

export default class AsyncService {
  static async setItem(key: string, value: any) {
    try {
      await AsyncStorage.setItem(`@GamblingControl:${key}`, JSON.stringify(value));
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  }

  static async getItem<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(`@GamblingControl:${key}`);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Erro ao ler:', error);
      return null;
    }
  }

  static async removeItem(key: string) {
    await AsyncStorage.removeItem(`@GamblingControl:${key}`);
  }
}