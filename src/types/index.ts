// Common Types for School Admin Dashboard

export interface Student {
  id: string;
  name: string;
  email: string;
  class: string;
  section: string;
  guardianName: string;
  guardianPhone: string;
  address: string;
  dateOfBirth: string;
  admissionDate: string;
  status: 'active' | 'inactive';
  photoURL?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  qualifications: string;
  experience: string;
  joiningDate: string;
  status: 'active' | 'inactive';
  address: string;
  photoURL?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  joiningDate: string;
  status: 'active' | 'inactive';
  address: string;
  photoURL?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  section: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  remarks?: string;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  totalFees: number;
  paidAmount: number;
  balance: number;
  lastPaymentDate?: string;
  paymentHistory: PaymentEntry[];
  status: 'paid' | 'partial' | 'pending';
}

export interface PaymentEntry {
  id: string;
  amount: number;
  date: string;
  method: 'cash' | 'card' | 'online';
  remarks?: string;
}

export interface SchoolSettings {
  id: string;
  schoolName: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  academicYear: string;
  logoURL?: string;
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY';
}
