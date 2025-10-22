import { collection, addDoc, query, where, orderBy, getDocs, Timestamp, limit } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { ActivityLog } from '@/types';

export const activityLogService = {
  async logActivity(
    actorUid: string,
    actorName: string,
    action: ActivityLog['action'],
    entityType: string,
    entityId: string,
    diff?: Record<string, { old: any; new: any }>,
    snapshot?: Record<string, any>,
    meta?: Record<string, any>
  ): Promise<string> {
    try {
      const logEntry: Omit<ActivityLog, 'id'> = {
        actorUid,
        actorName,
        action,
        entityType,
        entityId,
        diff,
        snapshot,
        timestamp: Timestamp.now().toDate().toISOString(),
        meta,
      };

      const docRef = await addDoc(collection(db, 'activityLogs'), logEntry);
      return docRef.id;
    } catch (error) {
      console.error('Error logging activity:', error);
      throw error;
    }
  },

  async getEntityHistory(entityType: string, entityId: string): Promise<ActivityLog[]> {
    try {
      const q = query(
        collection(db, 'activityLogs'),
        where('entityType', '==', entityType),
        where('entityId', '==', entityId),
        orderBy('timestamp', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ActivityLog[];
    } catch (error) {
      console.error('Error getting entity history:', error);
      throw error;
    }
  },

  async getRecentActivity(actorUid?: string, limitCount: number = 50): Promise<ActivityLog[]> {
    try {
      let q = query(
        collection(db, 'activityLogs'),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );

      if (actorUid) {
        q = query(
          collection(db, 'activityLogs'),
          where('actorUid', '==', actorUid),
          orderBy('timestamp', 'desc'),
          limit(limitCount)
        );
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ActivityLog[];
    } catch (error) {
      console.error('Error getting recent activity:', error);
      throw error;
    }
  },

  computeDiff(oldData: Record<string, any>, newData: Record<string, any>): Record<string, { old: any; new: any }> {
    const diff: Record<string, { old: any; new: any }> = {};

    const allKeys = new Set([...Object.keys(oldData || {}), ...Object.keys(newData || {})]);

    allKeys.forEach(key => {
      if (key === 'updatedAt' || key === 'createdAt') return;

      const oldValue = oldData?.[key];
      const newValue = newData?.[key];

      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        diff[key] = { old: oldValue, new: newValue };
      }
    });

    return diff;
  },

  async revertToSnapshot(
    entityType: string,
    entityId: string,
    snapshot: Record<string, any>,
    actorUid: string,
    actorName: string
  ): Promise<void> {
    try {
      const { firestoreService } = await import('./firestoreService');

      await firestoreService.update(entityType, entityId, snapshot);

      await this.logActivity(
        actorUid,
        actorName,
        'revert',
        entityType,
        entityId,
        undefined,
        snapshot,
        { revertedFrom: 'snapshot' }
      );
    } catch (error) {
      console.error('Error reverting to snapshot:', error);
      throw error;
    }
  },
};
