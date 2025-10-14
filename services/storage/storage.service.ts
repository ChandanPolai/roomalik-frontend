// services/storage/storage.service.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from '../logger/logger.service';

class StorageService {
  async setItem(key: string, value: string): Promise<void> {
    try {
      logger.storageAction('Set item', key, value);
      await AsyncStorage.setItem(key, value);
      logger.storageAction('Set item successful', key);
    } catch (error) {
      logger.storageError(error, 'Set Item', key);
      throw error;
    }
  }

  async getItem(key: string): Promise<string | null> {
    try {
      logger.storageAction('Get item', key);
      const value = await AsyncStorage.getItem(key);
      logger.storageAction('Get item successful', key, value ? 'found' : 'not found');
      return value;
    } catch (error) {
      logger.storageError(error, 'Get Item', key);
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      logger.storageAction('Remove item', key);
      await AsyncStorage.removeItem(key);
      logger.storageAction('Remove item successful', key);
    } catch (error) {
      logger.storageError(error, 'Remove Item', key);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      logger.storageAction('Clear all storage');
      await AsyncStorage.clear();
      logger.storageAction('Clear all storage successful');
    } catch (error) {
      logger.storageError(error, 'Clear Storage');
      throw error;
    }
  }

  async setObject(key: string, value: any): Promise<void> {
    try {
      logger.storageAction('Set object', key, typeof value);
      const jsonValue = JSON.stringify(value);
      await this.setItem(key, jsonValue);
      logger.storageAction('Set object successful', key);
    } catch (error) {
      logger.storageError(error, 'Set Object', key);
      throw error;
    }
  }

  async getObject<T>(key: string): Promise<T | null> {
    try {
      logger.storageAction('Get object', key);
      const jsonValue = await this.getItem(key);
      const result = jsonValue ? JSON.parse(jsonValue) : null;
      logger.storageAction('Get object successful', key, result ? 'found' : 'not found');
      return result;
    } catch (error) {
      logger.storageError(error, 'Get Object', key);
      return null;
    }
  }
}

export default new StorageService();