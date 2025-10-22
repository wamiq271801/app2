import { collection, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Student, FeeRecord, AttendanceRecord, DailyAggregate } from '@/types';

export interface KPIData {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  newAdmissions: number;
  attendancePercentage: number;
  feeCollected: number;
  outstandingFees: number;
  classwiseAttendance: Record<string, number>;
  feesByStatus: {
    paid: number;
    partial: number;
    pending: number;
  };
}

export interface AnalyticsFilter {
  startDate?: string;
  endDate?: string;
  class?: string;
  section?: string;
  status?: string;
  gender?: string;
}

export const analyticsService = {
  async calculateKPIs(filter?: AnalyticsFilter): Promise<KPIData> {
    try {
      const students = await this.getFilteredStudents(filter);
      const attendanceRecords = await this.getFilteredAttendance(filter);
      const feeRecords = await this.getFilteredFees(filter);

      const activeStudents = students.filter(s => s.status === 'active').length;
      const inactiveStudents = students.filter(s => s.status === 'inactive').length;

      const newAdmissions = filter?.startDate
        ? students.filter(s => s.admissionDate >= filter.startDate!).length
        : 0;

      const totalAttendance = attendanceRecords.length;
      const presentCount = attendanceRecords.filter(a => a.status === 'present').length;
      const attendancePercentage = totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0;

      const feeCollected = feeRecords.reduce((sum, f) => sum + f.paidAmount, 0);
      const outstandingFees = feeRecords.reduce((sum, f) => sum + f.balance, 0);

      const classwiseAttendance: Record<string, number> = {};
      const classAttendanceMap = new Map<string, { total: number; present: number }>();

      attendanceRecords.forEach(record => {
        const key = `${record.class}-${record.section}`;
        if (!classAttendanceMap.has(key)) {
          classAttendanceMap.set(key, { total: 0, present: 0 });
        }
        const data = classAttendanceMap.get(key)!;
        data.total++;
        if (record.status === 'present') data.present++;
      });

      classAttendanceMap.forEach((value, key) => {
        classwiseAttendance[key] = value.total > 0 ? (value.present / value.total) * 100 : 0;
      });

      const feesByStatus = {
        paid: feeRecords.filter(f => f.status === 'paid').length,
        partial: feeRecords.filter(f => f.status === 'partial').length,
        pending: feeRecords.filter(f => f.status === 'pending').length,
      };

      return {
        totalStudents: students.length,
        activeStudents,
        inactiveStudents,
        newAdmissions,
        attendancePercentage,
        feeCollected,
        outstandingFees,
        classwiseAttendance,
        feesByStatus,
      };
    } catch (error) {
      console.error('Error calculating KPIs:', error);
      throw error;
    }
  },

  async getFilteredStudents(filter?: AnalyticsFilter): Promise<Student[]> {
    try {
      let q = query(collection(db, 'students'));

      if (filter?.class) {
        q = query(q, where('class', '==', filter.class));
      }
      if (filter?.section) {
        q = query(q, where('section', '==', filter.section));
      }
      if (filter?.status) {
        q = query(q, where('status', '==', filter.status));
      }

      const querySnapshot = await getDocs(q);
      let students = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Student[];

      if (filter?.startDate) {
        students = students.filter(s => s.admissionDate >= filter.startDate!);
      }
      if (filter?.endDate) {
        students = students.filter(s => s.admissionDate <= filter.endDate!);
      }

      return students;
    } catch (error) {
      console.error('Error getting filtered students:', error);
      throw error;
    }
  },

  async getFilteredAttendance(filter?: AnalyticsFilter): Promise<AttendanceRecord[]> {
    try {
      let q = query(collection(db, 'attendance'));

      if (filter?.class) {
        q = query(q, where('class', '==', filter.class));
      }
      if (filter?.section) {
        q = query(q, where('section', '==', filter.section));
      }

      const querySnapshot = await getDocs(q);
      let records = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AttendanceRecord[];

      if (filter?.startDate) {
        records = records.filter(r => r.date >= filter.startDate!);
      }
      if (filter?.endDate) {
        records = records.filter(r => r.date <= filter.endDate!);
      }

      return records;
    } catch (error) {
      console.error('Error getting filtered attendance:', error);
      throw error;
    }
  },

  async getFilteredFees(filter?: AnalyticsFilter): Promise<FeeRecord[]> {
    try {
      let q = query(collection(db, 'fees'));

      if (filter?.class) {
        q = query(q, where('class', '==', filter.class));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FeeRecord[];
    } catch (error) {
      console.error('Error getting filtered fees:', error);
      throw error;
    }
  },

  async getEnrollmentTrend(months: number = 12): Promise<{ month: string; count: number }[]> {
    try {
      const students = await getDocs(collection(db, 'students'));
      const studentData = students.docs.map(doc => doc.data() as Student);

      const now = new Date();
      const monthsData: { month: string; count: number }[] = [];

      for (let i = months - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = date.toISOString().slice(0, 7);
        const count = studentData.filter(s => s.admissionDate.startsWith(monthKey)).length;

        monthsData.push({
          month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          count,
        });
      }

      return monthsData;
    } catch (error) {
      console.error('Error getting enrollment trend:', error);
      throw error;
    }
  },

  async getAttendanceTrend(days: number = 30): Promise<{ date: string; percentage: number }[]> {
    try {
      const now = new Date();
      const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

      const q = query(collection(db, 'attendance'), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      const records = querySnapshot.docs.map(doc => doc.data() as AttendanceRecord);

      const dateMap = new Map<string, { total: number; present: number }>();

      records.forEach(record => {
        if (record.date >= startDate.toISOString().split('T')[0]) {
          if (!dateMap.has(record.date)) {
            dateMap.set(record.date, { total: 0, present: 0 });
          }
          const data = dateMap.get(record.date)!;
          data.total++;
          if (record.status === 'present') data.present++;
        }
      });

      const trendData: { date: string; percentage: number }[] = [];
      dateMap.forEach((value, date) => {
        trendData.push({
          date,
          percentage: value.total > 0 ? (value.present / value.total) * 100 : 0,
        });
      });

      return trendData.sort((a, b) => a.date.localeCompare(b.date));
    } catch (error) {
      console.error('Error getting attendance trend:', error);
      throw error;
    }
  },

  async getFeeCollectionTrend(months: number = 12): Promise<{ month: string; collected: number; outstanding: number }[]> {
    try {
      const fees = await getDocs(collection(db, 'fees'));
      const feeData = fees.docs.map(doc => doc.data() as FeeRecord);

      const now = new Date();
      const monthsData: { month: string; collected: number; outstanding: number }[] = [];

      for (let i = months - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = date.toISOString().slice(0, 7);

        let collected = 0;
        let outstanding = 0;

        feeData.forEach(fee => {
          fee.paymentHistory.forEach(payment => {
            if (payment.date.startsWith(monthKey)) {
              collected += payment.amount;
            }
          });

          if (fee.balance > 0) {
            outstanding += fee.balance;
          }
        });

        monthsData.push({
          month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          collected,
          outstanding,
        });
      }

      return monthsData;
    } catch (error) {
      console.error('Error getting fee collection trend:', error);
      throw error;
    }
  },
};
