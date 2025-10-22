# Phase-2 School Admin Console - Documentation

## Overview

Phase-2 transforms the school admin console into a production-ready, scalable system with comprehensive analytics, exam management, audit trails, and advanced operational features while preserving all Phase-1 functionality.

## New Features

### 1. Analytics Dashboard (`/analytics`)

**Location:** `src/features/analytics/AnalyticsDashboard.tsx`

**Key Features:**
- Real-time KPI calculation (total students, active/inactive, attendance %, fee collection)
- Advanced filtering by date range, class, section, status
- Interactive charts:
  - Enrollment trend (6 months line chart)
  - Attendance trend (30 days line chart)
  - Fee collection trend (6 months bar chart)
  - Fee status distribution (pie chart)
- Export capabilities for reports

**Services:**
- `analyticsService.ts` - Client-side aggregation engine
- Supports filtering and drill-down queries

**Usage:**
```typescript
import { analyticsService } from '@/services/analyticsService';

const kpis = await analyticsService.calculateKPIs({
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  class: '10',
  section: 'A'
});
```

---

### 2. Exams & Marks Module (`/exams`)

**Location:** `src/features/exams/ExamsPage.tsx`

**Key Features:**
- Create and manage exams with subjects, classes, and date ranges
- Marks entry with validation and auto-save
- Grade calculation based on configurable grade systems
- Publish results workflow (locks marks after publication)
- Generate student report cards (PDF)
- Track exam status (draft, published, locked)

**Services:**
- `examService.ts` - Complete exam lifecycle management
- Supports marks storage per student/subject
- Batch result generation with ranking

**Data Model:**
```typescript
Exam {
  name, type, academicYear, startDate, endDate
  classes[], subjects[], weightings
  published, locked
}

Marks {
  examId, studentId, subjectId
  marksObtained, maxMarks, grade
  enteredBy, enteredAt
}

StudentResult {
  examId, studentId, totalMarks, percentage, grade
  subjects[], rank, attendance
}
```

---

### 3. Activity Log & Audit Trail (`/activity-log`)

**Location:** `src/features/activityLog/ActivityLogPage.tsx`

**Key Features:**
- Immutable activity logs for all CRUD operations
- Field-level change tracking (diff viewer)
- Snapshot storage for revert functionality
- Filter by entity type and entity ID
- Timeline view with actor information
- Detailed view modal with changes, snapshots, and metadata

**Services:**
- `activityLogService.ts` - Logging and history retrieval
- `computeDiff()` - Field-level diff calculation
- `revertToSnapshot()` - Restore entity to previous state

**Usage:**
```typescript
import { activityLogService } from '@/services/activityLogService';

await activityLogService.logActivity(
  actorUid,
  actorName,
  'update',
  'students',
  studentId,
  { name: { old: 'John', new: 'John Doe' } }
);

const history = await activityLogService.getEntityHistory('students', studentId);
```

---

### 4. Notifications System

**Components:**
- Notification Bell (Topbar): Real-time unread count with dropdown
- Notification Center Page (`/notifications`): Full notification history

**Key Features:**
- In-app notifications with read/unread status
- Notification types: info, success, warning, error
- Mark as read (individual or all)
- Auto-generated notifications on key events

**Services:**
- `notificationService.ts` - Create and manage notifications
- `notifyAdmins()` - Broadcast to all admin users

**Usage:**
```typescript
import { notificationService } from '@/services/notificationService';

await notificationService.createNotification(
  userId,
  'Invoice Due',
  'Invoice #123 is due in 7 days',
  'warning',
  { invoiceId: '123' }
);
```

---

### 5. File Migration Tool (`/file-migration`)

**Location:** `src/features/files/FileMigrationTool.tsx`

**Key Features:**
- List all files stored in IndexedDB
- Select individual or bulk files for migration
- Migrate to Firebase Cloud Storage with progress tracking
- Show real-time migration status (pending, uploading, completed, failed)
- Display file size and estimate storage costs
- Update Firestore metadata automatically

**Services:**
- `fileMigrationService.ts` - IndexedDB → Firebase Storage migration
- `getFileFromIndexedDB()` - Retrieve local blobs
- `migrateFilesInBatch()` - Batch processing with retry

**Migration Flow:**
1. Load files with `storageType === 'indexeddb'`
2. Select files for migration
3. Read blob from IndexedDB
4. Upload to Firebase Storage at `files/{ownerType}/{ownerId}/{uuid}_{filename}`
5. Update `fileMeta` document with new storage path
6. Optionally delete local blob

