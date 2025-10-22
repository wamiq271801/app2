import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/routes/ProtectedRoute";
import { DashboardLayout } from "./components/layout/DashboardLayout";

// Auth Pages
import { LoginPage } from "./features/auth/LoginPage";
import { ResetPasswordPage } from "./features/auth/ResetPasswordPage";

// Dashboard Pages
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { StudentsPage } from "./features/students/StudentsPage";
import { StudentForm } from "./features/students/StudentForm";
import { StudentProfile } from "./features/students/StudentProfile";
import { TeachersPage } from "./features/teachers/TeachersPage";
import { StaffPage } from "./features/staff/StaffPage";
import { AttendancePage } from "./features/attendance/AttendancePage";
import { FeesPage } from "./features/fees/FeesPage";
import { SettingsPage } from "./features/settings/SettingsPage";
import NotFound from "./pages/NotFound";

import { AnalyticsDashboard } from "./features/analytics/AnalyticsDashboard";
import { ExamsPage } from "./features/exams/ExamsPage";
import { NotificationCenterPage } from "./features/notifications/NotificationCenter";
import { ActivityLogPage } from "./features/activityLog/ActivityLogPage";
import { FileMigrationTool } from "./features/files/FileMigrationTool";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            
            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              
              {/* Students */}
              <Route path="students" element={<StudentsPage />} />
              <Route path="students/add" element={<StudentForm />} />
              <Route path="students/:id" element={<StudentProfile />} />
              <Route path="students/:id/edit" element={<StudentForm />} />
              
              {/* Teachers */}
              <Route path="teachers" element={<TeachersPage />} />
              
              {/* Staff */}
              <Route path="staff" element={<StaffPage />} />
              
              {/* Attendance */}
              <Route path="attendance" element={<AttendancePage />} />
              
              {/* Fees */}
              <Route path="fees" element={<FeesPage />} />

              {/* Analytics */}
              <Route path="analytics" element={<AnalyticsDashboard />} />

              {/* Exams */}
              <Route path="exams" element={<ExamsPage />} />

              {/* Notifications */}
              <Route path="notifications" element={<NotificationCenterPage />} />

              {/* Activity Log */}
              <Route path="activity-log" element={<ActivityLogPage />} />

              {/* File Migration */}
              <Route path="file-migration" element={<FileMigrationTool />} />

              {/* Settings */}
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
