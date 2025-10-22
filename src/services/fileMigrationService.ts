import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { storage, db } from '@/config/firebase';
import { FileMeta } from '@/types';

export interface MigrationProgress {
  fileId: string;
  filename: string;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  error?: string;
  progress?: number;
}

export const fileMigrationService = {
  async migrateFile(
    fileMeta: FileMeta,
    blob: Blob,
    onProgress?: (progress: number) => void
  ): Promise<void> {
    try {
      if (fileMeta.storageType === 'firebase') {
        throw new Error('File already migrated to Firebase Storage');
      }

      const storagePath = `files/${fileMeta.ownerType}/${fileMeta.ownerId}/${fileMeta.id}_${fileMeta.filename}`;
      const storageRef = ref(storage, storagePath);

      onProgress?.(10);

      await uploadBytes(storageRef, blob, {
        contentType: fileMeta.mimeType,
      });

      onProgress?.(80);

      const fileMetaRef = doc(db, 'fileMeta', fileMeta.id);
      await updateDoc(fileMetaRef, {
        storageType: 'firebase',
        storagePath,
        migratedAt: Timestamp.now().toDate().toISOString(),
        updatedAt: Timestamp.now().toDate().toISOString(),
      });

      onProgress?.(100);
    } catch (error) {
      console.error('Error migrating file:', error);
      throw error;
    }
  },

  async getFileFromIndexedDB(fileId: string): Promise<Blob | null> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('schoolFilesDB', 1);

      request.onerror = () => reject(request.error);

      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['files'], 'readonly');
        const store = transaction.objectStore('files');
        const getRequest = store.get(fileId);

        getRequest.onsuccess = () => {
          resolve(getRequest.result?.blob || null);
        };

        getRequest.onerror = () => reject(getRequest.error);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('files')) {
          db.createObjectStore('files', { keyPath: 'id' });
        }
      };
    });
  },

  async deleteFileFromIndexedDB(fileId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('schoolFilesDB', 1);

      request.onerror = () => reject(request.error);

      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['files'], 'readwrite');
        const store = transaction.objectStore('files');
        const deleteRequest = store.delete(fileId);

        deleteRequest.onsuccess = () => resolve();
        deleteRequest.onerror = () => reject(deleteRequest.error);
      };
    });
  },

  async migrateFilesInBatch(
    files: FileMeta[],
    onFileProgress: (fileId: string, progress: MigrationProgress) => void
  ): Promise<{ successful: number; failed: number }> {
    let successful = 0;
    let failed = 0;

    for (const fileMeta of files) {
      try {
        onFileProgress(fileMeta.id, {
          fileId: fileMeta.id,
          filename: fileMeta.filename,
          status: 'uploading',
        });

        const blob = await this.getFileFromIndexedDB(fileMeta.id);
        if (!blob) {
          throw new Error('File not found in IndexedDB');
        }

        await this.migrateFile(fileMeta, blob, (progress) => {
          onFileProgress(fileMeta.id, {
            fileId: fileMeta.id,
            filename: fileMeta.filename,
            status: 'uploading',
            progress,
          });
        });

        onFileProgress(fileMeta.id, {
          fileId: fileMeta.id,
          filename: fileMeta.filename,
          status: 'completed',
          progress: 100,
        });

        successful++;
      } catch (error) {
        console.error(`Failed to migrate file ${fileMeta.id}:`, error);
        onFileProgress(fileMeta.id, {
          fileId: fileMeta.id,
          filename: fileMeta.filename,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        failed++;
      }
    }

    return { successful, failed };
  },

  async getFileURL(fileMeta: FileMeta): Promise<string> {
    try {
      if (fileMeta.storageType === 'firebase' && fileMeta.storagePath) {
        const storageRef = ref(storage, fileMeta.storagePath);
        return await getDownloadURL(storageRef);
      } else if (fileMeta.storageType === 'indexeddb') {
        const blob = await this.getFileFromIndexedDB(fileMeta.id);
        if (blob) {
          return URL.createObjectURL(blob);
        }
      }
      throw new Error('File not found');
    } catch (error) {
      console.error('Error getting file URL:', error);
      throw error;
    }
  },
};