---

### 6. Enhanced Fees Module (Phase-2 additions)

**New TypeScript Interfaces:**
```typescript
FeeInvoice {
  concession, concessionReason
  payments[], adjustments[], refunds[]
  reconciled
}

Payment {
  method: 'cash' | 'card' | 'online' | 'cheque' | 'bank'
  referenceNumber
}

Adjustment {
  type: 'credit' | 'debit'
  reason, authorizedBy
}

Refund {
  amount, reason, method
  status: 'pending' | 'approved' | 'completed'
}
```

**Future Features:**
- Bank reconciliation UI
- Aging reports
- Payment history with audit trail

---

## Security & Access Control

### Firestore Security Rules

**File:** `firestore.rules`

**Key Functions:**
- `isAuthenticated()` - Check if user is logged in
- `isAdmin()` - Admin role check
- `isPrincipal()` - Principal role check
- `isTeacher()` - Teacher role check
- `isFeeManager()` - Fee manager role check
- `hasRole(role)` - Generic role check

**Access Patterns:**
- Students, Teachers, Staff: Admin/Principal can create/update, all can read
- Attendance: Admin/Principal/Teacher can write
- Fees: Admin/Principal/FeeManager can write
- Exams: Admin/Principal can manage, Teacher can enter marks
- Activity Logs: Read-only for Admin/Principal, immutable for all
- Notifications: User can only read/update their own

**Rules Testing:**
Use Firebase Emulator Suite to test rules before deploying.

---

## Firestore Composite Indexes

**File:** `firestore.indexes.json`

**Key Indexes:**
- `students` by `class + admissionDate`
- `students` by `class + section + status`
- `attendance` by `class + date`
- `attendance` by `studentId + date`
- `fees` by `studentId + status`
- `exams` by `academicYear + startDate`
- `activityLogs` by `entityType + entityId + timestamp`
- `notifications` by `uid + createdAt`
- `notifications` by `uid + read + createdAt`

**Deployment:**
Deploy indexes to Firebase using the Firebase CLI or Console.

---

## Services Architecture

### Core Services

1. **analyticsService.ts** - KPI calculation, trend analysis, filtering
2. **examService.ts** - Exam CRUD, marks entry, result generation
3. **activityLogService.ts** - Activity logging, history, revert
4. **notificationService.ts** - Notification creation and management
5. **fileMigrationService.ts** - File migration and storage management
6. **firestoreService.ts** - Generic Firestore CRUD operations (Phase-1)

### Service Design Principles

- **Idempotency:** All write operations check state before modifying
- **Transactions:** Use Firestore transactions for multi-document updates (e.g., publish results)
- **Error Handling:** All services include try-catch with meaningful error messages
- **Type Safety:** Full TypeScript typing for all entities

---

## Data Model (Phase-2 Additions)

### New Collections

1. **exams** - Exam definitions
2. **marks/{examId}/students** - Per-exam marks (subcollection)
3. **results/{examId}/students** - Published results (subcollection)
4. **activityLogs** - Immutable audit trail
5. **notifications** - User notifications
6. **fileMeta** - File metadata (extended with migration fields)
7. **scheduledTasks** - For future scheduled exports/reminders
8. **emailTemplates** - For future email notifications
9. **gradeSystems** - Configurable grade boundaries
10. **dailyAggregates** - Pre-computed analytics (optional)

### Extended Collections

- **users** - Added `role` and `permissions[]`
- **fileMeta** - Added `storageType`, `storagePath`, `migratedAt`

---

## Future Enhancements (Not Yet Implemented)

### 1. Cloud Functions (Serverless)

**Recommended Functions:**
- `sendEmail()` - SendGrid/Twilio email sending
- `processScheduledTasks()` - Cloud Scheduler trigger for reminders
- `generateExport()` - Generate CSV/PDF exports and upload to Storage
- `reconcileBankStatement()` - Parse CSV and match payments
- `onInvoiceCreatedGenerateNotification()` - Firestore trigger

**Note:** Cloud Functions require Firebase Blaze plan and separate deployment.

### 2. Advanced Reports Center

- Prebuilt reports (attendance summary, fee collection, exam results)
- Custom report builder with field selection and filters
- Scheduled exports (daily/weekly/monthly)
- Export formats: CSV, XLSX, PDF

### 3. Role & Permission Management UI

- Role editor with permissions matrix
- Per-collection CRUD permissions
- Per-record filters (e.g., teacher can only see assigned classes)

### 4. Backup & Restore

