import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '../layouts/AdminLayout';
import { Login } from '../pages/Auth/Login';
import { Dashboard } from '../pages/Dashboard/Dashboard';
import { StudentsList } from '../pages/Students/StudentsList';
import { UsersList } from '../pages/Users/UsersList';
import Enquiries from '../pages/Enquiries/Enquiries';
// import Logs from '../pages/Logs/Logs.jsx';  // Temporarily disabled for build
import Referrals from '../pages/Referrals/Referrals';
import Admissions from '../pages/Admissions/Admissions';
import { CoursesList } from '../pages/Courses/CoursesList';
import { ModulesList } from '../pages/Modules/ModulesList';
import { BatchesList } from '../pages/Batches/BatchesList';
import { EnrollmentList } from '../pages/Enrollments/EnrollmentList';
import { AttendanceList } from '../pages/Attendance/AttendanceList';
import { NotificationList } from '../pages/Notifications/NotificationList';
import { PaymentsList } from '../pages/Payments/PaymentsList';
import { ProfileSettings } from '../pages/Settings/ProfileSettings';
import { StaffList } from '../pages/Staff/StaffList';
import { ParentsList } from '../pages/Parents/ParentsList';
import { QuestionBank } from '../pages/Questions/QuestionBank';
import { TutorsList } from '../pages/Tutors/TutorsList';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<UsersList />} />
        <Route path="students" element={<StudentsList />} />
        <Route path="enquiries" element={<Enquiries />} />
        {/* <Route path="logs" element={<Logs />} /> */}  {/* Temporarily disabled */}
        <Route path="referrals" element={<Referrals />} />
        <Route path="admissions" element={<Admissions />} />
        <Route path="courses" element={<CoursesList />} />
        <Route path="academics" element={<ModulesList />} /> {/* Using Modules as Academics/Syllabus for now as per menu */}
        <Route path="batches" element={<BatchesList />} />
        <Route path="enrollments" element={<EnrollmentList />} />
        <Route path="attendance" element={<AttendanceList />} />
        <Route path="notifications" element={<NotificationList />} />
        <Route path="payments" element={<PaymentsList />} />
        <Route path="settings" element={<ProfileSettings />} />

        {/* Mapped routes based on Sidebar menu items */}
        <Route path="staff" element={<StaffList />} />
        <Route path="parents" element={<ParentsList />} />
        <Route path="questions" element={<QuestionBank />} />
        <Route path="tutors" element={<TutorsList />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
