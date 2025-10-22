import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Exam, Marks, StudentResult, GradeSystem, SubjectResult } from '@/types';

export const examService = {
  async createExam(examData: Omit<Exam, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const exam = {
        ...examData,
        published: false,
        locked: false,
        createdAt: Timestamp.now().toDate().toISOString(),
        updatedAt: Timestamp.now().toDate().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'exams'), exam);
      return docRef.id;
    } catch (error) {
      console.error('Error creating exam:', error);
      throw error;
    }
  },

  async updateExam(examId: string, updates: Partial<Exam>): Promise<void> {
    try {
      const examRef = doc(db, 'exams', examId);
      await updateDoc(examRef, {
        ...updates,
        updatedAt: Timestamp.now().toDate().toISOString(),
      });
    } catch (error) {
      console.error('Error updating exam:', error);
      throw error;
    }
  },

  async getExam(examId: string): Promise<Exam | null> {
    try {
      const examRef = doc(db, 'exams', examId);
      const examSnap = await getDoc(examRef);

      if (examSnap.exists()) {
        return { id: examSnap.id, ...examSnap.data() } as Exam;
      }
      return null;
    } catch (error) {
      console.error('Error getting exam:', error);
      throw error;
    }
  },

  async getAllExams(): Promise<Exam[]> {
    try {
      const q = query(collection(db, 'exams'), orderBy('startDate', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Exam[];
    } catch (error) {
      console.error('Error getting exams:', error);
      throw error;
    }
  },

  async saveMarks(marks: Omit<Marks, 'id'>): Promise<string> {
    try {
      const marksData = {
        ...marks,
        enteredAt: Timestamp.now().toDate().toISOString(),
        updatedAt: Timestamp.now().toDate().toISOString(),
      };

      const docRef = await addDoc(
        collection(db, `marks/${marks.examId}/students`),
        marksData
      );
      return docRef.id;
    } catch (error) {
      console.error('Error saving marks:', error);
      throw error;
    }
  },

  async getStudentMarks(examId: string, studentId: string): Promise<Marks[]> {
    try {
      const q = query(
        collection(db, `marks/${examId}/students`),
        where('studentId', '==', studentId)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Marks[];
    } catch (error) {
      console.error('Error getting student marks:', error);
      throw error;
    }
  },

  async getExamMarks(examId: string): Promise<Marks[]> {
    try {
      const querySnapshot = await getDocs(
        collection(db, `marks/${examId}/students`)
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Marks[];
    } catch (error) {
      console.error('Error getting exam marks:', error);
      throw error;
    }
  },

  async publishResults(
    examId: string,
    gradeSystem: GradeSystem,
    actorUid: string,
    actorName: string
  ): Promise<void> {
    try {
      const exam = await this.getExam(examId);
      if (!exam) throw new Error('Exam not found');

      const allMarks = await this.getExamMarks(examId);

      const studentMarksMap = new Map<string, Marks[]>();
      allMarks.forEach(mark => {
        if (!studentMarksMap.has(mark.studentId)) {
          studentMarksMap.set(mark.studentId, []);
        }
        studentMarksMap.get(mark.studentId)!.push(mark);
      });

      const batch = writeBatch(db);

      for (const [studentId, marks] of studentMarksMap.entries()) {
        const totalMarks = marks.reduce((sum, m) => sum + m.maxMarks, 0);
        const marksObtained = marks.reduce((sum, m) => sum + m.marksObtained, 0);
        const percentage = (marksObtained / totalMarks) * 100;
        const grade = this.calculateGrade(percentage, gradeSystem);

        const subjects: SubjectResult[] = marks.map(m => {
          const subject = exam.subjects.find(s => s.id === m.subjectId);
          const subjectPercentage = (m.marksObtained / m.maxMarks) * 100;
          return {
            subjectId: m.subjectId,
            subjectName: subject?.name || '',
            marksObtained: m.marksObtained,
            maxMarks: m.maxMarks,
            grade: this.calculateGrade(subjectPercentage, gradeSystem),
          };
        });

        const { firestoreService } = await import('./firestoreService');
        const student = await firestoreService.getById<any>('students', studentId);

        const result: Omit<StudentResult, 'id'> = {
          examId,
          studentId,
          studentName: student?.name || '',
          class: student?.class || '',
          section: student?.section || '',
          totalMarks,
          marksObtained,
          percentage,
          grade,
          subjects,
          generatedAt: Timestamp.now().toDate().toISOString(),
        };

        const resultRef = doc(collection(db, `results/${examId}/students`));
        batch.set(resultRef, result);
      }

      const examRef = doc(db, 'exams', examId);
      batch.update(examRef, {
        published: true,
        locked: true,
        updatedAt: Timestamp.now().toDate().toISOString(),
      });

      await batch.commit();

      const { activityLogService } = await import('./activityLogService');
      await activityLogService.logActivity(
        actorUid,
        actorName,
        'publish',
        'exam',
        examId,
        undefined,
        { published: true, locked: true },
        { studentsProcessed: studentMarksMap.size }
      );
    } catch (error) {
      console.error('Error publishing results:', error);
      throw error;
    }
  },

  calculateGrade(percentage: number, gradeSystem: GradeSystem): string {
    for (const boundary of gradeSystem.boundaries) {
      if (percentage >= boundary.minPercentage && percentage <= boundary.maxPercentage) {
        return boundary.grade;
      }
    }
    return 'F';
  },

  async getStudentResult(examId: string, studentId: string): Promise<StudentResult | null> {
    try {
      const q = query(
        collection(db, `results/${examId}/students`),
        where('studentId', '==', studentId)
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;

      return {
        id: querySnapshot.docs[0].id,
        ...querySnapshot.docs[0].data()
      } as StudentResult;
    } catch (error) {
      console.error('Error getting student result:', error);
      throw error;
    }
  },

  async getExamResults(examId: string): Promise<StudentResult[]> {
    try {
      const q = query(
        collection(db, `results/${examId}/students`),
        orderBy('percentage', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc, index) => ({
        id: doc.id,
        ...doc.data(),
        rank: index + 1,
      })) as StudentResult[];
    } catch (error) {
      console.error('Error getting exam results:', error);
      throw error;
    }
  },
};
