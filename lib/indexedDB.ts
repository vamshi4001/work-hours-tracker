export interface HoursData {
  [monthKey: string]: {
    [dayKey: string]: string;
  };
}

class HoursDB {
  private dbName = 'HoursTrackerDB';
  private version = 1;
  private storeName = 'hours';

  async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'monthKey' });
        }
      };
    });
  }

  async saveMonthData(monthKey: string, data: { [dayKey: string]: string }): Promise<void> {
    const db = await this.openDB();
    const transaction = db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.put({ monthKey, data });
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getMonthData(monthKey: string): Promise<{ [dayKey: string]: string } | null> {
    const db = await this.openDB();
    const transaction = db.transaction([this.storeName], 'readonly');
    const store = transaction.objectStore(this.storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.get(monthKey);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.data : null);
      };
    });
  }
}

export const hoursDB = new HoursDB();
