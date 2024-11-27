interface StorageData {
  data: any;
  timestamp: number;
}

export class StorageService {
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  async getData(key: string): Promise<StorageData | null> {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn('Error reading from localStorage:', error);
      return null;
    }
  }

  async saveData(key: string, data: any): Promise<void> {
    try {
      const storageData: StorageData = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(key, JSON.stringify(storageData));
    } catch (error) {
      console.warn('Error writing to localStorage:', error);
    }
  }

  isDataStale(timestamp: number): boolean {
    return Date.now() - timestamp > this.CACHE_DURATION;
  }
}