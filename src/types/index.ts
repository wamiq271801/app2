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

export interface User {
  id: string;
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  permissions?: Permission[];
  createdAt: string;
  updatedAt: string;
}

export type UserRole =
  | 'admin'
  | 'principal'
  | 'teacher'
  | 'feeManager'
  | 'gatekeeper'
  | 'peon'
  | 'canteenManager'
  | 'itAdmin';

export interface Permission {
  collection: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
  filter?: Record<string, any>;
}

export interface Exam {
  id: string;
  name: string;
  type: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  classes: string[];
  subjects: Subject[];
  weightings?: Record<string, number>;
  published: boolean;
  locked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: string;
  name: string;
  maxMarks: number;
  passingMarks: number;
}

export interface Marks {
  id: string;
  examId: string;
  studentId: string;
  subjectId: string;
  marksObtained: number;
  maxMarks: number;
  grade?: string;
  remarks?: string;
  enteredBy: string;
  enteredAt: string;
  updatedAt: string;
}

export interface StudentResult {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  class: string;
  section: string;
  totalMarks: number;
  marksObtained: number;
  percentage: number;
  grade: string;
  rank?: number;
  subjects: SubjectResult[];
  attendance?: number;
  remarks?: string;
  generatedAt: string;
}

export interface SubjectResult {
  subjectId: string;
  subjectName: string;
  marksObtained: number;
  maxMarks: number;
  grade: string;
}

export interface GradeSystem {
  id: string;
  name: string;
  boundaries: GradeBoundary[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GradeBoundary {
  grade: string;
  minPercentage: number;
  maxPercentage: number;
  gradePoint?: number;
}

export interface ActivityLog {
  id: string;
  actorUid: string;
  actorName: string;
  action: 'create' | 'update' | 'delete' | 'publish' | 'unpublish' | 'revert';
  entityType: string;
  entityId: string;
  diff?: Record<string, { old: any; new: any }>;
  snapshot?: Record<string, any>;
  timestamp: string;
  meta?: Record<string, any>;
}

export interface Notification {
  id: string;
  uid: string;
  title: string;
  body: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  meta?: Record<string, any>;
  createdAt: string;
}

export interface FileMeta {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  storageType: 'indexeddb' | 'firebase';
  storagePath?: string;
  ownerType: 'student' | 'teacher' | 'staff' | 'school';
  ownerId: string;
  uploadedBy: string;
  uploadedAt: string;
  migratedAt?: string;
}

export interface ScheduledTask {
  id: string;
  type: 'reminder' | 'export' | 'notification';
  scheduledFor: string;
  payload: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  attempts: number;
  lastAttempt?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FeeInvoice {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  academicYear: string;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  dueDate: string;
  status: 'paid' | 'partial' | 'pending' | 'overdue';
  concession?: number;
  concessionReason?: string;
  payments: Payment[];
  adjustments: Adjustment[];
  refunds: Refund[];
  reconciled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  method: 'cash' | 'card' | 'online' | 'cheque' | 'bank';
  referenceNumber?: string;
  remarks?: string;
  receivedBy: string;
}

export interface Adjustment {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  reason: string;
  date: string;
  authorizedBy: string;
}

export interface Refund {
  id: string;
  amount: number;
  reason: string;
  date: string;
  method: 'cash' | 'bank';
  referenceNumber?: string;
  authorizedBy: string;
  status: 'pending' | 'approved' | 'completed';
}

export interface BankReconciliation {
  id: string;
  uploadedFile: string;
  uploadedAt: string;
  uploadedBy: string;
  totalTransactions: number;
  matchedTransactions: number;
  unmatchedTransactions: number;
  matches: ReconciliationMatch[];
  status: 'pending' | 'partial' | 'completed';
  completedAt?: string;
}

export interface ReconciliationMatch {
  bankTransactionId: string;
  paymentId?: string;
  invoiceId?: string;
  amount: number;
  date: string;
  matched: boolean;
  confidence: number;
}

export interface Report {
  id: string;
  name: string;
  type: 'prebuilt' | 'custom';
  category: string;
  dataset: string;
  fields: string[];
  filters: Record<string, any>;
  groupBy?: string[];
  sortBy?: string;
  format: 'csv' | 'xlsx' | 'pdf';
  createdBy: string;
  createdAt: string;
  lastRun?: string;
}

export interface ScheduledExport {
  id: string;
  reportId: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  nextRun: string;
  recipients: string[];
  format: 'csv' | 'xlsx' | 'pdf';
  active: boolean;
  lastRun?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DailyAggregate {
  id: string;
  date: string;
  totalStudents: number;
  activeStudents: number;
  newAdmissions: number;
  attendancePercentage: number;
  feeCollected: number;
  outstandingFees: number;
  classwiseAttendance: Record<string, number>;
  createdAt: string;
}