- Full database export (JSON + file attachments)
- Restore UI with conflict resolution
- Snapshot listing and retention policy

### 5. Email/SMS Notifications

- Template-based email system
- Scheduled reminders (invoice due, low attendance)
- SMS integration via Twilio (optional)

---

## Testing Strategy

### Unit Tests

Test key utility functions and services:
- `analyticsService.calculateKPIs()`
- `activityLogService.computeDiff()`
- `examService.calculateGrade()`

### E2E Tests (Recommended)

Use Playwright or Cypress:
1. Create exam → Enter marks → Publish results
2. View analytics dashboard with filters
3. Migrate file from IndexedDB to Storage
4. View activity log and revert snapshot
5. Receive and read notifications

### Firestore Rules Tests

Use Firebase Emulator:
```bash
firebase emulators:start
firebase emulators:exec "npm test"
```

Test scenarios:
- Admin can read/write all collections
- Teacher can only enter marks for assigned classes
- User can only read their own notifications

---

## Deployment

### 1. Frontend Deployment

Deploy to Vercel or Firebase Hosting:
```bash
npm run build
firebase deploy --only hosting
```

### 2. Firestore Rules & Indexes

Deploy rules and indexes:
```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

### 3. Environment Variables

Ensure `.env` contains:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
```

### 4. Cloud Functions (Future)

Deploy functions:
```bash
cd functions
npm install
firebase deploy --only functions
```

---

## Performance Optimization

### Client-Side Optimization

1. **Pagination:** Implement Firestore query pagination for large lists
2. **Virtualization:** Use react-window for 10k+ student lists
3. **Memoization:** Memoize expensive KPI calculations
4. **Lazy Loading:** Code-split heavy features (analytics, exams)

### Firestore Optimization

1. **Composite Indexes:** Deploy all required indexes
2. **Query Optimization:** Use `limit()` and pagination
3. **Batch Reads:** Use `Promise.all()` for parallel reads
4. **Avoid N+1 Queries:** Fetch related data in batches

### Monitoring

1. **Firebase Performance Monitoring:** Track page load times
2. **Sentry:** Frontend error tracking
3. **Firestore Usage Dashboard:** Monitor read/write operations
4. **Billing Alerts:** Set up GCP billing alerts

---

## Migration from Phase-1 to Phase-2

### Step-by-Step Migration

1. **Deploy Firestore Indexes:**
   ```bash
   firebase deploy --only firestore:indexes
   ```

2. **Deploy Security Rules:**
   ```bash
   firebase deploy --only firestore:rules
   ```

3. **Seed User Roles:**
   Create `users` collection with admin user:
   ```javascript
   {
     uid: 'firebase-auth-uid',
     email: 'admin@school.edu',
     name: 'Admin User',
     role: 'admin',
     createdAt: new Date().toISOString()
   }
   ```

4. **Migrate Files (Optional):**
   Use File Migration Tool at `/file-migration` to migrate IndexedDB files to Firebase Storage.

5. **Test in Staging:**
   Create a separate Firebase project for staging and test all features.

6. **Deploy to Production:**
   ```bash
   npm run build
   firebase deploy
   ```

---

## Troubleshooting

### Common Issues

**1. Missing Index Error**
- Deploy indexes: `firebase deploy --only firestore:indexes`
- Wait 2-3 minutes for indexes to build

**2. Permission Denied Error**
- Check Firestore rules
- Verify user role in `users` collection
- Test rules in Firebase Emulator

**3. File Migration Fails**
- Check IndexedDB database exists
- Verify Firebase Storage bucket is configured
- Check browser console for errors

**4. Analytics KPIs are Slow**
- Implement `dailyAggregates` collection for pre-computed data
- Use Cloud Functions to compute aggregates nightly

**5. Notification Bell Not Updating**
- Check `notifications` collection structure
- Verify `uid` matches authenticated user
- Check Firestore rules allow read access

---

## Support & Maintenance

### Regular Maintenance Tasks

1. **Weekly:**
   - Review activity logs for anomalies
   - Check Firestore usage metrics
   - Monitor billing alerts

2. **Monthly:**
   - Backup Firestore data
   - Review and archive old activity logs
   - Update Firebase SDK if needed

3. **Quarterly:**
   - Security rules audit
   - Performance optimization review
   - User role and permission audit

---

## Contact

For questions or support:
- Review this documentation first
- Check Firebase Console for errors
- Review browser console for client-side issues
- Test in Firebase Emulator for rule-related issues

---

## License

This is a school management system. Use responsibly and ensure data privacy compliance (GDPR/FERPA).
