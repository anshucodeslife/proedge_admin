import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [
    { id: 1, studentName: 'Alice Smith', courseName: 'Mathematics 101', batchName: 'Class 10-A', date: '2024-01-20', status: 'Active' },
    { id: 2, studentName: 'Bob Jones', courseName: 'Physics 202', batchName: 'Class 9-B', date: '2024-02-05', status: 'Active' },
  ],
};

const enrollmentSlice = createSlice({
  name: 'enrollments',
  initialState,
  reducers: {
    enrollStudent: (state, action) => {
      state.list.push({ ...action.payload, id: state.list.length + 1, status: 'Active', date: new Date().toISOString().split('T')[0] });
    },
  },
});

export const { enrollStudent } = enrollmentSlice.actions;
export default enrollmentSlice.reducer;
