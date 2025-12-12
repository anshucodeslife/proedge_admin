import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import studentReducer from './slices/studentSlice';
import enquiryReducer from './slices/enquirySlice';
import referralReducer from './slices/referralSlice';
import logReducer from './slices/logSlice';
import admissionReducer from './slices/admissionSlice';
import courseReducer from './slices/courseSlice';
import moduleReducer from './slices/moduleSlice';
import batchReducer from './slices/batchSlice';
import enrollmentReducer from './slices/enrollmentSlice';
import attendanceReducer from './slices/attendanceSlice';
import notificationReducer from './slices/notificationSlice';
import paymentReducer from './slices/paymentSlice';
import staffReducer from './slices/staffSlice';
import parentReducer from './slices/parentSlice';
import questionReducer from './slices/questionSlice';
import dashboardReducer from './slices/dashboardSlice';
import tutorReducer from './slices/tutorSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    students: studentReducer,
    enquiries: enquiryReducer,
    referrals: referralReducer,
    logs: logReducer,
    admissions: admissionReducer,
    courses: courseReducer,
    modules: moduleReducer,
    batches: batchReducer,
    enrollments: enrollmentReducer,
    attendance: attendanceReducer,
    notifications: notificationReducer,
    payments: paymentReducer,
    staff: staffReducer,
    parents: parentReducer,
    questions: questionReducer,
    dashboard: dashboardReducer,
    tutors: tutorReducer,
    users: userReducer,
  },
});

