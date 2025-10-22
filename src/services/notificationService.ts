import { collection, addDoc, query, where, orderBy, getDocs, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Notification } from '@/types';

export const notificationService = {
  async createNotification(
    uid: string,
    title: string,
    body: string,
    type: Notification['type'],
    meta?: Record<string, any>
  ): Promise<string> {
    try {
      const notification: Omit<Notification, 'id'> = {
        uid,
        title,
        body,
        type,
        read: false,
        meta,
        createdAt: Timestamp.now().toDate().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'notifications'), notification);
      return docRef.id;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  async getUserNotifications(uid: string): Promise<Notification[]> {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('uid', '==', uid),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
    } catch (error) {
      console.error('Error getting user notifications:', error);
      throw error;
    }
  },

  async getUnreadCount(uid: string): Promise<number> {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('uid', '==', uid),
        where('read', '==', false)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  },

  async markAsRead(notificationId: string): Promise<void> {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        read: true,
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  async markAllAsRead(uid: string): Promise<void> {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('uid', '==', uid),
        where('read', '==', false)
      );

      const querySnapshot = await getDocs(q);
      const updatePromises = querySnapshot.docs.map(docSnapshot =>
        updateDoc(doc(db, 'notifications', docSnapshot.id), { read: true })
      );

      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  async notifyAdmins(title: string, body: string, type: Notification['type'], meta?: Record<string, any>): Promise<void> {
    try {
      const { firestoreService } = await import('./firestoreService');
      const users = await firestoreService.query<any>('users', [
        { field: 'role', operator: '==', value: 'admin' }
      ]);

      const promises = users.map(user =>
        this.createNotification(user.uid, title, body, type, meta)
      );

      await Promise.all(promises);
    } catch (error) {
      console.error('Error notifying admins:', error);
      throw error;
    }
  },
};
